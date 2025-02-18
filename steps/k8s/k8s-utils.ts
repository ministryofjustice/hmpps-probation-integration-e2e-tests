import { BatchV1Api, CoreV1Api, Exec, KubeConfig, V1EnvVar } from '@kubernetes/client-node'
import { DateTime } from 'luxon'

/**
 * Get the name of the first pod in a deployment
 * @param namespace
 * @param deploymentName
 */
export async function getPodName(namespace: string, deploymentName: string): Promise<string> {
    const kubeConfig = new KubeConfig()
    kubeConfig.loadFromDefault()
    const coreV1Api = kubeConfig.makeApiClient(CoreV1Api)
    const podsResponse = await coreV1Api.listNamespacedPod({ namespace, labelSelector: `app=${deploymentName}` })
    const name = podsResponse.items[0].metadata.name
    console.log('Found pod:', name)
    return name
}

/**
 * Execute a command in a pod container
 * @param namespace
 * @param podName
 * @param containerName
 * @param command
 * @param enableStdout
 * @param enableStderr
 */
export async function execCommand(
    namespace: string,
    podName: string,
    containerName: string,
    command: string | string[],
    enableStdout: boolean = false,
    enableStderr: boolean = true
) {
    const kubeConfig = new KubeConfig()
    kubeConfig.loadFromDefault()
    const exec = new Exec(kubeConfig)
    console.log('Starting k8s exec command at ', new Date())
    const stdout = enableStdout ? process.stdout : null
    const stderr = enableStderr ? process.stderr : null
    const status = await new Promise((resolve, reject) => {
        exec.exec(namespace, podName, containerName, command, stdout, stderr, null, false, v1Status => {
            if (v1Status.status === 'Failure') reject(new Error(v1Status.message))
            else resolve(v1Status)
        })
    })
    console.log('Completed k8s exec command at ', new Date(), ' with status ', status)
}

/**
 * Run a command in a new debug pod
 * @param namespace
 * @param podName
 * @param serviceAccountName
 * @param args
 * @param env
 */
export async function runPod(
    namespace: string,
    podName: string,
    serviceAccountName?: string,
    args: string[] = ["echo 'Hello world'"],
    env: V1EnvVar[] = []
): Promise<void> {
    const kubeConfig = new KubeConfig()
    kubeConfig.loadFromDefault()
    const coreV1Api = kubeConfig.makeApiClient(CoreV1Api)
    await coreV1Api.createNamespacedPod({
        namespace,
        body: {
            metadata: {
                namespace,
                name: podName,
            },
            spec: {
                serviceAccountName,
                restartPolicy: 'Never',
                containers: [
                    {
                        name: podName,
                        image: 'ghcr.io/ministryofjustice/hmpps-devops-tools:latest',
                        command: ['sh', '-c'],
                        args,
                        env,
                    },
                ],
            },
        },
    })
    console.log('Started pod:', podName)
    try {
        const started = Date.now()
        while (Date.now() - started < 30_000) {
            const pod = await coreV1Api.readNamespacedPod({ name: podName, namespace })
            if (pod.status?.phase === 'Succeeded') break
            if (pod.status?.phase === 'Failed') throw new Error('Pod failed.')
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
        console.log('Pod completed:', podName)
    } finally {
        await coreV1Api.deleteNamespacedPod({ name: podName, namespace })
        console.log('Pod deleted:', podName)
    }
}

/**
 * Run a cron job
 * @param namespace
 * @param cronJobName
 */
export async function triggerCronJob(namespace: string, cronJobName: string): Promise<void> {
    const kubeConfig = new KubeConfig()
    kubeConfig.loadFromDefault()
    const batchClient = kubeConfig.makeApiClient(BatchV1Api)
    const cronJob = await batchClient.readNamespacedCronJob({ name: cronJobName, namespace })
    const jobName = `${cronJobName}-manual-${Math.random().toString(16).slice(2, 8)}`
    const job = await batchClient.createNamespacedJob({
        body: {
            metadata: {
                namespace,
                name: jobName,
                ownerReferences: [
                    {
                        apiVersion: 'batch/v',
                        kind: 'CronJob',
                        name: cronJobName,
                        uid: cronJob.metadata.uid,
                        controller: true,
                    },
                ],
            },
            spec: cronJob.spec.jobTemplate.spec,
        },
        namespace,
    })
    console.log('Job started:', job.metadata.name)

    const started = DateTime.now()
    while (DateTime.now() < started.plus({ minutes: 5 })) {
        const { status } = await batchClient.readNamespacedJob({ namespace, name: jobName })
        if (status.succeeded) break
        if (status.failed) throw new Error(`Job ${jobName} failed`)
        await new Promise(resolve => setTimeout(resolve, 5000))
    }
    console.log('Job completed:', jobName)
}

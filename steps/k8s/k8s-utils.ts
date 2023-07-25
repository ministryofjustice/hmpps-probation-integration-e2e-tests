import { CoreV1Api, Exec, KubeConfig } from '@kubernetes/client-node'

/**
 * Get the name of the first pod in a deployment
 * @param namespace
 * @param deploymentName
 */
export async function getPodName(namespace: string, deploymentName: string): Promise<string> {
    const kubeConfig = new KubeConfig()
    kubeConfig.loadFromDefault()
    const coreV1Api = kubeConfig.makeApiClient(CoreV1Api)
    const podsResponse = await coreV1Api.listNamespacedPod(
        namespace,
        undefined,
        undefined,
        undefined,
        undefined,
        `app=${deploymentName}`
    )
    const name = podsResponse.body.items[0].metadata.name
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

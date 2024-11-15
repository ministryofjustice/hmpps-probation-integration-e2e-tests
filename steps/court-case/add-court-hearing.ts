import { runPod } from '../k8s/k8s-utils'
import { hearingData, SHEFFIELD_COURT } from './hearing-data'
import { Person } from '../delius/utils/person'

export async function addCourtHearing(person: Person, courtCode: string = SHEFFIELD_COURT.code) {
    await runPod(
        'court-probation-dev',
        'probation-integration-e2e-tests',
        'court-facing-api',
        ['aws sns publish --topic-arn "$TOPIC_ARN" --message "$MESSAGE" --message-attributes "$ATTRIBUTES"'],
        [
            { name: 'TOPIC_ARN', valueFrom: { secretKeyRef: { name: 'court-case-events-topic', key: 'topic_arn' } } },
            { name: 'MESSAGE', value: JSON.stringify(hearingData(person, courtCode)) },
            {
                name: 'ATTRIBUTES',
                value: JSON.stringify({
                    messageType: { DataType: 'String', StringValue: 'COMMON_PLATFORM_HEARING' },
                    hearingEventType: { DataType: 'String', StringValue: 'Unknown' },
                }),
            },
        ]
    )
}

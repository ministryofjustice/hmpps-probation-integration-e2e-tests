import { runPod } from '../../steps/k8s/k8s-utils'
import { hearingData, SHEFFIELD_COURT } from './data/hearing-data'
import { Person } from '../../steps/delius/utils/person'

export default (person: Person, courtCode: string = SHEFFIELD_COURT.code) =>
    runPod(
        'court-probation-dev',
        'probation-integration-e2e-tests',
        'court-case-service',
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

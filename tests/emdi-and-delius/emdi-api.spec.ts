import { expect, test } from '@playwright/test'
import { getPdus, getRegions, getTeamsByUsername } from '../../steps/api/emdi-api/emdi-api'
import { data } from '../../test-data/test-data'

test('can retrieve regions', async () => {
    const regions = await getRegions()
    await test.info().attach('GET regions response', {
        body: JSON.stringify(regions, null, 2),
        contentType: 'application/json',
    })

    expect(Array.isArray(regions)).toBe(true)
    expect(regions.length).toBeGreaterThan(0)
    for (const region of regions) {
        expect(region).toEqual(expect.objectContaining({ code: expect.any(String), description: expect.any(String) }))
    }
    expect(regions).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ code: 'N03', description: 'Wales' }),
            expect.objectContaining({ code: 'N07', description: 'London' }),
        ])
    )
})

test('can retrieve PDUs for a region', async () => {
    const regions = await getRegions()
    await test.info().attach('GET regions response', {
        body: JSON.stringify(regions, null, 2),
        contentType: 'application/json',
    })
    const region = regions.find(region => region.description === data.teams.genericTeam.provider)
    if (!region) {
        throw new Error(`Region not returned by EMDI API: ${data.teams.genericTeam.provider}`)
    }
    expect(region.code).toBe('N03')

    const pdus = await getPdus(region.code)
    await test.info().attach(`GET regions ${region.code} pdu response`, {
        body: JSON.stringify(pdus, null, 2),
        contentType: 'application/json',
    })

    expect(Array.isArray(pdus)).toBe(true)
    expect(pdus.length).toBeGreaterThan(0)
    for (const pdu of pdus) {
        expect(pdu).toEqual(expect.objectContaining({ code: expect.any(String), description: expect.any(String) }))
    }
    expect(pdus).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ code: 'N03ALL', description: 'All Wales' }),
            expect.objectContaining({ code: 'N03SW1', description: 'Cardiff and Vale' }),
            expect.objectContaining({ code: 'WPTNWS', description: 'North Wales' }),
        ])
    )
})

test('can retrieve teams for a Delius user', async () => {
    const username = process.env.DELIUS_USERNAME
    if (!username) {
        throw new Error('DELIUS_USERNAME must be configured for the EMDI user teams test')
    }
    const result = await getTeamsByUsername(username)
    await test.info().attach('GET user teams response', {
        body: JSON.stringify(result, null, 2),
        contentType: 'application/json',
    })

    expect(Array.isArray(result.teams)).toBe(true)
    expect(result.teams.length).toBeGreaterThan(0)
    for (const team of result.teams) {
        expect(team).toEqual(
            expect.objectContaining({
                code: expect.any(String),
                description: expect.any(String),
                pdu: expect.objectContaining({ code: expect.any(String), description: expect.any(String) }),
                region: expect.objectContaining({ code: expect.any(String), description: expect.any(String) }),
            })
        )
    }
    expect(result.teams).toContainEqual(
        expect.objectContaining({
            code: 'N03F01',
            description: data.teams.allocationsTestTeam.name,
            pdu: expect.objectContaining({
                code: 'WPTNWS',
                description: data.teams.allocationsTestTeam.probationDeliveryUnit,
            }),
            region: expect.objectContaining({
                code: 'N03',
                description: data.teams.allocationsTestTeam.provider,
            }),
        })
    )
})

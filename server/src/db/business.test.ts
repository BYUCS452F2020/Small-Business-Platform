import pg from 'pg'
import {create} from './business'

jest.mock('pg')

describe('Business DB', () => {
    afterEach(jest.resetAllMocks)

    describe('create', () => {
        beforeEach(() => {
            (pg.Pool as unknown as jest.Mock).mockRestore()
            ;(pg.Pool.prototype.query as jest.Mock).mockResolvedValue({
                rows: [
                {id: 123},
                ],
            })
        })
        it('inserts a new business and returns its id', async () => {
            const result = await create(
                'Nate Hood LLC', 'nate@hood.com', '@n8thegr8', 'www.linkedin.com/n8', 
                'This is a business to help all other businesses make money by paying us',
                undefined, 'abc123'
                )
                expect(result).toBe('abc123')
                expect(pg.Pool.prototype.query).toBeCalledWith(
                    expect.stringMatching(/^INSERT INTO "business"/),
                    expect.any(Array),
                  )
        })
    })
})
export const sanitiseError = <T>(fn: AsyncFunction<T>): AsyncFunction<T> => {
    return async (...args: unknown[]) => {
        try {
            return await fn(...args)
        } catch (error) {
            console.error(`Error in ${fn.name}:`, error)
            throw new Error('Unable to call API')
        }
    }
}

export const retry = <T>(fn: AsyncFunction<T>, retryCount = 2): AsyncFunction<T> => {
    let attempts = 0
    return async function retryFn(...args: unknown[]) {
        try {
            return await fn(...args)
        } catch (error) {
            if (attempts++ > retryCount) {
                console.error(`Failed after ${attempts} attempts`, error)
                throw new Error(`Failed after ${attempts} attempts`)
            }
            console.error(`Retrying error...`, error)
            return await retryFn(...args)
        }
    }
}

type AsyncFunction<T> = (...args: unknown[]) => Promise<T>

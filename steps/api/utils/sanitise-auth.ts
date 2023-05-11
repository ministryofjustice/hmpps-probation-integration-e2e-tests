export const sanitiseError = <T>(fn: AsyncFunction<T>): AsyncFunction<T> => {
    return async (...args) => {
        try {
            return await fn(...args)
        } catch (error) {
            console.error(`Error in ${fn.name}:`, error)
            throw Error('Unable to call API')
        }
    }
}

type AsyncFunction<T> = (...args: any[]) => Promise<T>

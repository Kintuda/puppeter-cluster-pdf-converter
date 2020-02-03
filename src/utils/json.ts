export const parseJson = <T>(content: string): T | null => {
    try {
        const data = JSON.parse(content) as T
        return data
    } catch (error) {
        return null
    }
}
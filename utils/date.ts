export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return format
        .replace('YYYY', year.toString())
        .replace('MM', month)
        .replace('DD', day)
}

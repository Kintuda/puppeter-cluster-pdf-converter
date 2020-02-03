export interface CrawlerUrl {
    url: string
    callbackUrl?: string
    uniqueName?: string
}

export interface CrawlerHtmlContent {
    content: Buffer
    callbackUrl?: string
    uniqueName?: string
}
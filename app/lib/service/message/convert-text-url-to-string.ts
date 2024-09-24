import * as cheerio from 'cheerio'

const convertTextUrlToString = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url)
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`)

        const contentType = response.headers.get('content-type') || ''
        const buffer = await response.arrayBuffer()

        let content
        if (contentType.includes('html')) {
            content = await parseHtml(buffer)
        } else if (contentType.startsWith('text/')) {
            content = Buffer.from(buffer).toString().trim().replace(/\s+/g, ' ')
        } else {
            throw new Error(`Unsupported content type: ${contentType}`)
        }
        return `This is a converted content form ${contentType}: ${content}`
    } catch (error) {
        console.error('Error parsing text from URL:', url, 'error', error)
        throw error
    }
}

async function parseHtml(buffer: ArrayBuffer): Promise<string> {
    try {
        const html = Buffer.from(buffer).toString()
        const $ = cheerio.load(html, { decodeEntities: true })
        $(
            'script, style, [style*="display:none"], [style*="display: none"]'
        ).remove()
        let text = $('body').text()
        text = text.replace(/\s+/g, ' ').trim()
        text = text.replace(/&nbsp;/g, ' ')
        text = text.replace(/[\u200B-\u200D\uFEFF]/g, '')

        return text
    } catch (error) {
        console.error('Error parsing HTML:', error)
        throw new Error('Failed to parse HTML: ' + error)
    }
}

export { convertTextUrlToString }

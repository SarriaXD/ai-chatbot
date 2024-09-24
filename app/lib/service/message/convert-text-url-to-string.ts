import * as cheerio from 'cheerio'
import PDFParser from 'pdf2json'

const convertTextUrlToString = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url)
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`)

        const contentType = response.headers.get('content-type') || ''
        const buffer = await response.arrayBuffer()

        if (contentType.includes('html')) {
            return await parseHtml(buffer)
        } else if (url.endsWith('.pdf')) {
            return await extractTextFromPdf(buffer)
        } else if (contentType.startsWith('text/')) {
            return Buffer.from(buffer).toString().trim().replace(/\s+/g, ' ')
        } else {
            throw new Error(`Unsupported content type: ${contentType}`)
        }
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

function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser()
        pdfParser.on('pdfParser_dataError', reject)
        pdfParser.on('pdfParser_dataReady', (pdfData) => {
            let text = ''
            for (const page of pdfData.Pages) {
                for (const textItem of page.Texts) {
                    text += decodeURIComponent(textItem.R[0].T) + ' '
                }
            }
            resolve(text.trim().replace(/\s+/g, ' '))
        })
        pdfParser.parseBuffer(Buffer.from(buffer))
    })
}

export { convertTextUrlToString }

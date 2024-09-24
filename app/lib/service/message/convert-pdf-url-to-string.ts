import PDFParser from 'pdf2json'

const convertPDFUrlToString = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url)
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`)

        const contentType = response.headers.get('content-type') || ''
        const buffer = await response.arrayBuffer()

        if (contentType === 'application/pdf') {
            const result = await extractTextFromPdf(buffer)
            return `This is a converted content form ${contentType}: ${result}`
        } else {
            throw new Error(`Unsupported content type: ${contentType}`)
        }
    } catch (error) {
        console.error('Error parsing text from URL:', url, 'error', error)
        throw error
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

export { convertPDFUrlToString }

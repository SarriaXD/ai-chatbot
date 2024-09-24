import { Attachment, ImagePart, TextPart } from 'ai'
import { convertTextUrlToString } from '@lib/service/message/convert-text-url-to-string.ts'
import { convertPDFUrlToString } from '@lib/service/message/convert-pdf-url-to-string.ts'

type ContentPart = TextPart | ImagePart

/**
 * Converts a list of attachments to a list of content parts
 * for consumption by `ai/core` functions.
 * Currently only supports images and text attachments.
 */
export async function attachmentsToParts(
    attachments: Attachment[]
): Promise<ContentPart[]> {
    const parts: ContentPart[] = []

    for (const attachment of attachments) {
        if (attachment.contentType?.startsWith('image/')) {
            parts.push({ type: 'image', image: new URL(attachment.url) })
        }
        if (attachment.contentType?.startsWith('text/')) {
            const convertedText = await convertTextUrlToString(attachment.url)
            parts.push({
                type: 'text',
                text: convertedText,
            })
        }
        if (attachment.contentType === 'application/pdf') {
            const convertedText = await convertPDFUrlToString(attachment.url)
            parts.push({
                type: 'text',
                text: convertedText,
            })
        }
    }
    return parts
}

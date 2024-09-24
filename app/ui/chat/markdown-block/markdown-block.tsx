import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import 'github-markdown-css/github-markdown.css'
import { ImgHTMLAttributes, memo } from 'react'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import CopyButton from '@ui/chat/markdown-block/copy-button.tsx'
import ZoomableImage from '@ui/zoomable-image.tsx'

interface MarkdownBlockProps {
    markdown: string
}

const MarkdownBlock = ({ markdown }: MarkdownBlockProps) => {
    return (
        <MessageMarkdownMemoized
            className="markdown-body !bg-transparent !font-normal !text-[#ECECEC]"
            children={markdown}
            rehypePlugins={[
                [rehypeExternalLinks, { target: '_blank' }],
                [rehypeKatex],
            ]}
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
                code({ children, className, ...rest }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const code = String(children).replace(/\n$/, '')
                    return match ? (
                        <div>
                            <div className="flex justify-between bg-[#2F2F2F] px-4 py-2.5">
                                <span className="text-[#ECECEC]">
                                    {match[1]}
                                </span>
                                <CopyButton code={code} />
                            </div>
                            <div className="bg-[#0D0D0D] p-4">
                                <SyntaxHighlighter
                                    children={code}
                                    language={match[1]}
                                    style={vs2015}
                                    wrapLines={true}
                                    wrapLongLines={true}
                                    customStyle={{
                                        backgroundColor: 'transparent',
                                        fontSize: '100%',
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <code className={className} {...rest}>
                            {children}
                        </code>
                    )
                },
                pre({ children }) {
                    return (
                        <pre className={'!bg-transparent !p-0'}>{children}</pre>
                    )
                },
                img(props: ImgHTMLAttributes<HTMLImageElement>) {
                    return (
                        <div className="relative my-2 w-full">
                            <ZoomableImage src={props.src!} alt={props.alt!} />
                        </div>
                    )
                },
            }}
        />
    )
}

export const MessageMarkdownMemoized = memo(
    Markdown,
    (prevProps, nextProps) =>
        prevProps.children === nextProps.children &&
        prevProps.className === nextProps.className
)

export default MarkdownBlock

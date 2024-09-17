'use client'

import * as React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Check, Copy } from '@public/icons'
import { useEffect, useState } from 'react'

type Props = {
    code: string
}

const CopyButton = ({ code }: Props) => {
    const [copiedCode, setCopiedCode] = useState(false)
    useEffect(() => {
        if (copiedCode) {
            const timeout = setTimeout(() => {
                setCopiedCode(false)
            }, 3000)
            return () => clearTimeout(timeout)
        }
    }, [copiedCode])
    return (
        <button>
            <CopyToClipboard text={code} onCopy={() => setCopiedCode(true)}>
                {copiedCode ? (
                    <Check className="size-4 rounded border border-green-500 text-green-500" />
                ) : (
                    <Copy className="size-4 text-[#ECECEC]" />
                )}
            </CopyToClipboard>
        </button>
    )
}

export default CopyButton

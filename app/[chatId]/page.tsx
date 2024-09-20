// 'use client'
//
// import React, { useState } from 'react'
// import Chat from '@ui/chat/Assistant.tsx'
// import ChatHeader from '@ui/chat/chat-header.tsx'
// import { usePathname } from 'next/navigation'
//
// export default function Page() {
//     const [open, setOpen] = useState(false)
//     const chatId = usePathname().split('/')[1]
//     return (
//         <div className="flex size-full">
//             <div className="flex h-screen flex-1 flex-col overflow-hidden">
//                 <ChatHeader onClickSidebar={() => setOpen(!open)} />
//                 <Chat chatId={chatId} />
//             </div>
//         </div>
//     )
// }

// import React, { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
//
// const ImageViewer = () => {
//     const [isFullscreen, setIsFullscreen] = useState(false)
//
//     const thumbnailSrc =
//         'https://e3.365dm.com/23/03/1600x900/skynews-beijing-china-dust-storm_6084240.jpg?20230310121707'
//     const fullscreenSrc =
//         'https://e3.365dm.com/23/03/1600x900/skynews-beijing-china-dust-storm_6084240.jpg?20230310121707'
//
//     return (
//         <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//             <h1>Image Gallery</h1>
//             <p>Click on the image to view it in full screen.</p>
//
//             <motion.div
//                 layoutId="expandable-image"
//                 style={{
//                     width: 200,
//                     height: 150,
//                     cursor: 'pointer',
//                 }}
//                 onClick={() => setIsFullscreen(true)}
//             >
//                 <motion.img
//                     src={thumbnailSrc}
//                     alt="Thumbnail"
//                     style={{
//                         width: '100%',
//                         height: '100%',
//                         objectFit: 'cover',
//                     }}
//                 />
//             </motion.div>
//
//             <AnimatePresence>
//                 {isFullscreen && (
//                     <motion.div
//                         layoutId="expandable-image"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         style={{
//                             position: 'fixed',
//                             top: 0,
//                             left: 0,
//                             width: '100vw',
//                             height: '100vh',
//                             background: 'rgba(0, 0, 0, 0.8)',
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             cursor: 'pointer',
//                             zIndex: 1000,
//                         }}
//                         onClick={() => setIsFullscreen(false)}
//                     >
//                         <motion.img
//                             src={fullscreenSrc}
//                             alt="Fullscreen image"
//                             style={{
//                                 maxWidth: '90%',
//                                 maxHeight: '90%',
//                                 objectFit: 'contain',
//                             }}
//                             transition={{ duration: 0.3 }}
//                         />
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     )
// }
//
// export default ImageViewer

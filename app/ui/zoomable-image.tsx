import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import IntrinsicElements = React.JSX.IntrinsicElements

const ZoomableImage = (props: IntrinsicElements['img']) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <motion.img
                layoutId={`expandable-image-${props.src}`}
                onClick={() => setOpen(true)}
                src={props.src}
                alt={props.alt}
                className={'size-full rounded-lg !bg-transparent object-cover'}
            />

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed left-0 top-0 z-50 flex size-full cursor-pointer items-center justify-center"
                        initial={{
                            backdropFilter: 'blur(0px)',
                            WebkitBackdropFilter: 'blur(0px)',
                        }}
                        animate={{
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}
                        exit={{
                            backdropFilter: 'blur(0px)',
                            WebkitBackdropFilter: 'blur(0px)',
                        }}
                        onClick={() => setOpen(false)}
                    >
                        <motion.img
                            layoutId={`expandable-image-${props.src}`}
                            src={props.src}
                            alt={props.alt}
                            className={`h-[90%] w-[90%] rounded-xl !bg-transparent object-contain p-4`}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default ZoomableImage

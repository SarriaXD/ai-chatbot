import { AnimatePresence, motion } from 'framer-motion'
import { Add } from '@public/icons'

export const DragZoneOverlay = ({ isDragActive }: { isDragActive: boolean }) => {
    return (
        <AnimatePresence>
            {isDragActive && (
                <motion.div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-30 will-change-transform`}
                    initial={{
                        backdropFilter: 'blur(0px)',
                    }}
                    animate={{
                        backdropFilter: 'blur(20px)',
                    }}
                    exit={{
                        backdropFilter: 'blur(0px)',
                    }}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="flex flex-col items-center justify-center gap-16 rounded-xl text-3xl text-white"
                    >
                        <Add className="size-36 text-gray-200" />
                        Drop here to upload image
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default DragZoneOverlay
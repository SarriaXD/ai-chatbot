import { Dog } from '@public/icons'

const EmptyMessagePlaceholder = () => {
    return (
        <div className="flex size-full items-center justify-center bg-gray-900 px-4">
            <div className="max-w-60 md:max-w-80">
                <Dog className="aspect-square text-white" />
                <p className="mt-8 text-center text-xl text-gray-300 md:text-2xl">
                    Hi I am Qi, how can I help you today?
                </p>
            </div>
        </div>
    )
}

export default EmptyMessagePlaceholder

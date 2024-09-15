import { Slide, ToastOptions } from 'react-toastify'
import { Warn } from '@public/icons'

export const toastErrorOptions: ToastOptions = {
    type: 'error',
    position: 'top-center',
    transition: Slide,
    className: 'bg-[#E96F40]',
    icon: () => (
        <div className="rounded-full bg-white p-1 text-[#E96F40]">
        <Warn className="size-3" />
            </div>
    ),
    autoClose: 3000,
    hideProgressBar: true,
}
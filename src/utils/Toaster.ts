import toast from "react-hot-toast"


const SuccessToast = (message: string) => {
    return toast.success(message)
    // return ""
}

const ErrorToast = (message: string) => {
    return toast.error(message);
    // return "";
}

export { SuccessToast,ErrorToast }
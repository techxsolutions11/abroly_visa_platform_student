import { ErrorToast } from "./Toaster"


let returnRecords = {
    success: false,
    data: [] as any,
    message:""
}

interface IReturnRecord {
    success: boolean
    data: any
    message?: string
}

function handleAxiosError(error: any) {
    if (error.response && error.response.status === 401) {
        //   console.error('Auth failed:', error.response);
        ErrorToast("Session Failed! Login again")
        // window.location.reload()
        setTimeout(() => {
            window.location.href = '/';
        }, 1000)

    } else {
        ErrorToast(error);
    }
}


export { returnRecords, handleAxiosError }
export type { IReturnRecord }

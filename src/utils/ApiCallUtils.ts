import axios, { AxiosError, AxiosResponse } from "axios"
import { getAuthToken } from "./localstorage"
import { returnRecords } from "./ApiUtils"
import { ErrorToast, SuccessToast } from "./Toaster"

const BaseUrl = import.meta.env.VITE_API_BASE_URL

// common function for all post api calls
const commonPostAPICall = async (params: object, url: string, showError = false) => {
    let returnValue = { ...returnRecords, total: 0 }

    if (getAuthToken() && getAuthToken() !== null && getAuthToken() !== "") {
        await axios.post(`${BaseUrl}/v1/${url}`, params, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        })
            .then((response: AxiosResponse) => {
                if (response?.status == 200 && response?.data?.success == false) {
                    ErrorToast(response?.data?.message)
                }

                if (response?.status === 200 && response?.data?.success == true) {
                    returnValue.success = true
                    returnValue.data = response?.data?.data
                    if (response?.data?.total) {
                        returnValue.total = response?.data?.total
                    }
                } 

                if(showError == true && response?.data?.success == true){
                    SuccessToast(response?.data?.message)
                }
            }).catch((e: AxiosError) => {
                ErrorToast(e.message)
                console.log(e.message);
            })
    }

    return returnValue
}
const commonPostPublicAPICall = async (params: object, url: string, showError = false) => {
    let returnValue = { ...returnRecords, total: 0 }

    await axios.post(`${BaseUrl}/v1/${url}`, params)
        .then((response: AxiosResponse) => {
            if (response?.status == 200 && response?.data?.success == false && showError == true) {
                ErrorToast(response?.data?.message)
            }
            if (response?.status == 200 && response?.data?.success == true && showError == true) {
                SuccessToast(response?.data?.message)
            }

            if (response?.status === 200 && response?.data?.success == true) {
                returnValue.success = true
                returnValue.data = response?.data?.data
                if (response?.data?.total) {
                    returnValue.total = response?.data?.total
                }
            } 
        }).catch((e: AxiosError) => {
            ErrorToast(e.message)
            console.log(e);
        })


    return returnValue
}

// common get api call function
const commonGetAPICalls = async (url: string) => {
    let returnValue = { ...returnRecords }

    if (getAuthToken() && getAuthToken() !== null && getAuthToken() !== "") {
        await axios.get(`${BaseUrl}/v1${url}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        })
            .then((response: AxiosResponse) => {
                console.log(response, "RES");

                if (response?.status === 200 && response?.data?.success == true) {
                    returnValue.success = true
                    returnValue.data = response?.data?.data
                } else {
                    // ErrorToast("ERROR")
                }
            }).catch((e: AxiosError) => {
                ErrorToast(e.message)
                console.log(e);
            })
    }

    return returnValue
}

// common get api call function
const commonPublicGetApiCalls = async (url: string) => {
    let returnValue = { ...returnRecords }

    await axios.get(`${BaseUrl}/v1${url}`, {
    })
        .then((response: AxiosResponse) => {
            console.log(response, "RES");

            if (response?.status === 200 && response?.data?.success == true) {
                returnValue.success = true
                returnValue.data = response?.data?.data
            } else {
                // ErrorToast("ERROR")
            }
        }).catch((e: AxiosError) => {
            ErrorToast(e.message)
            console.log(e);
        })

    return returnValue
}

export {
    commonPostAPICall,
    commonGetAPICalls,
    commonPublicGetApiCalls,
    commonPostPublicAPICall
}
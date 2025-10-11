import axios, { AxiosError, AxiosResponse } from "axios";
import { useSelector } from "react-redux";
import { ErrorToast, SuccessToast } from "../utils/Toaster";
import { returnRecords } from "../utils/ApiUtils";

const useApiCallUtils = () => {
    const BaseUrl = import.meta.env.VITE_API_BASE_URL as string;
    const token = useSelector((state: any) => state.login.token);

    // Common function for all POST API calls (with authentication)
    const commonPostAPICall = async (params: object, url: string, showError = false) => {
        let returnValue = { ...returnRecords, total: 0 };

        if (token) {
            try {
                const response: AxiosResponse = await axios.post(`${BaseUrl}/v1/${url}`, params, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response?.status === 200) {
                    returnValue.success = response?.data?.success;
                    returnValue.data = response?.data?.data;
                    returnValue.total = response?.data?.total || 0;
                    returnValue.message = response?.data?.message;

                    if (showError && response?.data?.success) {
                        SuccessToast(response?.data?.message);
                    } else if (!response?.data?.success) {
                        ErrorToast(response?.data?.message);
                    }
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        // Check for 401 Unauthorized
                        if (error.response.status === 401) {
                            returnValue.message = error.response.data?.message || "Unauthorized access";
                            // Optional: Handle different unauthorized cases
                            if (error.response.data?.message.includes("Airport is Inactive")) {
                                console.warn("Airport is inactive. Redirecting or disabling access...");
                                // Add logic to handle inactive airport case (e.g., redirect user)
                            }
                        } else {
                            returnValue.message = error.response.data?.message || "Request failed";
                        }
                    } else if (error.request) {
                        returnValue.message = "No response from server";
                    } else {
                        returnValue.message = error.message;
                    }

                    // Show error toast for better UX
                    ErrorToast(returnValue.message);
                } else {
                    returnValue.message = "An unexpected error occurred";
                }
            }
        }

        return returnValue;
    };
    const commonPutAPICall = async (params: object, url: string, showError = false) => {
        let returnValue = { ...returnRecords, total: 0 };

        if (token) {
            try {
                const response: AxiosResponse = await axios.put(`${BaseUrl}/v1/${url}`, params, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response?.status === 200) {
                    returnValue.success = response?.data?.success;
                    returnValue.data = response?.data?.data;
                    returnValue.total = response?.data?.total || 0;
                    returnValue.message = response?.data?.message;

                    if (showError && response?.data?.success) {
                        SuccessToast(response?.data?.message);
                    } else if (!response?.data?.success) {
                        ErrorToast(response?.data?.message);
                    }
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        // Check for 401 Unauthorized
                        if (error.response.status === 401) {
                            returnValue.message = error.response.data?.message || "Unauthorized access";
                            // Optional: Handle different unauthorized cases
                            if (error.response.data?.message.includes("Airport is Inactive")) {
                                console.warn("Airport is inactive. Redirecting or disabling access...");
                                // Add logic to handle inactive airport case (e.g., redirect user)
                            }
                        } else {
                            returnValue.message = error.response.data?.message || "Request failed";
                        }
                    } else if (error.request) {
                        returnValue.message = "No response from server";
                    } else {
                        returnValue.message = error.message;
                    }

                    // Show error toast for better UX
                    ErrorToast(returnValue.message);
                } else {
                    returnValue.message = "An unexpected error occurred";
                }
            }
        }

        return returnValue;
    };


    const commonDeleteAPICall = async (params: object, url: string, showError = false) => {
        let returnValue = { ...returnRecords, total: 0 };

        if (token) {
            try {
                const response: AxiosResponse = await axios.delete(`${BaseUrl}/v1/${url}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { ...params },
                });

                if (response?.status === 200) {
                    returnValue.success = response?.data?.success;
                    returnValue.data = response?.data?.data;
                    returnValue.total = response?.data?.total || 0;
                    returnValue.message = response?.data?.message;

                    if (showError && response?.data?.success) {
                        SuccessToast(response?.data?.message);
                    } else if (!response?.data?.success) {
                        ErrorToast(response?.data?.message);
                    }
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        // Check for 401 Unauthorized
                        if (error.response.status === 401) {
                            returnValue.message = error.response.data?.message || "Unauthorized access";
                            // Optional: Handle different unauthorized cases
                            if (error.response.data?.message.includes("Airport is Inactive")) {
                                console.warn("Airport is inactive. Redirecting or disabling access...");
                                // Add logic to handle inactive airport case (e.g., redirect user)
                            }
                        } else {
                            returnValue.message = error.response.data?.message || "Request failed";
                        }
                    } else if (error.request) {
                        returnValue.message = "No response from server";
                    } else {
                        returnValue.message = error.message;
                    }

                    // Show error toast for better UX
                    ErrorToast(returnValue.message);
                } else {
                    returnValue.message = "An unexpected error occurred";
                }
            }
        }

        return returnValue;
    };

    // Common POST API call (public)
    const commonPostPublicAPICall = async (params: object, url: string, showError = false) => {
        let returnValue = { ...returnRecords, total: 0 };

        try {
            const response: AxiosResponse = await axios.post(`${BaseUrl}/v1/${url}`, params);

            if (response?.status === 200) {
                returnValue.success = response?.data?.success;
                returnValue.data = response?.data?.data;
                returnValue.total = response?.data?.total || 0;
                returnValue.message = response?.data?.message;

                if (showError) {
                    response?.data?.success ? SuccessToast(response?.data?.message) : ErrorToast(response?.data?.message);
                }
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Check for 401 Unauthorized
                    if (error.response.status === 401) {
                        returnValue.message = error.response.data?.message || "Unauthorized access";
                        // Optional: Handle different unauthorized cases
                        if (error.response.data?.message.includes("Airport is Inactive")) {
                            console.warn("Airport is inactive. Redirecting or disabling access...");
                            // Add logic to handle inactive airport case (e.g., redirect user)
                        }
                    } else {
                        returnValue.message = error.response.data?.message || "Request failed";
                    }
                } else if (error.request) {
                    returnValue.message = "No response from server";
                } else {
                    returnValue.message = error.message;
                }

                // Show error toast for better UX
                ErrorToast(returnValue.message);
            } else {
                returnValue.message = "An unexpected error occurred";
            }
        }

        return returnValue;
    };

    // Common GET API call (with authentication)
    const commonGetAPICalls = async (url: string) => {
        let returnValue = { ...returnRecords };

        if (token) {
            try {
                const response: AxiosResponse = await axios.get(`${BaseUrl}/v1${url}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response?.status === 200 && response?.data?.success) {
                    returnValue.success = true;
                    returnValue.data = response?.data?.data;
                }
                returnValue.message = response?.data?.message;
            } catch (error: any) {
                // console.log(error.message,"RESPONSE OF ERROR");

                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        // Check for 401 Unauthorized
                        if (error.response.status === 401) {
                            returnValue.message = error.response.data?.message || "Unauthorized access";
                            // Optional: Handle different unauthorized cases
                            if (error.response.data?.message.includes("Airport is Inactive")) {
                                console.warn("Airport is inactive. Redirecting or disabling access...");
                                // Add logic to handle inactive airport case (e.g., redirect user)
                            }
                        } else {
                            returnValue.message = error.response.data?.message || "Request failed";
                        }
                    } else if (error.request) {
                        returnValue.message = "No response from server";
                    } else {
                        returnValue.message = error.message;
                    }

                    // Show error toast for better UX
                    ErrorToast(returnValue.message);
                } else {
                    returnValue.message = "An unexpected error occurred";
                }
            }
        }

        return returnValue;
    };

    // Common GET API call (public)
    const commonPublicGetApiCalls = async (url: string) => {
        let returnValue = { ...returnRecords };

        try {
            const response: AxiosResponse = await axios.get(`${BaseUrl}/v1${url}`);

            if (response?.status === 200 && response?.data?.success) {
                returnValue.success = true;
                returnValue.data = response?.data?.data;
            }
            returnValue.message = response?.data?.message;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Check for 401 Unauthorized
                    if (error.response.status === 401) {
                        returnValue.message = error.response.data?.message || "Unauthorized access";
                        // Optional: Handle different unauthorized cases
                        if (error.response.data?.message.includes("Airport is Inactive")) {
                            console.warn("Airport is inactive. Redirecting or disabling access...");
                            // Add logic to handle inactive airport case (e.g., redirect user)
                        }
                    } else {
                        returnValue.message = error.response.data?.message || "Request failed";
                    }
                } else if (error.request) {
                    returnValue.message = "No response from server";
                } else {
                    returnValue.message = error.message;
                }

                // Show error toast for better UX
                ErrorToast(returnValue.message);
            } else {
                returnValue.message = "An unexpected error occurred";
            }
        }

        return returnValue;
    };

    const commonPostAPICallWithFile = async (params: object, url: string, showError = false) => {
        let returnValue = { ...returnRecords, total: 0 }
    
        if (token) {
            await axios.post(`${BaseUrl}/v1/${url}`, params, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((response: AxiosResponse) => {
                    if (response) {
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
    
                        if (showError == true && response?.data?.success == true) {
                            SuccessToast(response?.data?.message)
                        }
                    } else {
                        throw new Error("Something went wrong")
                    }
                }).catch((e: AxiosError) => {
                    ErrorToast(e?.message)
                    // console.log(e.message);
                    returnValue.message = e?.message
                })
        }
    
        return returnValue
    }

    return {
        commonPostAPICall,
        commonPutAPICall,
        commonDeleteAPICall,
        commonGetAPICalls,
        commonPublicGetApiCalls,
        commonPostPublicAPICall,
        commonPostAPICallWithFile
    };
};

export default useApiCallUtils;
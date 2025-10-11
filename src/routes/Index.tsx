import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addToLocal, getFromLocal } from '../utils/localstorage';
import { setAuthLoading, setProfile, setRole, setToken } from '../redux/slices/loginSlice';
import { Spinner } from '@nextui-org/react';
import StudentDashboard from '../modules/Dashboard/StudentDashboard';
import PublicDashboard from '../modules/Dashboard/PublicDashboard';
import useApiCallUtils from '@/hooks/useApiCallUtils';

const Index = () => {

    const { commonPostAPICall } = useApiCallUtils()

    const tokenData = getFromLocal("token")
    const authLoad = getFromLocal("authLoad")
    const website = getFromLocal("website")

    const token = useSelector((state: any) => state.login.token) || tokenData;
    const role_type = useSelector((state: any) => state.login.role_type)
    const authLoading = useSelector((state: any) => state.login.authLoading) || authLoad
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => {
            findTheRole()
        }, 1500)
    }, [token])

    useEffect(() => {
        // alert(website)
        if (website !== null && website != "student") {
            window.localStorage.clear()
            window.open("/", "_self")
        }
    }, [])

    const findTheRole = async () => {
        const { data, success } = await commonPostAPICall({}, "/user/kyc")

        if (success == true) {

            dispatch(setRole(data.role))
            dispatch(setAuthLoading('true'))
            localStorage.setItem("authLoad", 'false')
            dispatch(setToken(token))
            dispatch(setProfile({
                profileimage: data?.profile,
                user_name: data?.name,
                phone: data?.country_code + " " + data?.phone,
                email: data?.email
            }))
            addToLocal("profile", data.profile)
            addToLocal("phone_with_code", data.country_code + " " + data.phone)
            addToLocal("name", data.name)
            addToLocal("website", "student")

        } else {
            dispatch(setAuthLoading('true'))
            dispatch(setToken(null))
            localStorage.clear()
        }
    }
    return (
        <>
            {
                token && token !== null ?

                    authLoading == 'false'
                        ?
                        <div className='bg-white dark:bg-slate-900'>
                            <div className="flex flex-col justify-center w-screen h-screen items-center align-center space-x-2 bg-white dark:bg-slate-900">

                                <div className='flex flex-col justify-center align-center bg-[#535C9110] border-2 border-slate-300 p-20 rounded-lg gap-3 bg-white dark:bg-slate-900'>
                                    <p>Please Wait</p>
                                    <Spinner />
                                </div>
                            </div>
                        </div>
                        :
                        (
                            role_type == "user" && <StudentDashboard />
                        )
                    :
                    <PublicDashboard />
            }
        </>
    )
}

export default Index
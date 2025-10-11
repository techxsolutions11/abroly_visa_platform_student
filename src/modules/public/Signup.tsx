import { Button, Input, Card, CardBody, CardHeader } from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ErrorToast } from '../../utils/Toaster'
import { setAuthLoading, setProfile, setToken } from '../../redux/slices/loginSlice'
import { addToLocal } from '../../utils/localstorage'
import { GrEdit } from 'react-icons/gr'
import { Link, useNavigate } from 'react-router-dom'
import useApiCallUtils from '@/hooks/useApiCallUtils'
import { Checkbox } from 'rsuite'

const IS_LOCAL = import.meta.env.VITE_IS_LOCAL || false

const Signup = () => {
    const { commonPostPublicAPICall } = useApiCallUtils()
    const [acceptTnc, setAcceptTnc] = useState()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [OTPScreen, setOTPScreeen] = useState(false)
    const [verificationId, setVerificationId] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [numberAndCountryCode, setNumberAndCountryCode] = useState({
        phone_number: "",
        country_code: "+91",
    })
    const initialValues = Array(4).fill('')
    const [otpValues, setValues] = useState<string[]>(initialValues)
    const inputRefs = Array(4).fill(0).map(() => useRef<HTMLInputElement>(null))

    const [loginLoading, setLoginLoading] = useState(false)
    const [verfiyLoading, setVerifyLoading] = useState(false)

    const handleChange = (event: any, index: number) => {
        if (/^\d?$/.test(event.target.value)) {
            const newValues = [...otpValues]
            newValues[index] = event.target.value
            setValues(newValues)
            if (event.target.value && index < 3) {
                const nextInput = inputRefs[index + 1].current
                if (nextInput) nextInput.focus()
            }
        }
    }

    const handleBackspace = (event: any, index: number) => {
        if (event.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs[index - 1].current?.focus()
        }
    }

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault()
        const pasteData = event.clipboardData.getData('text').slice(0, 4).split('')
        pasteData.forEach((value: string, index: number) => {
            if (index < otpValues.length) {
                otpValues[index] = value
                const inputEl = inputRefs[index].current
                if (inputEl) inputEl.value = value
            }
        })
        setValues([...otpValues])
        const firstEmptyIndex = pasteData.length < 4 ? pasteData.length : -1
        if (firstEmptyIndex !== -1) inputRefs[firstEmptyIndex].current?.focus()
    }

    const submitCall = async () => {
        setLoginLoading(true)
        const { success, data } = await commonPostPublicAPICall(
            {
                phone_number: numberAndCountryCode.phone_number,
                country_code: "+91",
                user_name: name,
                email
            },
            `user/student/${IS_LOCAL == 'true' ? 'signup_custom' : 'signup'}`,
            true
        )
        if (success) {
            setOTPScreeen(true)
            setVerificationId(data)
        }
        setLoginLoading(false)
    }

    const verifyOTP = async () => {
        let emptyOTP = otpValues.some((item) => item === "")
        if (emptyOTP) {
            ErrorToast("Please Enter OTP")
            return
        }
        setVerifyLoading(true)
        const { success, data } = await commonPostPublicAPICall(
            {
                country_code: numberAndCountryCode.country_code,
                otp: otpValues.join(""),
                phone_number: numberAndCountryCode.phone_number,
                verificationId
            },
            `user/student/${IS_LOCAL == 'true' ? 'validate_otp_custom' : 'validate_otp'}`,
            true
        )
        if (success) {
            dispatch(setToken(data.token))
            dispatch(setProfile({ phone: data.country_code + " " + data.phone, user_name: data.name }))
            addToLocal("token", data.token)
            addToLocal("phone_with_code", data.country_code + " " + data.phone)
            addToLocal("name", data.name)
            dispatch(setAuthLoading('false'))
            navigate("/")
        }
        setVerifyLoading(false)
    }

    return (
        <section className="min-h-[85vh] flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md shadow-lg p-6 bg-white rounded-xl">
                <CardHeader className="flex flex-col items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">Create your student account</h1>
                    <p className="text-sm text-gray-500 mt-1">just few steps away</p>
                </CardHeader>
                <CardBody>
                    {!OTPScreen ? (
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                {/* <label className="text-sm font-medium text-gray-700">Your Name</label> */}
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full"
                                    variant="bordered"
                                    label="Your Name"
                                />
                            </div>
                            <div className="space-y-2">
                                {/* <label className="text-sm font-medium text-gray-700">Your Email</label> */}
                                <Input
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full"
                                    variant="bordered"
                                    label="Your Email"
                                />
                            </div>
                            <div className="flex flex-col items-start  gap-2">
                                {/* <label className="text-sm font-medium text-gray-700">Phone Number</label> */}
                                <Input
                                    startContent={<span className="text-sm text-gray-500">+91</span>}
                                    value={numberAndCountryCode.phone_number}
                                    onChange={(e) =>
                                        setNumberAndCountryCode({
                                            ...numberAndCountryCode,
                                            phone_number: e.target.value
                                        })
                                    }
                                    className="w-full"
                                    variant="bordered"
                                    type='number'
                                    label="Your Phone number"
                                    placeholder="Enter your phone number"
                                />
                                <div className='flex flex-row items-center justify-start gap-1'>
                                    <Checkbox
                                        checked={acceptTnc}
                                        value={acceptTnc}
                                        onCheckboxClick={(e: any) => {
                                            // console.log(e.target.checked);
                                            setAcceptTnc(e.target.checked)
                                        }}
                                    >
                                        I agree to the
                                    </Checkbox>
                                    <Link to="/static/student_tnc_signup" className="text-blue-500">Terms and conditions</Link>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                variant="solid"
                                color="primary"
                                onPress={submitCall}
                                isLoading={loginLoading}
                                isDisabled={acceptTnc == false || loginLoading || numberAndCountryCode.phone_number.length < 10 || !name || !email || !acceptTnc}
                                className="w-full text-white font-medium"
                            >
                                Send OTP
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center flex items-center justify-center">
                                <p className="text-sm text-gray-600">
                                    Enter the OTP sent to{" "}
                                    <span className="font-medium">
                                        {numberAndCountryCode.country_code} {numberAndCountryCode.phone_number}
                                    </span>
                                </p>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    onClick={() => setOTPScreeen(false)}
                                    className=""
                                >
                                    <GrEdit className="text-gray-500" />
                                </Button>
                            </div>
                            <div className="flex justify-center gap-2">
                                {otpValues.map((value: string, index: number) => (
                                    <input
                                        key={index}
                                        autoFocus={index === 0}
                                        ref={inputRefs[index]}
                                        type="number"
                                        maxLength={1}
                                        value={value}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && index === 3) verifyOTP()
                                            else handleBackspace(e, index)
                                        }}
                                        onPaste={handlePaste}
                                        className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between gap-2">
                                <Button
                                    variant="solid"
                                    color="primary"
                                    onClick={verifyOTP}
                                    isLoading={verfiyLoading}
                                    disabled={verfiyLoading}
                                    className="w-full font-medium"
                                >
                                    Verify OTP
                                </Button>
                                {/* Uncomment and style Resend OTP button if needed */}
                                {/* <Button
                                    variant="light"
                                    onClick={resendOTPCall}
                                    className="w-full text-gray-600 hover:text-blue-600"
                                >
                                    Resend OTP
                                </Button> */}
                            </div>
                        </div>
                    )}
                    <hr className="my-6 border-gray-200" />
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Login
                        </Link>
                    </p>
                </CardBody>
            </Card>
        </section>
    )
}

export default Signup
// import { Button, Input } from '@nextui-org/react'
// import React, { useEffect, useRef, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { ErrorToast } from '../../utils/Toaster'
// import { setAuthLoading, setProfile, setToken } from '../../redux/slices/loginSlice'
// import { addToLocal } from '../../utils/localstorage'
// import { GrEdit } from 'react-icons/gr'
// import { Link, useNavigate } from 'react-router-dom'
// import { Carousel } from 'rsuite'
// import useApiCallUtils from '@/hooks/useApiCallUtils'

// const IS_LOCAL = import.meta.env.VITE_IS_LOCAL || false

// const Signup = () => {

//     const { commonPostPublicAPICall } = useApiCallUtils()

//     useEffect(() => {
//         window.scrollTo(0, 0)
//     }, [])

//     const dispatch = useDispatch()

//     // for OTP

//     const [OTPScreen, setOTPScreeen] = useState(false)
//     const [verificationId, setVerificationId] = useState("")
//     const [name, setName] = useState("")
//     const [email, setEmail] = useState("")
//     const [numberAndCountryCode, setNumberAndCountryCode] = useState({
//         phone_number: "",
//         country_code: "+91",
//     })
//     const initialValues = Array(4).fill('');
//     const [otpValues, setValues] = useState<string[]>(initialValues);
//     const inputRefs = Array(4).fill(0).map(() => useRef<HTMLInputElement>(null));


//     const [loginLoading, setLoginLoading] = useState(false)
//     const [verfiyLoading, setVerifyLoading] = useState(false)

//     // handle change of otp
//     const handleChange = (event: any, index: number) => {
//         // Allow only single digit input
//         if (/^\d?$/.test(event.target.value)) {
//             const newValues = [...otpValues];
//             newValues[index] = event.target.value;
//             setValues(newValues);
//             if (event.target.value && index < 5) {
//                 const nextInput = inputRefs[index + 1].current;
//                 if (nextInput) {
//                     nextInput.focus();
//                 }
//             }
//         }

//     };

//     // for handle backspace 
//     const handleBackspace = (event: any, index: number) => {
//         if (event.key === 'Backspace' && !otpValues[index] && index > 0) {
//             inputRefs[index - 1].current?.focus();
//         }
//     };
//     // use for handle paste
//     const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
//         event.preventDefault();
//         const pasteData = event.clipboardData.getData('text').slice(0, 4).split('');
//         pasteData.forEach((value: string, index: number) => {
//             if (index < otpValues.length) {
//                 otpValues[index] = value;
//                 const inputEl = inputRefs[index].current; // Get a reference to the current input element
//                 if (inputEl !== null) { // Check if the input element is not null
//                     inputEl.value = value; // Directly set the value of the input element
//                 }
//             }
//         });

//         setValues([...otpValues]);
//         const firstEmptyIndex = pasteData.length < 4 ? pasteData.length : -1;
//         if (firstEmptyIndex !== -1) {
//             inputRefs[firstEmptyIndex].current?.focus();
//         }
//     };

//     const submitCall =
//         async () => {
//             setLoginLoading(true)
//             const { success, data } = await commonPostPublicAPICall(
//                 {
//                     phone_number: numberAndCountryCode.phone_number,
//                     country_code: "+91",
//                     user_name: name,
//                     email

//                 },
//                 `user/student/${IS_LOCAL == 'true' ? 'signup_custom' : 'signup'}`, true)
//             // console.log(data);

//             if (success == true) {

//                 setOTPScreeen(true)

//                 setVerificationId(data)

//             }

//             setLoginLoading(false)
//         }
//     // const resendOTPCall =
//     //     async () => {
//     //         const { success, data } = await commonPostPublicAPICall({ country_code: numberAndCountryCode.country_code, phone: numberAndCountryCode.phone_number }, `user/student/${IS_LOCAL == 'true' ? 'signup_custom' : 'signup'}`, true);
//     //         // console.log(data);

//     //         if (success == true) {

//     //             setOTPScreeen(true)
//     //             setNumberAndCountryCode({
//     //                 country_code: numberAndCountryCode.country_code,
//     //                 phone_number: numberAndCountryCode.phone_number
//     //             })

//     //             setVerificationId(data)

//     //         }
//     //     }
//     const navigate = useNavigate()
//     return (
//         <section className="grid h-[85vh] grid-cols-1 md:grid-cols-2 justify-center items-center">
//             <div className="hidden lg:block p-4">
//                 {/* <img src="https://images.pexels.com/photos/2859169/pexels-photo-2859169.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" className="w-full h-full object-cover rounded-3xl" /> */}
//                 <Carousel
//                     placement={"right"}
//                     shape={"bar"}
//                     autoplay={true}
//                     className="custom-slider rounded-lg h-fill"
//                 >
//                     <img src="https://images.pexels.com/photos/20139116/pexels-photo-20139116/free-photo-of-jonkoping-university.jpeg" className='object-cover rounded-md' />
//                     <img src="https://images.pexels.com/photos/5714059/pexels-photo-5714059.jpeg" className='object-cover rounded-md' />
//                     <img src="https://images.pexels.com/photos/2570062/pexels-photo-2570062.jpeg" className='object-cover rounded-md' />
//                 </Carousel>

//             </div>
//             <div className="w-full px-6 flex items-center justify-center">

//                 <div className="w-full">
//                     <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Create your account</h1>

//                     {
//                         OTPScreen == false ?
//                             <form className="mt-6 space-y-4" onSubmit={(e) => {
//                                 e.preventDefault()
//                                 // submitCall()
//                             }}>
//                                 <Input
//                                     label="Your Name"
//                                     value={name}
//                                     onChange={(e) => {
//                                         setName(e.target.value)
//                                     }}
//                                     className='max-w-xl'
//                                 />
//                                 <Input
//                                     label="Your Email"
//                                     value={email}
//                                     onChange={(e) => {
//                                         setEmail(e.target.value)
//                                     }}
//                                     className='max-w-xl'
//                                 />
//                                 <Input
//                                     label="Phone Number"
//                                     startContent={<p className='text-sm'>+91</p>}
//                                     value={numberAndCountryCode.phone_number}
//                                     onChange={(e) => {
//                                         setNumberAndCountryCode({
//                                             ...numberAndCountryCode,
//                                             phone_number: e.target.value
//                                         })
//                                     }}
//                                     className='max-w-xl'
//                                 />
//                                 <Button
//                                     type='submit'
//                                     variant='flat'
//                                     color='warning'
//                                     isLoading={loginLoading}
//                                     isDisabled={loginLoading}
//                                     onPress={submitCall}
//                                 >Send OTP</Button>
//                             </form>
//                             :
//                             <div className="flex items-start justify-start sm:px-1 lg:px-1 ">
//                                 <div className="xl:mx-auto xl:w-full py-10 rounded-2xl">
//                                     <p className="text-base ">
//                                         Enter the OTP that was sent to your phone number{" "}
//                                     </p>
//                                     <section className="text-sm flex flex-row itms-center justify-start gap-2">
//                                         <p className='flex items-center'> {"+91"}{" "}{numberAndCountryCode.phone_number}</p>
//                                         <Button isIconOnly variant='light' onClick={() => { setOTPScreeen(false) }}>
//                                             <GrEdit className="text-sm " />
//                                         </Button>
//                                     </section>
//                                     <div className="flex flex-row items-center gap-x-2 gap-y-2">
//                                         {otpValues.map((value: string, index: number) => (
//                                             <input
//                                                 key={index}
//                                                 autoFocus={index == 0}
//                                                 ref={inputRefs[index]}
//                                                 type="number"
//                                                 maxLength={1}
//                                                 max={9}
//                                                 value={value}
//                                                 onChange={(e) => handleChange(e, index)}
//                                                 onKeyDown={async (e) => {
//                                                     if (e.key === 'Enter' && index == 3) {
//                                                         let emptyOTP = false
//                                                         otpValues.forEach((item: any) => {
//                                                             if (item == "") {
//                                                                 emptyOTP = true
//                                                             }
//                                                         })
//                                                         if (emptyOTP) {
//                                                             ErrorToast("Please Enter OTP")
//                                                         } else {
//                                                             setVerifyLoading(true)
//                                                             const { success, data } = await commonPostPublicAPICall({ country_code: numberAndCountryCode.country_code, otp: otpValues.join(""), phone_number: "" + numberAndCountryCode.phone_number, verificationId }, `user/student/${IS_LOCAL == 'true' ? 'validate_otp_custom' : 'validate_otp'}`, true);
//                                                             if (success == true) {
//                                                                 dispatch(setToken(data.token))
//                                                                 dispatch(setProfile({
//                                                                     phone: data.country_code + " " + data.phone,
//                                                                     user_name: data.name
//                                                                 }))
//                                                                 addToLocal("token", data.token)
//                                                                 addToLocal("phone_with_code", data.country_code + " " + data.phone)
//                                                                 addToLocal("name", data.name)
//                                                                 dispatch(setAuthLoading('false'))
//                                                                 navigate("/")
//                                                                 setVerifyLoading(false)
//                                                             }
//                                                         }

//                                                     } else {
//                                                         handleBackspace(e, index)
//                                                     }
//                                                 }

//                                                 }
//                                                 onPaste={handlePaste}
//                                                 className="h-10 w-10 text-center text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 inline-block"
//                                             />
//                                         ))}
//                                     </div>
//                                     <div className='flex flex-row gap-2 my-2'>
//                                         <Button
//                                             disabled={verfiyLoading}
//                                             isLoading={verfiyLoading}
//                                             // disabled={isSubmitting}
//                                             //   className="inline-flex w-fit items-center justify-center rounded-lg bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
//                                             onClick={async () => {
//                                                 // console.log(otpValues)
//                                                 let emptyOTP = false
//                                                 otpValues.forEach((item: any) => {
//                                                     if (item == "") {
//                                                         emptyOTP = true
//                                                     }
//                                                 })
//                                                 if (emptyOTP) {
//                                                     ErrorToast("Please Enter OTP")
//                                                 } else {
//                                                     setVerifyLoading(true)
//                                                     const { success, data } = await commonPostPublicAPICall({ country_code: numberAndCountryCode.country_code, otp: otpValues.join(""), phone_number: "" + numberAndCountryCode.phone_number, verificationId }, `user/student/${IS_LOCAL == 'true' ? 'validate_otp_custom' : 'validate_otp'}`, true);
//                                                     if (success == true) {
//                                                         dispatch(setToken(data.token))
//                                                         dispatch(setProfile({
//                                                             phone: data.country_code + " " + data.phone,
//                                                             user_name: data.name
//                                                         }))
//                                                         addToLocal("token", data.token)
//                                                         addToLocal("phone_with_code", data.country_code + " " + data.phone)
//                                                         addToLocal("name", data.name)
//                                                         dispatch(setAuthLoading('false'))
//                                                         setVerifyLoading(false)
//                                                         navigate("/")
//                                                     }
//                                                 }
//                                             }}
//                                         >
//                                             Verify
//                                         </Button>
//                                         {/* <Button
//                                             onClick={resendOTPCall}
//                                         >
//                                             Resend
//                                         </Button> */}
//                                     </div>
//                                 </div>
//                             </div>
//                     }
//                     <hr className="my-6 border-gray-300 w-full" />


//                     <p className="mt-8">Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700 font-semibold">Login</Link></p>


//                 </div>
//             </div>
//         </section>
//     )
// }

// export default Signup
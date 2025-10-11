import useApiCallUtils from '@/hooks/useApiCallUtils';
import { getAuthToken } from '@/utils/localstorage';
import { ErrorToast } from '@/utils/Toaster';
import { Button, Spinner } from '@nextui-org/react';
import { AlertCircle, ArrowLeft, Award, CheckCircle, Shield, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const Certificate = () => {
    const { commonPostAPICall, commonPostPublicAPICall } = useApiCallUtils()

    const { id } = useParams();

    const [certificateDetails, setCertificateDetails] = useState<any>({})
    const [isLoading, setIsLoading] = useState(true)
    const [certificateNotFound, setCertificateNotFound] = useState(false)

    const navigate = useNavigate()

    // based on id find student details, course details
    useEffect(() => {
        getCertificateDetails();
    }, []);

    const getCertificateDetails = async () => {
        setIsLoading(true)
        const { data, success } = getAuthToken() ? await commonPostAPICall(
            { uuid: id },
            "/language_prep/student/certificate_details", false
        ):await commonPostPublicAPICall(
            { uuid: id },
            "/language_prep/student/certificate_details", false
        )
        if (success && success === true) {
            setCertificateDetails(data)
            setIsLoading(false)
            setCertificateNotFound(false)
        } else {
            setCertificateNotFound(true)
        }
    };

    return (
        <div className="aspect-video mx-auto p-8">
            {isLoading == true ? <div className='flex items-center justify-center my-5'><Spinner /></div> :
                <>
                    {/* Main Certificate Container */}
                    <div className="relative bg-white shadow-lg rounded-lg overflow-hidden" id="certificate">
                        {/* Border Decoration */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-10 pointer-events-none" />

                        {/* Header */}
                        <div className="flex justify-between items-center px-8 py-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                            <div className="flex items-center space-x-4">
                                <span className="text-2xl font-bold">Abroly</span>
                            </div>
                            <div className='text-[10px]'>
                                <p className="text-sm font-light">Certificate ID: {certificateDetails?.certificate_id}</p>
                                Verify on <a href={`${import.meta.env.VITE_CERTIFICATE_URL}/${id}`} target='_blank'>{import.meta.env.VITE_CERTIFICATE_URL}/{id}</a>
                            </div>
                        </div>

                        {/* Certificate Content */}
                        <div className="p-12">
                            {/* Certificate Title */}
                            <div className="text-center space-y-2">
                                <h1 className="text-4xl font-semibold text-gray-800">Certificate</h1>
                                <p className="text-sm text-gray-600">Achievement for Course Completion Provided by Abroly</p>
                            </div>

                            {/* Recipient Information */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-600">This certifies that</p>
                                <h2 className="text-3xl font-bold text-indigo-600">{certificateDetails?.student?.username}</h2>
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    has successfully completed the <strong>{certificateDetails?.course?.title}</strong> course.
                                </p>
                            </div>

                            {/* Course Details */}
                            <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                                <div className="space-y-2">
                                    <Award className="w-8 h-8 text-indigo-600 mx-auto" />
                                    <p className="text-gray-600">Course Level</p>
                                    <p className="text-lg font-semibold text-gray-800">{certificateDetails?.level}</p>
                                </div>
                                <div className="space-y-2">
                                    <Star className="w-8 h-8 text-indigo-600 mx-auto" />
                                    <p className="text-gray-600">Start Date</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {new Date(certificateDetails?.duration?.start).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                                    <p className="text-gray-600">Completion Date</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {new Date(certificateDetails?.duration?.complete).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-between items-center text-gray-600 text-sm">
                                {/* <div className='ml-auto'>
                    <p>Issued on: {new Date(certificateDetails?.duration?.complete).toLocaleDateString()}</p>
                </div> */}
                                {/* <div className="bg-gray-50 px-4 py-2 rounded-md shadow-sm text-[10px]">
                    <CheckCircle className="w-5 h-5 text-green-600 inline-block" />
                    <span className="ml-2">
                        Verify this certificate at{' '}
                        <a href="https://verify.abroly.com" className="text-indigo-600 underline">
                            verify.abroly.com
                        </a>
                    </span>
                </div> */}
                            </div>
                        </div>
                    </div>
                </>
            }

            {certificateNotFound == true &&

                <div className="flex items-center justify-center">
                    <div className="p-8 max-w-lg text-center">
                        <div className="flex justify-center items-center text-red-500 mb-4">
                            <AlertCircle className="h-16 w-16" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Certificate Not Found
                        </h1>
                        <p className="text-gray-600 mb-6">
                            The certificate you're looking for either doesn't exist or the URL is invalid.
                            Please double-check the link or contact support for assistance.
                        </p>
                        <Button
                            variant='flat'
                            color='warning'
                            onClick={() => {
                                navigate("/")
                            }}
                        >
                            <ArrowLeft size={15} /> Back to Home
                        </Button>
                    </div>
                </div>
            }


        </div >
    )
}

export default Certificate
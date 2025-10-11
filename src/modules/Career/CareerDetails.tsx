import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DollarSign, Clock, GraduationCap, Briefcase, CheckCircle, XCircle, Info, Calendar, FileText, Banknote, AlertTriangle } from 'lucide-react';

import { Button, Card, CardBody, Spinner } from '@nextui-org/react';
import BackButton from '@/components/BackButton';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import { countries } from 'country-data';


const CareerDetails = () => {
    const {commonPostAPICall} = useApiCallUtils()

    const { uuid } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [applied, setApplied] = useState(null);
    const [details, setDetails] = useState<any>(null)

    const [isNotFound, setIsNotFound] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
        findCareer()
    }, [])

    const findCareer = async () => {
        setIsLoading(true)
        const { data, success } = await commonPostAPICall({ uuid }, "/job_post/details")
        if (success && success == true) {
            if (data == null) {
                setIsNotFound(true)
            }
            setDetails(data)
            findIsApplied()

        }
    }

    // find is applied 
    const findIsApplied = async () => {
        setIsLoading(true)
        const { data, success } = await commonPostAPICall({ uuid }, "/job_post/is_applied")
        if (success && success == true) {
            setApplied(data)
        }
        setIsLoading(false)
    }

    const applyForJobPost = async () => {
        const { success } = await commonPostAPICall({ uuid }, "job_post/apply")
        if (success) {
            findCareer()
        }
    }

    // apply
    return (
        <div>
            <div className="min-h-screen  p-8">
                <BackButton
                    title={"Job Details"}
                />

                {isLoading ? (
                    <Spinner />
                ) :
                    isNotFound == true ? <section className='text-center my-10'>
                        <p>Job Post Not Found</p>
                    </section> :

                        <section className="flex flex-col lg:flex-row gap-6">

                            {/* Job Details Section */}
                            <div className="flex-grow  rounded-xl overflow-hidden space-y-2">

                                <div className="p-8">
                                    {/* Main Job Header */}
                                    <h1 className="text-4xl font-semibold text-gray-900 mb-2">
                                        {details?.jobRole}
                                    </h1>
                                    <p className="text-base text-gray-500 mb-6">
                                        A comprehensive job opportunity as a {details?.jobRole} in {countries[details?.country]?.name || details?.country}. Explore the details below to find out if this position aligns with your skills and experience.
                                    </p>

                                    {/* Job Overview */}
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Overview</h2>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Here’s a snapshot of the role. Get insights into the salary range, required experience, work hours, and more.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center">
                                            <Banknote className="text-green-600 h-5 w-5 mr-2" />
                                            <span className="text-gray-700">Salary: {details?.salaryMin} - {details?.salaryMax} /Month</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="text-blue-600 h-5 w-5 mr-2" />
                                            <span className="text-gray-700">Work Hours: {details?.workHours} hrs /Month</span>
                                        </div>
                                        <div className="flex items-center">
                                            <GraduationCap className="text-purple-600 h-5 w-5 mr-2" />
                                            <span className="text-gray-700">Experience Required: {details?.experienceRequired} years</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Briefcase className="text-yellow-600 h-5 w-5 mr-2" />
                                            <span className="text-gray-700">Education Level: {details?.educationLevel}</span>
                                        </div>
                                    </div>

                                    {/* Additional Job Info */}
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Benefits</h2>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Discover the additional perks offered by this job, including overtime, accommodation, transportation, and more.
                                    </p>
                                    <div className="space-y-2 mb-6">
                                        <p className="text-sm text-gray-600">Work Permit: <span className="font-semibold">{details?.workPermit}</span></p>
                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center">
                                                {details?.overtime ? (
                                                    <CheckCircle className="text-green-500 h-5 w-5 mr-1" />
                                                ) : (
                                                    <XCircle className="text-red-500 h-5 w-5 mr-1" />
                                                )}
                                                <span className="text-gray-700">{details?.overtime ? "Overtime Available" : "No Overtime"}</span>
                                            </div>
                                            <div className="flex items-center">
                                                {details?.accommodation ? (
                                                    <CheckCircle className="text-green-500 h-5 w-5 mr-1" />
                                                ) : (
                                                    <XCircle className="text-red-500 h-5 w-5 mr-1" />
                                                )}
                                                <span className="text-gray-700">{details?.accommodation ? "Accommodation Provided" : "No Accommodation"}</span>
                                            </div>
                                            <div className="flex items-center">
                                                {details?.transportation ? (
                                                    <CheckCircle className="text-green-500 h-5 w-5 mr-1" />
                                                ) : (
                                                    <XCircle className="text-red-500 h-5 w-5 mr-1" />
                                                )}
                                                <span className="text-gray-700">{details?.transportation ? "Transportation Provided" : "No Transportation"}</span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600">Food: <span className="font-semibold">{details?.food}</span></p>
                                        <p className="text-sm text-gray-600">Medical Insurance: <span className="font-semibold">{details?.medicalInsurance ? "Yes" : "No"}</span></p>
                                        <p className="text-sm text-gray-600">Agent Charges: <span className="font-semibold">{details?.agentCharges}</span></p>
                                        <p className="text-sm text-gray-600">Skills Required: <span className="font-semibold">{details?.skillsRequired}</span></p>
                                    </div>

                                    {/* Deadlines and Important Dates */}
                                    <div className="border-t border-gray-200 pt-6 mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Dates</h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Keep track of the application deadline and when the job was posted. Make sure to apply before the deadline!
                                        </p>
                                        <p className="text-sm text-gray-600">Application Deadline: <span className="font-semibold">{new Date(details?.applicationDeadline).toLocaleDateString()}</span></p>
                                        <p className="text-sm text-gray-600">Posted On: <span className="font-semibold">{new Date(details?.createdAt).toLocaleDateString()}</span></p>
                                    </div>

                                    {/* Job Description */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description</h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Read the detailed description of the responsibilities, expectations, and requirements for this role.
                                        </p>
                                        <div className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: details?.description }} />
                                    </div>
                                </div>
                            </div>

                            {/* Application Section */}
                            <div className="w-full lg:w-1/2">
                                <Card className="shadow-lg">
                                    <CardBody className="p-8">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Apply for this Job</h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Ready to take the next step? Apply now and get in touch with the employer.
                                        </p>
                                        {details?.deletedAt !== null ?
                                            <Card className='my-2'>
                                                <CardBody >
                                                    <section className="space-y-2">
                                                        <div className="space-y-2">
                                                            <p className="text-red-600 font-medium text-tiny flex items-center space-x-2">
                                                                <AlertTriangle className="w-5 h-5" />
                                                                <span>This job post is deletd by agent</span>
                                                            </p>
                                                        </div>
                                                    </section>
                                                </CardBody>
                                            </Card>
                                            : applied == null ? (
                                                <Button
                                                    onPress={applyForJobPost}
                                                    className="w-full bg-blue-500 text-white py-3 hover:bg-blue-600 transition-colors">
                                                    Apply Now
                                                </Button>
                                            ) : (
                                                <div className="text-gray-700 text-md">
                                                    <span className="font-bold">Application Status : </span> {applied?.status}
                                                </div>
                                            )}
                                    </CardBody>
                                </Card>
                            </div>
                        </section>

                }
            </div>
        </div>
    )
}

export default CareerDetails
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DollarSign, Clock, GraduationCap, Briefcase, CheckCircle, XCircle, Info, Calendar, FileText, Banknote, AlertTriangle, MapPin, UserCheck, Shield } from 'lucide-react';

import { Button, Spinner } from '@nextui-org/react';
import BackButton from '@/components/BackButton';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import { countries } from 'country-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


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
        <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <BackButton title={"Job Details"} />

                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center gap-4">
                            <Spinner size="lg" />
                            <p className="text-gray-600 dark:text-gray-400">Loading job details...</p>
                        </div>
                    </div>
                ) : isNotFound == true ? (
                    <Card className="border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-12 text-center">
                            <Briefcase size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Job Post Not Found</CardTitle>
                            <CardDescription>The job post you're looking for doesn't exist or has been removed.</CardDescription>
                        </CardContent>
                    </Card>
                ) : (
                    <section className="flex flex-col lg:flex-row gap-6 mt-6">
                            {/* Job Details Section */}
                        <div className="flex-grow space-y-6">
                            {/* Main Job Header Card */}
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                                <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
                                            <Briefcase size={24} className="text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                        {details?.jobRole}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 mt-2">
                                                <MapPin size={16} className="text-gray-500 dark:text-gray-400" />
                                                <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                                                    {countries[details?.country]?.name || details?.country}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        A comprehensive job opportunity as a {details?.jobRole} in {countries[details?.country]?.name || details?.country}. Explore the details below to find out if this position aligns with your skills and experience.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Job Overview Card */}
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                                <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <Info size={24} className="text-primary" />
                                        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">Job Overview</CardTitle>
                                    </div>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        Here's a snapshot of the role. Get insights into the salary range, required experience, work hours, and more.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <Banknote size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Salary Range</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {details?.salaryMin} - {details?.salaryMax} / Month
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <Clock size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Work Hours</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {details?.workHours} hrs / Month
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <UserCheck size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Experience Required</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {details?.experienceRequired} years
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <GraduationCap size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Education Level</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {details?.educationLevel}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional Benefits Card */}
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                                <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <Shield size={24} className="text-primary" />
                                        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">Additional Benefits</CardTitle>
                                    </div>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        Discover the additional perks offered by this job, including overtime, accommodation, transportation, and more.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Work Permit</p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{details?.workPermit}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant={details?.overtime ? "default" : "secondary"} className={details?.overtime ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}>
                                                {details?.overtime ? (
                                                <><CheckCircle size={14} className="mr-1" /> Overtime Available</>
                                                ) : (
                                                <><XCircle size={14} className="mr-1" /> No Overtime</>
                                                )}
                                        </Badge>
                                        <Badge variant={details?.accommodation ? "default" : "secondary"} className={details?.accommodation ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}>
                                                {details?.accommodation ? (
                                                <><CheckCircle size={14} className="mr-1" /> Accommodation</>
                                            ) : (
                                                <><XCircle size={14} className="mr-1" /> No Accommodation</>
                                            )}
                                        </Badge>
                                        <Badge variant={details?.transportation ? "default" : "secondary"} className={details?.transportation ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}>
                                            {details?.transportation ? (
                                                <><CheckCircle size={14} className="mr-1" /> Transportation</>
                                            ) : (
                                                <><XCircle size={14} className="mr-1" /> No Transportation</>
                                            )}
                                        </Badge>
                                        <Badge variant={details?.medicalInsurance ? "default" : "secondary"} className={details?.medicalInsurance ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}>
                                            {details?.medicalInsurance ? (
                                                <><CheckCircle size={14} className="mr-1" /> Medical Insurance</>
                                            ) : (
                                                <><XCircle size={14} className="mr-1" /> No Insurance</>
                                            )}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Food</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{details?.food}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Agent Charges</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{details?.agentCharges}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Skills Required</p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{details?.skillsRequired}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Important Dates Card */}
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                                <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={24} className="text-primary" />
                                        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">Important Dates</CardTitle>
                                    </div>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        Keep track of the application deadline and when the job was posted. Make sure to apply before the deadline!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <Calendar size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Application Deadline</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {new Date(details?.applicationDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <Calendar size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Posted On</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {new Date(details?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </p>
                                    </div>
                                </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Job Description Card */}
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                                <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <FileText size={24} className="text-primary" />
                                        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">Job Description</CardTitle>
                                    </div>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        Read the detailed description of the responsibilities, expectations, and requirements for this role.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="text-gray-700 dark:text-gray-300 text-sm prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: details?.description }} />
                                </CardContent>
                            </Card>
                            </div>

                            {/* Application Section */}
                        <div className="w-full lg:w-96 lg:flex-shrink-0">
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg sticky top-6">
                                <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <Briefcase size={24} className="text-primary" />
                                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Apply for this Job</CardTitle>
                                    </div>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                            Ready to take the next step? Apply now and get in touch with the employer.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {details?.deletedAt !== null ? (
                                        <Card className="border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/20">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                                    <AlertTriangle size={20} />
                                                    <p className="font-medium text-sm">This job post is deleted by agent</p>
                                                        </div>
                                            </CardContent>
                                            </Card>
                                    ) : applied == null ? (
                                                <Button
                                                    onPress={applyForJobPost}
                                            color="primary"
                                            size="lg"
                                            className="w-full font-semibold"
                                        >
                                                    Apply Now
                                                </Button>
                                            ) : (
                                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Application Status</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{applied?.status}</p>
                                                </div>
                                            )}
                                </CardContent>
                                </Card>
                            </div>
                        </section>
                )}
            </div>
        </div>
    )
}

export default CareerDetails
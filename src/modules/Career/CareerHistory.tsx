import useApiCallUtils from '@/hooks/useApiCallUtils'
import { Button, Pagination, Spinner } from '@nextui-org/react'
import { countries } from 'country-data'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, MapPin, Banknote, UserCheck, Calendar, Eye, AlertCircle, FileText, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PRIMARY_COLOR, PRIMARY_COLOR_50, PRIMARY_COLOR_100, PRIMARY_COLOR_200, PRIMARY_COLOR_800, PRIMARY_COLOR_900 } from '@/lib/theme'

const CareerHistory = () => {
    const {commonGetAPICalls, commonPostAPICall } = useApiCallUtils()
    const [jobPosts, setJobPosts] = useState([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [total, setTotal] = useState(0)

    const limit = 15;
    const [offset, setOffset] = useState(0)

    const [pageValue, setPageValue] = useState(1)

    useEffect(() => {
        findJobPost()
    }, [offset])

    const findJobPost = async () => {
        setIsLoading(true)
        const { data, success, total } = await commonPostAPICall({ offset, limit }, "/job_post/history")
        if (success && success == true) {
            setJobPosts(data)
            setTotal(total)
        }
        setIsLoading(false)
    }
    const navigate = useNavigate()

    const getStatusColor = (status: string) => {
        const statusLower = status?.toLowerCase()
        if (statusLower === 'accepted' || statusLower === 'approved') {
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        } else if (statusLower === 'rejected' || statusLower === 'declined') {
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        } else if (statusLower === 'pending' || statusLower === 'under review') {
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
        }
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }

    return (
        <div className='w-full'>
            {/* Hero Banner Section */}
            <div className="relative w-full overflow-hidden mb-8 md:mb-12">
                {/* Background Image with Gradient Overlay */}
                <div 
                    className="relative w-full h-[100px] sm:h-[110px] md:h-[130px] lg:h-[150px] xl:h-[170px] bg-cover bg-center bg-no-repeat transition-all duration-500"
                    style={{
                        backgroundImage: `linear-gradient(135deg, ${PRIMARY_COLOR}dd 0%, ${PRIMARY_COLOR_800}dd 50%, ${PRIMARY_COLOR_900}dd 100%), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
                        backgroundBlendMode: 'overlay',
                        backgroundColor: PRIMARY_COLOR
                    }}
                >
                    {/* Animated Gradient Overlay */}
                    <div 
                        className="absolute inset-0 opacity-90 transition-opacity duration-300"
                        style={{
                            background: `linear-gradient(135deg, ${PRIMARY_COLOR}cc 0%, ${PRIMARY_COLOR_800}cc 50%, ${PRIMARY_COLOR_900}cc 100%)`
                        }}
                    />
                    
                    {/* Content Overlay */}
                    <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
                        <div className="max-w-4xl w-full text-center">
                            {/* Icon Badge */}
                            <div className="flex justify-center mb-1">
                                <div 
                                    className="p-1 sm:p-1.5 rounded-md backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110"
                                    style={{ 
                                        backgroundColor: `${PRIMARY_COLOR_50}40`,
                                        border: `1.5px solid ${PRIMARY_COLOR_200}`
                                    }}
                                >
                                    <FileText size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 hover:rotate-6" style={{ color: '#ffffff' }} />
                                </div>
                            </div>
                            
                            {/* Title */}
                            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-0.5 sm:mb-1 drop-shadow-2xl leading-tight">
                                Job Applications History
                            </h1>
                            
                            {/* Subtitle */}
                            <p className="text-xs sm:text-sm md:text-base text-white/90 mb-1 max-w-2xl mx-auto drop-shadow-lg">
                                Track and manage all your job applications in one place
                            </p>
                            
                            {/* Stats Badge */}
                            {total > 0 && (
                                <div className="flex justify-center">
                                    <div 
                                        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md shadow-lg"
                style={{
                                            backgroundColor: `${PRIMARY_COLOR_50}30`,
                                            border: `1px solid ${PRIMARY_COLOR_200}80`
                                        }}
                                    >
                                        <TrendingUp size={16} className="sm:w-4 sm:h-4" style={{ color: '#ffffff' }} />
                                        <span className="text-white font-semibold text-xs sm:text-sm">
                                            Total Applications: <span className="font-bold">{total}</span>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Decorative Bottom Wave */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg 
                            className="w-full h-3 sm:h-4 md:h-5 lg:h-6" 
                            viewBox="0 0 1440 120" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                        >
                            <path 
                                d="M0,120 L48,105 C96,90 192,60 288,45 C384,30 480,30 576,37.5 C672,45 768,60 864,67.5 C960,75 1056,75 1152,67.5 C1248,60 1344,45 1392,37.5 L1440,30 L1440,120 L1392,120 C1344,120 1248,120 1152,120 C1056,120 960,120 864,120 C768,120 672,120 576,120 C480,120 384,120 288,120 C192,120 96,120 48,120 L0,120 Z" 
                                fill="white" 
                                className="dark:fill-gray-900"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>

                {/* Loading State */}
                {isLoading && (
                    <section className='w-fit h-fit mx-auto gap-2 flex flex-col sm:flex-row items-center justify-center py-12 sm:py-16'>
                        <Spinner size='lg' style={{ color: PRIMARY_COLOR }} /> 
                        <p className="text-gray-600 dark:text-gray-400 ml-0 sm:ml-3 mt-2 sm:mt-0 text-sm sm:text-base">Loading your applications...</p>
                    </section>
                )}

                {/* Job Posts Grid */}
                {!isLoading && (
                <>
                    {jobPosts.length > 0 ? (
                        <div className="grid gap-4 md:gap-6 mb-8">
                            {jobPosts.map((post) => (
                                <Card
                                    key={post?.uuid}
                                    className="group hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                                >
                                    <CardContent className="p-6">
                                        {/* Header Section */}
                                        <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg" style={{ backgroundColor: PRIMARY_COLOR_50 }}>
                                                        <Briefcase size={20} style={{ color: PRIMARY_COLOR }} />
                                                    </div>
                                                    <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                                        {post?.jobRole}
                                                    </CardTitle>
                                                </div>
                                                <div className="flex items-center gap-2 ml-11">
                                                    <MapPin size={14} className="text-gray-500 dark:text-gray-400" />
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {countries[post?.country]?.name || post?.country} • {post?.jobType}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Badge className={getStatusColor(post?.status)}>
                                                    {post?.status?.toUpperCase()}
                                                </Badge>
                                                {post?.deletedAt !== null && (
                                                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                                                        <AlertCircle size={12} />
                                                        Post Deleted
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <Banknote size={18} style={{ color: PRIMARY_COLOR }} className="mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                        Salary Range
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {post?.salaryMin} - {post?.salaryMax} / Month
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <UserCheck size={18} style={{ color: PRIMARY_COLOR }} className="mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                        Experience Required
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {post?.experienceRequired} years
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <Calendar size={18} style={{ color: PRIMARY_COLOR }} className="mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                        Application Status
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {post?.status || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Section */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                <p className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    <span>Application ID: {post?.uuid?.slice(0, 8)}...</span>
                                                </p>
                                            </div>
                                            <Button
                                                variant="solid"
                                                size="sm"
                                                className="w-full sm:w-auto text-white"
                                                style={{ backgroundColor: PRIMARY_COLOR }}
                                                endContent={<Eye size={16} />}
                                                onPress={() => {
                                                    navigate(`/career/details/${post?.uuid}`)
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border border-gray-200 dark:border-gray-700">
                            <CardContent className="p-12 text-center">
                                <Briefcase size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Applications Found</p>
                                <p className="text-gray-600 dark:text-gray-400">You haven't applied to any jobs yet. Start exploring opportunities!</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {total > 0 && (
                        <div className='flex items-center justify-center mt-8'>
                            <div 
                                style={{ 
                                    '--pagination-color': PRIMARY_COLOR 
                                } as React.CSSProperties}
                            >
                                <style>{`
                                    [data-slot="cursor"] {
                                        background-color: var(--pagination-color) !important;
                                    }
                                    button[data-slot="item"]:hover {
                                        color: var(--pagination-color) !important;
                                    }
                                `}</style>
                        <Pagination
                            isCompact
                            showControls
                            page={pageValue}
                            total={Math.ceil(total / limit)}
                                    variant='flat'
                            onChange={(value) => {
                                setOffset(value * limit - limit)
                                setPageValue(value)
                            }}
                        />
                            </div>
                        </div>
                    )}
                </>
                )}
            </div>
        </div>
    )
}

export default CareerHistory
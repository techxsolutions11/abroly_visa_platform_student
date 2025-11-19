import React, { useEffect, useState } from 'react'
import {
    Drawer,
    DrawerContent,
} from "@/components/ui/drawer"

import { Eye, Calendar, UserCheck, Home, Briefcase, Flag, CurrencyIcon, MapPin, Banknote, Search } from 'lucide-react';

import { ListFilter } from 'lucide-react'

import { Button, Chip, Pagination, Spinner } from '@nextui-org/react'
import { useNavigate, useParams } from 'react-router-dom'
import AchievementBanner from '../AchievementBanner/AchievementBanner';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import ReactFlagsSelect from 'react-flags-select';
import { countries } from 'country-data';
import { getAgentUuid } from '@/utils/config';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Career = () => {

    const { commonPostAPICall } = useApiCallUtils()

    const { pageNo } = useParams<{ pageNo: any }>()

    const [page, setPage] = useState(pageNo)

    const [jobPosts, setJobPosts] = useState([])
    const [total, setTotal] = useState(0)

    const [isLoading, setIsLoading] = useState(true)
    const limit = 20;

    const [drawerOpen, setDrawerOpen] = useState(false)

    const [filters, setFilters] = useState({
        jobType: '',
        country: '',
        jobRole: '',
        salaryMin: '',
        salaryMax: '',
        experienceRequired: '',
        educationLevel: '',
        agent_uuid: getAgentUuid(),
    });

    useEffect(() => {
        window.scrollTo(0, 0)
        findCareer()
        setPage(pageNo)
    }, [filters, pageNo])


    const findCareer = async () => {
        setIsLoading(true)
        const { data, success, total } = await commonPostAPICall({ ...filters, offset: Number(+pageNo) * limit - limit, limit }, "/job_post/filter")
        if (success && success == true) {
            setJobPosts(data)
            setTotal(total)
        }
        setIsLoading(false)
    }



    // Handle changes in filter inputs
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
        navigate("/career/1")
    };
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        findCareer(); // Fetch filtered job posts
        setDrawerOpen(false)
    };

    const removeFilter = (filterName) => {
        setFilters({
            ...filters,
            [filterName]: '',
        });
        navigate("/career/1")
    };

    const navigate = useNavigate()

    console.log(page, "page");


    return (
        <section className='grid grid-cols-12'>
            <div className='container mx-auto col-span-10'>
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Available Job Posts
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Discover exciting career opportunities tailored to your skills
                        </p>
                    </div>

                    {/* Filters and Search Section */}
                    <Card className="mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                        <CardContent className="p-6">
                            <section className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4'>
                                <div className="flex items-center gap-2">
                                    <Briefcase size={20} className="text-primary" />
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Find Jobs: <span className="text-primary">{total}</span>
                                    </p>
                                </div>
                                <Button 
                                    variant="flat" 
                                    color='primary' 
                                    className='font-semibold'
                                    onPress={() => {
                                        setDrawerOpen(true)
                                    }}
                                > 
                                    <ListFilter size={16} /> Filters
                                </Button>
                            </section>

                            {/* Active Filters */}
                            {(filters.jobType || filters.country || filters.jobRole || filters.salaryMin || filters.salaryMax || filters.experienceRequired || filters.educationLevel) && (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active Filters:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {filters.jobType && (
                                            <Chip
                                                isCloseable
                                                color='primary'
                                                onClose={() => {
                                                    removeFilter('jobType')
                                                }}
                                            >
                                                {filters.jobType}
                                            </Chip>
                                        )}
                                        {filters.country && (
                                            <Chip
                                                isCloseable
                                                color='primary'
                                                onClose={() => {
                                                    removeFilter('country')
                                                }}
                                            >
                                                {countries[filters.country]?.name || filters.country}
                                            </Chip>
                                        )}
                                        {filters.jobRole && (
                                            <Chip
                                                isCloseable
                                                color='primary'
                                                onClose={() => {
                                                    removeFilter('jobRole')
                                                }}
                                            >
                                                {filters.jobRole}
                                            </Chip>
                                        )}
                                        {filters.salaryMin && (
                                            <Chip
                                                isCloseable
                                                color='primary'
                                                onClose={() => {
                                                    removeFilter('salaryMin')
                                                }}
                                            >
                                                Min Salary: {filters.salaryMin}
                                            </Chip>
                                        )}
                                        {filters.salaryMax && (
                                            <Chip
                                                isCloseable
                                                color='primary'
                                                onClose={() => {
                                                    removeFilter('salaryMax')
                                                }}
                                            >
                                                Max Salary: {filters.salaryMax}
                                            </Chip>
                                        )}
                                        {filters.experienceRequired && (
                                            <Chip
                                                isCloseable
                                                color='primary'
                                                onClose={() => {
                                                    removeFilter('experienceRequired')
                                                }}
                                            >
                                                Experience: {filters.experienceRequired} years
                                            </Chip>
                                        )}
                                        {filters.educationLevel && (
                                            <Chip
                                                isCloseable
                                                color='primary'
                                                onClose={() => {
                                                    removeFilter('educationLevel')
                                                }}
                                            >
                                                Education: {filters.educationLevel}
                                            </Chip>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                        <DrawerContent className='h-screen md:h-fit'>
                            <div className="p-6">
                                <div className="pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <ListFilter size={24} className="text-primary" />
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filter Job Posts</h2>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Refine your search to find the perfect job opportunity</p>
                                </div>
                                <div className="pt-2">
                                    <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Job Type */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Type</label>
                                            <select
                                                name="jobType"
                                                value={filters.jobType}
                                                onChange={handleFilterChange}
                                                className="mt-1 block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary"
                                            >
                                                <option value="">All</option>
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Temporary/Contract">Temporary/Contract</option>
                                                <option value="Internship">Internship</option>
                                            </select>
                                        </div>

                                        {/* Country */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                                            <ReactFlagsSelect
                                                selected={filters.country}
                                                placeholder="Select country"
                                                searchable
                                                onSelect={(e) => {
                                                    setFilters({
                                                        ...filters,
                                                        country: e,
                                                    });
                                                    navigate("/career/1")
                                                }}
                                                selectButtonClassName="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-left bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>

                                        {/* Job Role */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Role</label>
                                            <input
                                                type="text"
                                                name="jobRole"
                                                value={filters.jobRole}
                                                onChange={handleFilterChange}
                                                placeholder="Enter job role"
                                                className="mt-1 block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        {/* Salary Min */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Salary Min / Month</label>
                                            <input
                                                type="number"
                                                name="salaryMin"
                                                value={filters.salaryMin}
                                                onChange={handleFilterChange}
                                                placeholder="Enter min salary"
                                                className="mt-1 block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        {/* Salary Max */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Salary Max / Month</label>
                                            <input
                                                type="number"
                                                name="salaryMax"
                                                value={filters.salaryMax}
                                                onChange={handleFilterChange}
                                                placeholder="Enter max salary"
                                                className="mt-1 block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        {/* Experience Required */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experience Required</label>
                                            <input
                                                type="number"
                                                name="experienceRequired"
                                                value={filters.experienceRequired}
                                                onChange={handleFilterChange}
                                                placeholder="Enter experience in years"
                                                className="mt-1 block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        {/* Education Level */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Education Level</label>
                                            <input
                                                type="text"
                                                name="educationLevel"
                                                value={filters.educationLevel}
                                                onChange={handleFilterChange}
                                                placeholder="Enter education level"
                                                className="mt-1 block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="col-span-full flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <Button
                                                variant="flat"
                                                onPress={() => setDrawerOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                color="primary"
                                            >
                                                Apply Filters
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                    {/* Filters Section */}


                    {/* Job Post Cards */}
                    {isLoading == true && (
                        <section className='w-fit h-fit mx-auto gap-2 flex items-center justify-center py-12'>
                            <Spinner size='lg' /> 
                            <p className="text-gray-600 dark:text-gray-400 ml-3">Please Wait</p>
                        </section>
                    )}
                    <div className="grid gap-4 md:gap-6">
                        {jobPosts.length > 0 ? (
                            jobPosts.map((job) => (
                                <Card
                                    key={job.uuid}
                                    className="group hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                                >
                                    <CardContent className="p-6">
                                        {/* Header Section */}
                                        <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                                                        <Briefcase size={20} className="text-primary" />
                                                    </div>
                                                    <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                                        {job.jobRole}
                                                    </CardTitle>
                                                </div>
                                                <div className="flex items-center gap-2 ml-11">
                                                    <MapPin size={14} className="text-gray-500 dark:text-gray-400" />
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {countries[job?.country]?.name || job.country} • {job.jobType}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <Banknote size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                        Salary Range
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {job.salaryMin} - {job.salaryMax} / Month
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <UserCheck size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                        Experience Required
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {job.experienceRequired} years
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <Flag size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                        Education Level
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {job.educationLevel}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <UserCheck size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                        Skills Required
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                        {job.skillsRequired}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Job Features Badges */}
                                        <div className="mb-6 flex flex-wrap gap-2">
                                            <Badge variant={job.overtime ? "default" : "secondary"} className={job.overtime ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}>
                                                {job.overtime ? 'Overtime Available' : 'No Overtime'}
                                            </Badge>
                                            <Badge variant={job.accommodation ? "default" : "secondary"} className={job.accommodation ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}>
                                                {job.accommodation ? 'Accommodation' : 'No Accommodation'}
                                            </Badge>
                                            <Badge variant={job.transportation ? "default" : "secondary"} className={job.transportation ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}>
                                                {job.transportation ? 'Transportation' : 'No Transportation'}
                                            </Badge>
                                            <Badge variant={job.medicalInsurance ? "default" : "secondary"} className={job.medicalInsurance ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}>
                                                {job.medicalInsurance ? 'Medical Insurance' : 'No Insurance'}
                                            </Badge>
                                            <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                Food: {job.food}
                                            </Badge>
                                        </div>

                                        {/* Footer Section */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                                <p className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    <span>Posted: {new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </p>
                                            </div>
                                            <Button
                                                color="primary"
                                                variant="solid"
                                                size="sm"
                                                className="w-full sm:w-auto"
                                                endContent={<Eye size={16} />}
                                                onPress={() => {
                                                    navigate(`/career/details/${job.uuid}`);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : !isLoading && (
                            <Card className="border border-gray-200 dark:border-gray-700">
                                <CardContent className="p-12 text-center">
                                    <Briefcase size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Jobs Available</p>
                                    <p className="text-gray-600 dark:text-gray-400">Right now there are no jobs available. Please check back later.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {total > 0 && (
                    <div className='flex items-center justify-center mt-8'>
                        <Pagination
                            isCompact
                            showControls
                            page={+page}
                            total={Math.ceil(total / limit)}
                            variant='flat'
                            onChange={(e) => {
                                navigate(`/career/${e}`)
                            }}
                        />
                    </div>
                )}

            </div>

            <section className='col-span-2 h-full items-center'>
                <AchievementBanner target_type={"career"} />
            </section>
        </section>
    )
}

export default Career
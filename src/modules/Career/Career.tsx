import React, { useEffect, useState } from 'react'
import {
    Drawer,
    DrawerContent,
} from "@/components/ui/drawer"

import { Eye, Calendar, UserCheck, Home, Briefcase, Flag, CurrencyIcon, MapPin, Banknote } from 'lucide-react';

import { ListFilter } from 'lucide-react'

import { Button, Chip, Pagination, Spinner } from '@nextui-org/react'
import { useNavigate, useParams } from 'react-router-dom'
import AchievementBanner from '../AchievementBanner/AchievementBanner';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import ReactFlagsSelect from 'react-flags-select';
import { countries } from 'country-data';

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
                    <h1 className="text-3xl font-semibold text-center mb-8">Available Job Posts</h1>

                    <section className='flex flex-col md:flex-row items-center justify-between gap-2'>
                        <p>Find Jobs : {total}</p>
                        <div className="p-4 rounded-lg">
                            <div className="flex flex-wrap  gap-2 h-fit">
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
                                        {countries[filters.country]?.name ||   filters.country}
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

                        <Button variant="flat" color='warning' className='my-2 font-bold'
                            onPress={() => {
                                setDrawerOpen(true)
                            }}
                        > <ListFilter size={"15px"} /> Filters</Button>
                    </section>

                    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                        <DrawerContent className='h-screen md:h-fit'>
                            <div className="p-4 rounded-lg mb-8 overflow-y-scroll">
                                <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Job Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Job Type</label>
                                        <select
                                            name="jobType"
                                            value={filters.jobType}
                                            onChange={handleFilterChange}
                                            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
                                        >
                                            <option value="">All</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Temporary/Contract">Temporary/Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        {/* <input
                                            type="text"
                                            name="country"
                                            value={filters.country}
                                            onChange={handleFilterChange}
                                            placeholder="Enter country"
                                            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
                                        /> */}
                                        <ReactFlagsSelect
                                            selected={filters.country}
                                            placeholder="Select country"
                                            searchable
                                            onSelect={(e) => {
                                                // setFormData({ ...formData, country: e })
                                                setFilters({
                                                    ...filters,
                                                    country: e,
                                                });
                                                navigate("/career/1")
                                            }}
                                        />
                                    </div>

                                    {/* Job Role */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Job Role</label>
                                        <input
                                            type="text"
                                            name="jobRole"
                                            value={filters.jobRole}
                                            onChange={handleFilterChange}
                                            placeholder="Enter job role"
                                            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
                                        />
                                    </div>

                                    {/* Salary Min */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Salary Min / Month</label>
                                        <input
                                            type="number"
                                            name="salaryMin"
                                            value={filters.salaryMin}
                                            onChange={handleFilterChange}
                                            placeholder="Enter min salary"
                                            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
                                        />
                                    </div>

                                    {/* Salary Max */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Salary Max / Month</label>
                                        <input
                                            type="number"
                                            name="salaryMax"
                                            value={filters.salaryMax}
                                            onChange={handleFilterChange}
                                            placeholder="Enter max salary"
                                            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
                                        />
                                    </div>

                                    {/* Experience Required */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Experience Required</label>
                                        <input
                                            type="number"
                                            name="experienceRequired"
                                            value={filters.experienceRequired}
                                            onChange={handleFilterChange}
                                            placeholder="Enter experience in years"
                                            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
                                        />
                                    </div>

                                    {/* Education Level */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Education Level</label>
                                        <input
                                            type="text"
                                            name="educationLevel"
                                            value={filters.educationLevel}
                                            onChange={handleFilterChange}
                                            placeholder="Enter education level"
                                            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="col-span-full flex justify-end mt-4">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </form>
                            </div>


                        </DrawerContent>

                    </Drawer>
                    {/* Filters Section */}


                    {/* Job Post Cards in a Horizontal Layout */}
                    {isLoading == true && <section className='w-fit h-fit mx-auto gap-2 flex items-center justify-center'><Spinner size='sm' /> <p>Please Wait</p> </section>}
                    <div className="flex flex-wrap gap-6">
                        {jobPosts.length > 0 ? (
                            jobPosts.map((job) => (
                                <div
                                    key={job.uuid}
                                    className="w-full bg-white shadow-md rounded-lg p-6 border hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-start mb-4"
                                >
                                    {/* Left Column (Basic Details) */}
                                    <div className="w-full md:w-1/2 lg:w-1/3">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                                            <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                                            {job.jobRole}
                                        </h2>
                                        <p className="text-sm text-gray-500 mb-1">
                                            <MapPin className="inline w-4 h-4 mr-1 text-gray-400" />
                                            {countries[job?.country]?.name || job.country} - {job.jobType}
                                        </p>
                                        <div className="mb-4">
                                            <p className="font-semibold text-gray-700 flex items-center">
                                                <Banknote className="w-4 h-4 mr-1 text-gray-600" />
                                                Salary Range:
                                            </p>
                                            <p className="text-gray-600">
                                                {job.salaryMin} - {job.salaryMax} / Month
                                            </p>
                                        </div>
                                        <div className="mb-4">
                                            <p className="font-semibold text-gray-700 flex items-center">
                                                <UserCheck className="w-4 h-4 mr-1 text-gray-600" />
                                                Experience Required:
                                            </p>
                                            <p className="text-gray-600">{job.experienceRequired} years</p>
                                        </div>
                                    </div>

                                    {/* Right Column (Additional Details + Flags) */}
                                    <div className="w-full md:w-1/2 lg:w-2/3 md:pl-6">
                                        <div className="mb-4">
                                            <p className="font-semibold text-gray-700 flex items-center">
                                                <Flag className="w-4 h-4 mr-1 text-gray-600" />
                                                Education Level:
                                            </p>
                                            <p className="text-gray-600">{job.educationLevel}</p>
                                        </div>
                                        <div className="mb-4">
                                            <p className="font-semibold text-gray-700 flex items-center">
                                                <UserCheck className="w-4 h-4 mr-1 text-gray-600" />
                                                Skills Required:
                                            </p>
                                            <p className="text-gray-600">{job.skillsRequired}</p>
                                        </div>

                                        {/* Flags for Job Post Features */}
                                        <div className="mb-4 flex flex-wrap gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${job.overtime ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                                            >
                                                {job.overtime ? 'Overtime Available' : 'No Overtime'}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${job.accommodation ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                                            >
                                                {job.accommodation ? 'Accommodation Provided' : 'No Accommodation'}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${job.transportation ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                                            >
                                                {job.transportation ? 'Transportation Available' : 'No Transportation'}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${job.medicalInsurance ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                                            >
                                                {job.medicalInsurance ? 'Medical Insurance Provided' : 'No Medical Insurance'}
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">
                                                Food: {job.food}
                                            </span>
                                        </div>

                                        {/* Application Deadline and Apply Button */}
                                        <div className="text-gray-500 text-sm mb-4">
                                            <p className="flex items-center">
                                                <Calendar className="inline w-4 h-4 mr-1 text-gray-400" />
                                                Post On: {new Date(job.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="flex items-center">
                                                <Calendar className="inline w-4 h-4 mr-1 text-gray-400" />
                                                Application Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Button
                                            className="w-fit bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center"
                                            onPress={() => {
                                                navigate(`/career/details/${job.uuid}`);
                                            }}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 w-full">Right now there are no jobs available.</p>
                        )}
                    </div>
                </div>

                <div className='flex items-center justify-center'>
                    <Pagination
                        isCompact
                        showControls
                        // initialPage={+page}
                        page={+page}
                        total={Math.ceil(total / limit)}
                        variant='flat'
                        onChange={(e) => {
                            navigate(`/career/${e}`)
                        }}
                    />
                </div>

            </div>

            <section className='col-span-2 h-full items-center'>
                <AchievementBanner target_type={"career"} />
            </section>
        </section>
    )
}

export default Career
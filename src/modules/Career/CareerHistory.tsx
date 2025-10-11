import useApiCallUtils from '@/hooks/useApiCallUtils'
import { Button, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { countries } from 'country-data'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

    return (
        <div className='container mx-auto'>
            <Table
                aria-label="Job Post Listing"
                style={{
                    height: "auto",
                    minWidth: "100%",
                }}
                topContent={
                    <section className='flex flex-row justify-between items-center'>
                        <h1>Job Applications History</h1>
                    </section>
                }
                bottomContent={
                    <section className='mx-auto'>
                        <Pagination
                            isCompact
                            showControls
                            page={pageValue}
                            total={Math.ceil(total / limit)}
                            onChange={(value) => {
                                setOffset(value * limit - limit)
                                setPageValue(value)
                            }}
                        />
                    </section>
                }
            >
                <TableHeader>
                    <TableColumn>Job Role</TableColumn>
                    <TableColumn>Job Type</TableColumn>
                    <TableColumn>Country</TableColumn>
                    <TableColumn>Salary Range</TableColumn>
                    <TableColumn>Experience (Years)</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={
                        <p>No Rows to display</p>
                    }
                    loadingContent={<Spinner />}
                    // loadingState={isLoading}
                    isLoading={isLoading}
                >
                    {jobPosts.map((post) => (
                        <TableRow key={post?.uuid}>
                            <TableCell>{post?.jobRole}</TableCell>
                            <TableCell>{post?.jobType}</TableCell>
                            <TableCell>{countries[post?.country]?.name || post?.country}</TableCell>
                            <TableCell>
                                {post?.salaryMin} - {post?.salaryMax}
                            </TableCell>
                            <TableCell>{post?.experienceRequired}</TableCell>
                            <TableCell className='text-tiny'>
                                {post?.status?.toUpperCase()}
                                {post?.deletedAt !== null && <p className='text-danger-600'>Post Deleted</p>}
                            </TableCell>
                            <TableCell >
                                <Button onPress={() => {
                                    navigate(`/career/details/${post?.uuid}`)
                                }}>More Information</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CareerHistory
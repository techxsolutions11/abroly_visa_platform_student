import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Chip } from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'
import useApiCallUtils from '@/hooks/useApiCallUtils'

const ContentWritingHistory = () => {

    const { commonPostAPICall } = useApiCallUtils()

    const [list, setList] = useState([])

    useEffect(() => {
        findList()
    }, [])

    const findList = async () => {
        const { data, success } = await commonPostAPICall({}, "/content_writing_response/list")
        if (success && success == true) {
            setList(data)
        }
    }

    const navigate = useNavigate()

    return (
        <div>
            <section className='container mx-auto mt-10 flex flex-col items-center p-5'>

                <h1 className='text-2xl'>History of your request for Content Writing Module</h1>

                {list && list.length !== 0 ? <section className='w-full flex flex-col gap-2 mt-4'>

                    {list.map((user: any) => (
                        <Card>
                            <CardBody>
                                <div className="p-4">
                                    <div className="flex justify-between items-center">

                                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{user?.name}</h2>
                                        <Button variant='flat' color='default'
                                        
                                        onPress={()=>{
                                            navigate(`/content_writing_files/${user?.uuid}`)
                                        }}
                                        >View Documents</Button>
                                        {/* <p className="text-sm text-gray-500 dark:text-gray-400">ID: {user?.id}</p> */}
                                    </div>
                                    {/* <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">UUID: {user?.uuid}</p> */}

                                    <div className="mb-2">
                                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Email:</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                                    </div>

                                    <div className="mb-2">
                                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number:</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{user?.number}</p>
                                    </div>

                                    <div className="mb-2">
                                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Message:</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{user?.message}</p>
                                    </div>

                                    <div className="mb-2">
                                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Selected Type:</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{user?.selected_type.replaceAll("_", " ").toUpperCase()}</p>
                                    </div>

                                    <div className="mb-2">
                                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Payment Status:</span>
                                        {/* <p className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${user?.payment_status === "pending"
                                                ? "text-yellow-800 bg-yellow-100 dark:bg-yellow-200 dark:text-yellow-900"
                                                : "text-green-800 bg-green-100 dark:bg-green-200 dark:text-green-900"
                                            }`}>
                                            {user?.payment_status.charAt(0).toUpperCase() + user?.payment_status.slice(1)}
                                        </p> */}
                                        <Chip
                                            color={user?.payment_status === "pending" ? 'warning' : user?.payment_status === "paid" ? "success" : "danger"}
                                            variant='flat'
                                        >{user?.payment_status}</Chip>
                                        {user?.payment_status == "pending" && <Button className='ml-1' variant='flat' color='primary'>Pay Now</Button>}
                                    </div>

                                    <div className="mb-2">
                                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Application Status:</span>
                                        {/* <p className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${user?.application_status === "pending"
                                                ? "text-yellow-800 bg-yellow-100 dark:bg-yellow-200 dark:text-yellow-900"
                                                : "text-green-800 bg-green-100 dark:bg-green-200 dark:text-green-900"
                                            }`}>
                                            {user?.application_status.charAt(0).toUpperCase() + user?.application_status.slice(1)}
                                        </p> */}
                                        <Chip
                                            color={user?.application_status === "pending" ? 'warning' : "primary"}
                                            variant='flat'
                                        >{user?.application_status}</Chip>
                                    </div>

                                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                                        <p>Created: {new Date(user?.createdAt).toLocaleString()}</p>
                                        <p>Updated: {new Date(user?.updatedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}

                </section> :
                    <section>
                        <p>No Records Found</p>
                    </section>
                }


            </section>
        </div>
    )
}

export default ContentWritingHistory
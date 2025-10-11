import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Image, Select, SelectItem } from '@nextui-org/react'
import { ArrowRight, IndianRupee, ShoppingCart } from 'lucide-react'
import { ErrorToast } from '@/utils/Toaster'
import useApiCallUtils from '@/hooks/useApiCallUtils'

const LangaugePrepDetails = () => {

    const { commonPostAPICall, commonPostPublicAPICall  } = useApiCallUtils()

    const { id } = useParams()

    const [details, setDetails] = useState<any>({})

    const [isPurchased, setIsPurchased] = useState({ purchase: false, uuid: "" })

    useEffect(() => {
        fetchApiCall()
    }, [])


    const fetchApiCall = async () => {
        const { data, success } = await commonPostPublicAPICall({ uuid: id }, "/language_prep/public/details")
        if (success && success == true) {
            setDetails(data)
        }
    }

    const navigate = useNavigate()

    const [levels, setLevels] = useState('level1')

    const purchaseLevel = async () => {

        if (levels == "") {
            ErrorToast("Please Select Level")
            return
        }

        const { data, success } = await commonPostAPICall({ course_uuid: id, level: levels }, "/language_prep/student/purchase", true)
        if (success && success == true) {
            navigate(-1)
        }
    }

    useEffect(() => {
        purchaseCheck()
    }, [levels])

    const purchaseCheck = async () => {
        const { data, success } = await commonPostAPICall({ course_uuid: id, level: levels }, "/language_prep/student/purchase_check")
        if (success && success == true) {
            setIsPurchased(data)
        }
    }

    return (
        <div className="max-w-screen-xl mx-auto px-6 py-12">
            {/* Course Banner */}
            <div className="relative overflow-hidden shadow-xl rounded-2xl">
                <Image
                    src={details?.access_banner}
                    alt={details?.title}
                    className="w-screen object-cover h-64 md:h-80 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-75 rounded-2xl z-10" />
                <div className="absolute bottom-6 left-8 text-white z-10">
                    <h2 className="text-4xl font-bold drop-shadow-lg">{details?.title}</h2>
                </div>
            </div>

            {/* Course Description */}
            <div className="mt-12 bg-white border border-gray-200 shadow-md rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="mr-2 text-indigo-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                            />
                        </svg>
                    </span>
                    Description
                </h3>
                <div className="text-gray-700 leading-relaxed">
                    <p dangerouslySetInnerHTML={{ __html: details?.description }} />
                </div>
            </div>

            <section className='my-5 space-y-2 flex items-end gap-2'>
                <section>
                    <h1>Please Select Level</h1>
                    <Select
                        label="Level"
                        variant="bordered"
                        defaultSelectedKeys={["level1"]}
                        className="max-w-xs "
                        onChange={(e) => {
                            setLevels(e.target.value)
                        }}
                    >
                        {["level1", "level2", "level3"].map((item, index) => (
                            <SelectItem key={item}>
                                {item}
                            </SelectItem>
                        ))}
                    </Select>
                </section>
                {isPurchased?.purchase == true ?
                    <Button
                        variant='shadow'
                        color='primary'
                        onPress={() => {
                            navigate(`/purchased_language_prep/details/${isPurchased?.uuid}`)
                        }}
                    > View Progress  <ArrowRight className='p-1 -ml-2 hover:ml-0 transition-all' /></Button>
                    :
                    <Button
                        variant='shadow'
                        color='primary'
                        onPress={purchaseLevel}
                    > <ShoppingCart className='p-1' />  Purchase {levels}  <IndianRupee className='-mr-3 p-1' />{levels == "level1" ? details?.level1_price : levels == "level2" ? details?.level2_price : levels == "level3" ? details?.level3_price : "Please Select Level"}</Button>
                }
            </section>

            {/* Course Chapters */}
            <div className="my-5">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Chapters</h3>
                <ul className="space-y-6">
                    {details?.chapters?.filter((el) => el.level == levels)?.sort((a, b) => a.order_number - b.order_number).map((chapter, index) => (
                        <li
                            key={chapter?.chapter_name}
                            className="flex items-start bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:bg-gray-50 transition duration-300"
                        >
                            <div className="flex-shrink-0">
                                <div className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full">
                                    {chapter?.order_number}
                                </div>
                            </div>
                            <div className="ml-4">
                                <h4 className="text-xl font-semibold text-gray-900">
                                    {chapter.chapter_name}
                                </h4>
                                {/* <p className="text-gray-600 mt-1">{chapter.description}</p> */}
                                <p dangerouslySetInnerHTML={{ __html: chapter?.description }} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default LangaugePrepDetails
import { Button } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { getFromLocal } from '../utils/localstorage'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Edit3, FileText, PenTool } from 'lucide-react'
import useApiCallUtils from '@/hooks/useApiCallUtils'

const ContentWritingList = ({ onOpenChange = () => { }, setFormOptions = {}, formOptions = {} }: any) => {

    const { commonPublicGetApiCalls } = useApiCallUtils()

    const [contentWritingServiceList, setContentWritingServiceList] = useState([])


    const tokenData = getFromLocal("token")

    const token = useSelector((state: any) => state.login.token) || tokenData;

    useEffect(() => {
        initData()
    }, [])

    const initData = async () => {

        const { data, success } = await commonPublicGetApiCalls("/content_writing/list")
        if (success && success == true) {
            setContentWritingServiceList(data)
        }
    }

    const navigate = useNavigate()

    return (
        <div className="container mx-auto my-4 px-5 p-4 rounded-md shadow-md bg-gray-100">
            {/* Title and Description */}
            <div className="text-start mb-12 ">
                <h1 className="text-xl text-center font-bold text-gray-800 mb-4">
                    Expert Content Writing Services for Your Academic and Career Goals
                </h1>
                <p className="text-gray-600 text-center ">
                    Craft persuasive and professional documents essential for your study abroad or career journey.
                    Our team specializes in creating impactful <strong>Statements of Purpose (SOPs)</strong>,
                    <strong> Motivational Letters</strong>, and <strong>Cover Letters</strong>, tailored to highlight
                    your achievements and aspirations.
                </p>
            </div>

            {/* Services Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentWritingServiceList &&
                    contentWritingServiceList.slice(0, 3).map((item: any) => (
                        <div
                            key={item?.uuid}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-start px-4"
                        >
                            {/* Icons for Each Service */}
                            <div className="flex items-center mb-4">
                                {item?.key === "sop" && <FileText className="text-orange-500" size={40} />}
                                {item?.key === "motivation" && <Edit3 className="text-orange-500" size={40} />}
                                {item?.key === "cover" && <PenTool className="text-orange-500" size={40} />}
                            </div>

                            {/* Service Title */}
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {item?.name}
                            </h3>

                            {/* Service Description */}
                            <p className="text-gray-600 mb-4">{item?.description}</p>

                            {/* Know More Button */}
                            <Button
                                color="primary"
                                variant="shadow"
                                className="w-fit"
                                onPress={() => navigate(`/services/${item?.key}`)}
                            >
                                Know More
                            </Button>
                        </div>
                    ))}
            </section>
        </div>
    )
}

export default ContentWritingList
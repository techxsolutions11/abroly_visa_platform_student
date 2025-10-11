import useApiCallUtils from '@/hooks/useApiCallUtils'
import { Image, Spinner } from '@nextui-org/react'
import { Calendar, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LanguagePrepPurchased = () => {

  const { commonGetAPICalls, commonPostAPICall  } = useApiCallUtils()

    const [purchaseList, setPurchaseList] = useState([])

    // loader
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        findPurchaseList()
    }, [])

    const findPurchaseList = async () => {
        setIsLoading(true)
        const { success, data } = await commonGetAPICalls("/language_prep/student/purchase_list")
        if (success && success == true) {
            setPurchaseList(data)
        }
        setIsLoading(false)
    }

    const navigate = useNavigate()

    return (
        <div>
            {isLoading == true ? <div className='flex items-center justify-center my-5'><Spinner /></div> :
                <div className='space-y-2'>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Purchased Courses</h2>
                    {purchaseList.length !==0 ? 
                    purchaseList?.map((course:any)=>(
                        <div
                        key={course?.uuid}
                        className="bg-gray-50 hover:bg-gray-100 transition-colors duration-150 border border-gray-200 rounded-lg p-4 flex items-center"
                        onClick={()=>{
                          navigate(`/purchased_language_prep/details/${course?.uuid}`)
                        }}
                      >
                        {/* Course Banner */}
                        <Image
                          src={course?.course_of.access_banner}
                          alt="Course banner"
                          fallbackSrc="https://placehold.co/600x400@2x.png"
                          className="w-20 h-20 rounded-md object-cover mr-4"
                        />
            
                        {/* Course Details */}
                        <div className="flex-grow ml-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {course?.course_of.title} - {course?.level}
                          </h3>
                          <p
                            className="text-gray-600 text-sm mt-1"
                            dangerouslySetInnerHTML={{ __html: course?.course_of.description.slice(0, 120) + "..." }}
                          ></p>
            
                          {/* Course Date */}
                          <div className="flex items-center text-gray-500 text-sm mt-2">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>
                              Purchased on: {new Date(course?.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
            
                        {/* Action Icon */}
                        <ChevronRight className="text-gray-400 w-6 h-6 ml-4" />
                      </div>
                    ))

                    : <p>Nothing Purchased Yet</p>}

                    </div>}
        </div>
    )
}

export default LanguagePrepPurchased
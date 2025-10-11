import useApiCallUtils from '@/hooks/useApiCallUtils'
import { CheckCircle, Circle, Icon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Panel, PanelGroup } from 'rsuite'

const LanguagePrepPurchasedDetails = () => {

    const { commonPostAPICall } = useApiCallUtils()

    const { id } = useParams()

    const [courseDetails, setCourseDetails] = useState<any>({})

    useEffect(() => {
        findDetails()
    }, [])

    const findDetails = async () => {
        const { data, success } = await commonPostAPICall({ uuid: id }, "/language_prep/student/purchase_course_details")
        if (success && success == true) {
            setCourseDetails(data)
        }
    }

    return (
        <div>
            <div className="p-6 container grid grid-cols-2 gap-2 mx-auto">
                {/* Course Banner */}
                <section className="space-y-6">
                    <div className="w-full relative overflow-hidden rounded-lg">
                        <img
                            src={courseDetails?.access_banner}
                            alt={`${courseDetails?.title} Banner`}
                            className="w-full h-64 object-cover"
                        />
                    </div>

                    {/* Course Title & Description */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{courseDetails?.title}</h1>
                        <div
                            className="text-gray-600 mt-2"
                            dangerouslySetInnerHTML={{ __html: courseDetails?.description }}
                        />
                    </div>
                </section>

                {/* Chapters */}
                <PanelGroup accordion bordered>
                    {courseDetails?.chapters?.map((chapter, chapterIndex) => (
                        <Panel
                            key={chapterIndex}
                            header={
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-700">
                                        Chapter {chapterIndex + 1}: {chapter?.chapter_name}
                                    </h2>
                                    {/* <Icon name="chevron-down" className="text-gray-600" /> */}
                                </div>
                            }
                        >
                            {/* Chapter Description */}
                            <div
                                className="text-gray-600 mt-2"
                                dangerouslySetInnerHTML={{ __html: chapter?.description }}
                            />

                            {/* Chapter Points */}
                            <div className="space-y-4 mt-4">
                                {chapter?.chapter_points?.map((point, pointIndex) => (
                                    <ChapterPoint
                                        key={point?.uuid}
                                        point={point}
                                        pointIndex={pointIndex}
                                    />
                                ))}
                            </div>
                        </Panel>
                    ))}
                </PanelGroup>
            </div>
        </div>
    )
}
function ChapterPoint({ point, pointIndex }) {
    const [isCompleted, setIsCompleted] = useState(false);

    return (
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center space-x-4">
                <h2 className="text-lg text-gray-700 font-medium">{point?.title}</h2>
            </div>

            {/* 
            <button
                onClick={() => setIsCompleted(!isCompleted)}
                className="flex items-center space-x-2 text-sm text-gray-700"
            >
                {isCompleted ? (
                    <>
                        <CheckCircle className="text-green-500" />
                        <span>Completed</span>
                    </>
                ) : (
                    <>
                        <Circle className="text-gray-500" />
                        <span>Mark as Completed</span>
                    </>
                )}
            </button> */}
        </div>
    );
}

export default LanguagePrepPurchasedDetails
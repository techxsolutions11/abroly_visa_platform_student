import useApiCallUtils from '@/hooks/useApiCallUtils'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const SubPointDetails = () => {

    const { commonPostAPICall } = useApiCallUtils()
    
    const { purchase_id, point_id } = useParams()
    const [courseDetails, setCourseDetails] = useState<any>({})

    useEffect(() => {
        findDetails()
    }, [])

    const findDetails = async () => {
        const { data, success } = await commonPostAPICall({ purchase_id, point_id }, "/language_prep/student/purchase_course_details")
        if (success && success == true) {
            setCourseDetails(data)
        }
    }

    return (
        <div>{JSON.stringify(courseDetails)}</div>
    )
}

export default SubPointDetails
import useApiCallUtils from '@/hooks/useApiCallUtils'
import { Button, Input, Textarea } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

const PublicStatic = () => {

    const { commonPostPublicAPICall } = useApiCallUtils()

    const { id } = useParams()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [url, setUrl] = useState("")

    useEffect(() => {
        fetchStaticContent()
        window.scrollTo(0, 0)
    }, [id])

    const navigate = useNavigate()

    const fetchStaticContent = async () => {
        const { data, success } = await commonPostPublicAPICall({
            url: id
        }, "/static/detail")
        if (success && success == true) {
            setTitle(data.title)
            setDescription(data.description)
            setUrl(data.url)
        }
    }

    return (
        <div className=' my-6 mx-auto space-y-4 max-w-4xl'>
            <p className='text-xl font-bold text-center'>{title}</p>

            <section className='space-y-3'>

                <div
                    className="text-gray-700 dark:text-white leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: description }}
                />


            </section>

        </div>
    )
}

export default PublicStatic
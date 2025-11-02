import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, Image } from '@nextui-org/react'
import useApiCallUtils from '@/hooks/useApiCallUtils'
import { getAgentId } from '@/utils/config'

const LanguagePrep = () => {

    const { commonPublicGetApiCalls  } = useApiCallUtils()
    const [languages, setLanguages] = useState([])

    useEffect(() => {
        fetchApiCall()
    }, [])


    const fetchApiCall = async () => {
        alert( getAgentId())
        const { data, success } = await commonPublicGetApiCalls("/language_prep/public/list/" + getAgentId())
        if (success && success == true) {
            setLanguages(data)
        }
    }

    const navigate = useNavigate()

    return (
        <div className='container mx-auto'>

            {/* <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-10 rounded-lg flex flex-row items-center justify-around">
                <section className='flex-2'>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Language Preparation
                    </h2>
                    <p className="text-gray-200 mb-6">
                        Unlock the power of effective communication with our comprehensive Language Preparation Module. Designed for learners at all levels, this course provides essential tools and strategies to enhance your language skills, build confidence, and prepare you for real-world conversations. Whether you’re starting from scratch or looking to refine your existing abilities, our interactive lessons will guide you every step of the way.
                    </p>
                </section>
            </div> */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4" id='languages'>
                {languages.map((item, index) => (
                    <Card
                        shadow="sm"
                        key={index}
                        isPressable
                        onPress={() => {
                            navigate(`/language_preparation/${item.uuid}`)
                        }}
                    >
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={item.title}
                                className="w-full object-cover h-[140px]"
                                src={item.access_banner ? item.access_banner : "https://images.pexels.com/photos/3747556/pexels-photo-3747556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                            />
                        </CardBody>
                        <CardFooter className="text-small flex-row justify-between gap-2">
                            <p className='text-start font-medium '>{item.title}</p>
                            <Button
                                onPress={() => {
                                    navigate(`/language_preparation/${item.uuid}`)
                                }}
                                variant='flat'
                                color='primary'
                                size='sm'
                            >Learn More</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>



        </div>
    )
}

export default LanguagePrep
import { Button, Card, CardBody, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFromLocal } from '../../utils/localstorage'
import { useSelector } from 'react-redux'
import CommonConfirmation from '../../components/CommonConfirmation'
import AchievementBanner from '../AchievementBanner/AchievementBanner'
import useApiCallUtils from '@/hooks/useApiCallUtils'

const SimCardListing = () => {

    const { commonPublicGetApiCalls } = useApiCallUtils()

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const tokenData = getFromLocal("token")

    const token = useSelector((state: any) => state.login.token) || tokenData;

    const [simCardData, setSimCardData] = useState([])

    useEffect(() => {
        fetchApiCall()
    }, [])


    const fetchApiCall = async () => {
        const { data, success } = await commonPublicGetApiCalls("/sim/list")
        if (success && success == true) {
            setSimCardData(data)
        }
    }

    const navigate = useNavigate()

    return (
        <div>
            <section className='container mx-auto my-16 space-y-5' id='services' >
                <h1 className='text-3xl text-center'>Sim-card Options</h1>

                <section className='flex flex-row flex-wrap gap-2 container mx-auto items-stretch justify-center'>
                    {simCardData.map((item: any) => (
                        <Card className='size-full md:size-1/4 p-2 mx-2 sm:m-0 shadow-sm shadow-orange-300'>
                            <CardBody className='flex gap-2'>
                                <h1 className='text-xl'>{item?.name}</h1>
                                <p>{item?.details}</p>
                                <section className='flex-grow flex items-end'>

                                    <Button
                                        onPress={() => {
                                            token && token != "" ? window.open(item?.url, "_blank") : onOpenChange()
                                        }}>
                                        Know More</Button>
                                </section>
                            </CardBody>
                        </Card>

                    ))}
                </section>

                <AchievementBanner target_type={"sim_card"} />

            </section>

            <CommonConfirmation
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={"You Need to login first to know more, do you want to login now ?"}
                handleSubmit={() => {
                    navigate("/login")

                }}
                nagativeTitle={"No"}
                positiveTitle={"Yes"}
            />
        </div>
    )
}

export default SimCardListing
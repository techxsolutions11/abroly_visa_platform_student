import useApiCallUtils from '@/hooks/useApiCallUtils'
import { SuccessToast } from '@/utils/Toaster'
import { Button, Card, CardBody, CardFooter, Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/react'
import { QuestionMarkIcon } from '@radix-ui/react-icons'
import { Calendar } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { BsExclamationOctagon } from 'react-icons/bs'
import { Carousel, Tooltip } from 'rsuite'

const PublicEventBanners = () => {

    const { commonPostPublicAPICall, commonPublicGetApiCalls } = useApiCallUtils()

    const [eventBanners, setEventBanners] = useState<any[]>([])

    useEffect(() => {
        getEventBanners()
    }, [])

    const getEventBanners = async () => {
        const { success, data } = await commonPublicGetApiCalls('/event-banners/public-active-events')
        if (success && success == true) {
            setEventBanners(data)
        }
    }

    const { isOpen, onOpenChange } = useDisclosure()
    const [currentEvent, setCurrentEvent] = useState<any>(null)
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: ''
    })

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        const { success } = await commonPostPublicAPICall({
            name: formData.name,
            email: formData.email,
            phone_number: formData.mobile,
            event_id: currentEvent?.uuid
        }, "/event-banners/public-response", true)
        if (success && success == true) {
            setFormData({
                name: '',
                email: '',
                mobile: ''
            })
            setShowForm(false)
            onOpenChange()
        }
    }

    return (
        <div className='container mx-auto my-'>
            <div className="grid sm:grid-cols-2 gap-4 p-4">
                {eventBanners.map((item, index) => (
                    <div key={index} className="w-full h-full">
                        <Card key={item?.uuid} className="shadow" onClick={(e) => { e.stopPropagation(); onOpenChange(); setCurrentEvent(item) }} isPressable>
                            <CardBody className="overflow-visible p-0">
                                {item?.images && item.images.length > 0 && (
                                    <>
                                        <Carousel autoplayInterval={5000} shape='bar' autoplay className="custom-slider aspect-video h-fit w-fit" >
                                            {item.images.map((image, index) => (
                                                <div className="relative">
                                                    <img key={image?.uuid} src={image?.url} alt={`Event Banner ${index}`} className="w-fit h-auto object-center aspect-video" />
                                                </div>
                                            ))}
                                        </Carousel>
                                    </>
                                )}
                            </CardBody>
                            <CardFooter className='flex justify-between items-center'>
                                <div className="text-start text-tiny">
                                    {item?.heading}
                                </div>
                                <Button variant='solid' color='primary' size='sm' onClick={(e) => { e.stopPropagation(); onOpenChange(); setCurrentEvent(item) }}>Know More</Button>
                            </CardFooter>
                        </Card>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                scrollBehavior='inside'
                size="3xl"
                onClose={() => {
                    setFormData({
                        name: '',
                        email: '',
                        mobile: ''
                    })
                    setShowForm(false)

                }}
                backdrop='blur'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="overflow-visible p-0">
                                <Card>
                                    <CardBody className="overflow-visible p-0">
                                        {currentEvent?.images && currentEvent?.images?.length > 0 && (
                                            <Carousel autoplayInterval={5000} shape='bar' autoplay className="custom-slider aspect-video h-fit w-fit" >
                                                {currentEvent?.images.map((image, index) => (
                                                    <img key={image?.uuid} src={image?.url} alt={`Event Banner ${index}`} className="w-fit h-auto object-center aspect-video" />
                                                ))}
                                            </Carousel>
                                        )}
                                    </CardBody>
                                    <CardFooter className="p-4 flex flex-col gap-2 items-start justify-start">
                                        <div className="text-start text-sm flex flex-col gap-2 w-full">
                                            {showForm ? (
                                                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                                                    <input
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        type="text" placeholder="Name" className="border p-2" required />
                                                    <input
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        type="email" placeholder="Email" className="border p-2" required />
                                                    <input
                                                        value={formData.mobile}
                                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                        type="number" placeholder="Mobile Number" className="border p-2" required />
                                                    <div className='w-full flex justify-end gap-2'>
                                                        <Button variant='shadow' color='primary' type='submit' size='sm'>Submit</Button>
                                                        <Button variant='shadow' color='danger' size='sm' onClick={() => setShowForm(false)}>Cancel</Button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <h2 className="font-bold">{currentEvent?.heading}</h2>
                                                    <hr className='w-full' />
                                                    <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: currentEvent?.descriptive_text }}></p>
                                                    <hr className='w-full' />
                                                    <div className="flex items-center text-gray-500">
                                                        <Calendar className="mr-2" size={16} />
                                                        <p>
                                                            Start Date: {new Date(currentEvent?.start_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center text-gray-500">
                                                        <Calendar className="mr-2" size={16} />
                                                        <p>
                                                            End Date: {new Date(currentEvent?.end_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className='w-full flex justify-end gap-2'>
                                                        <Button variant='shadow' color='primary' size='sm' onClick={() => setShowForm(true)}>Interested</Button>
                                                        <Button variant='shadow' color='danger' size='sm' onClick={onOpenChange}>Close</Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </CardFooter>
                                </Card>
                            </ModalBody>
                        </>)}
                </ModalContent>
            </Modal>

        </div>
    )
}

export default PublicEventBanners
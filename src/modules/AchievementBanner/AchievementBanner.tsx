import useApiCallUtils from '@/hooks/useApiCallUtils'
import { ModalContent, useDisclosure, Modal, ModalHeader, ModalBody, Input, Button } from '@nextui-org/react'
import { LucideMegaphone } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { getAgentUuid } from '@/utils/config'

const AchievementBanner = ({ target_type }) => {

    const {commonGetAPICalls, commonPostPublicAPICall} = useApiCallUtils()

    const [banners, setBanners] = useState([])

    useEffect(() => {
        findBanners()
    }, [target_type])

    const findBanners = async () => {
        const { data, success } = await commonGetAPICalls(`/side_banner/student/achievement/${target_type}/${getAgentUuid()}`)
        if (success && success == true) {
            setBanners(data)
        }
    }

    const { isOpen: isOpenInquieryAdd, onOpenChange: onOpenChangeInquieryAdd } = useDisclosure();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone_number: "",
        banner_id: "",
        title: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('option_')) {
            const optionKey = name.split('_')[1];
            setForm({
                ...form
            });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const submitApiCall = async () => {
        const { success } = await commonPostPublicAPICall({ ...form }, "/side_banner/student/add_interest", true)
        if (success && success == true) {
            onOpenChangeInquieryAdd()
            setForm({
                name: "",
                email: "",
                phone_number: "",
                banner_id: "",
                title: ""
            })
        }
    }

    return (
        <div className='w-full flex flex-wrap justify-center gap-4 p-4'>
            {banners?.sort((a, b) => a.position - b.position)?.map((item: any, index: number) => (
                <div
                    key={item?.uuid || index}
                    onClick={() => {
                        setForm({
                            name: "",
                            email: "",
                            phone_number: "",
                            banner_id: item?.uuid,
                            title: item?.campaign_title
                        })
                        onOpenChangeInquieryAdd()
                    }}
                    className="flex flex-col cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ maxWidth: '300px' }}
                >
                    {item?.access_image ? (
                        <img
                            src={item?.access_image}
                            alt={item?.campaign_title}
                            className="w-full h-auto rounded-md shadow-sm"
                        />
                    ) : (
                        <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 rounded-md">
                            <div className="text-center">
                                <LucideMegaphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-xs">No Image</p>
                            </div>
                        </div>
                    )}
                    {item?.campaign_title && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                            {item?.campaign_title}
                        </p>
                    )}
                </div>
            ))}

            <Modal
                isOpen={isOpenInquieryAdd}
                onOpenChange={onOpenChangeInquieryAdd}
                scrollBehavior="inside"
                backdrop='blur'
                size='3xl'
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Submit Your Interest - {form?.title}
                            </ModalHeader>
                            <ModalBody>
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    submitApiCall()
                                }} className="space-y-4 mb-8">
                                    <div>
                                        <Input
                                            type="email"
                                            label="Email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="text"
                                            name="name"
                                            label="Name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="text"
                                            name="phone_number"
                                            label="Phone Number"
                                            value={form.phone_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        variant='shadow'
                                        color='primary'
                                    >
                                        Submit
                                    </Button>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default AchievementBanner
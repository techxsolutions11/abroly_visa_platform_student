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
        <div className='flex flex-col justify-center items-center'>
            <>
                {/* {JSON.stringify(banners)} */}
                {banners?.sort((a, b) => a.position - b.position)?.map((item: any) => (<div
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
                    className="flex flex-col p-4 max-w-sm">

                    {/* Banner Image */}
                    {item?.access_image ? (
                        <img
                            src={item?.access_image}
                            alt={item?.campaign_title}
                            className="w-full object-scale-down"
                        />
                    ) : (
                        <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400 rounded-md mb-4">
                            No Image Available
                        </div>
                    )}
                    <p className="text-[10px] text-gray-400">{item?.campaign_title}</p>
                </div>
                ))}
            </>

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
                                {/* Form for adding/updating questions */}
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    submitApiCall()
                                }} className="space-y-4 mb-8">
                                    <div>
                                        {/* <label className="block text-lg">Email</label> */}
                                        <Input
                                            type="email"
                                            label="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            labelPlacement='outside-left'
                                            className='block'
                                            required
                                        />
                                    </div>
                                    <div>
                                        {/* <label className="block text-lg">Name</label> */}
                                        <Input
                                            type="text"
                                            name="name"
                                            label="Name"
                                            value={form.name}
                                            onChange={handleChange}
                                              labelPlacement='outside-left'
                                               className='block'
                                            required
                                        />
                                    </div>
                                    <div>
                                        {/* <label className="block text-lg">Name</label> */}
                                        <Input
                                            type="text"
                                            name="phone_number"
                                            label="Phone Number"
                                            value={form.phone_number}
                                              labelPlacement='outside-left'
                                               className='block'
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
import { Accordion, AccordionItem, Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import React, { useState } from 'react'
import { BiBadge } from 'react-icons/bi'
import { FaPlayCircle } from 'react-icons/fa'

import FaqSection from '../../components/FaqSection';
import Testimonials from '../../components/Testimonials';
import { Md12Mp } from 'react-icons/md';
import ContentWritingList from '../../components/ContentWritingList';
import { useNavigate } from 'react-router-dom';
import HomePageFlags from '../../components/HomePageFlags';
import { useDispatch } from 'react-redux';
import { TbReceiptRupee } from 'react-icons/tb';
import * as Yup from 'yup'
import { ErrorMessage, Form, Formik } from 'formik';
import { SuccessToast } from '../../utils/Toaster';
import { BookOpen, Briefcase, Globe, HelpCircle, Home, MapPin, Paperclip, Shield } from 'lucide-react';
import useApiCallUtils from '@/hooks/useApiCallUtils';

const PrivateIntroPage = () => {


    const { commonPostAPICall } = useApiCallUtils()

    const navigate = useNavigate()

    const dispatch = useDispatch()


    const [formOptions, setFormOptions] = useState({
        name: "",
        number: "",
        email: "",
        content_requirement: "",
        message: ""
    })

    // for submit content wrting 
    const validationSchema = Yup.object({
        name: Yup.string().required('Please Provide Name'),
        number: Yup.string().required('Please Provide Number for contact you'),
        email: Yup.string().email('Invalid email address').required('Please Provide Email'),
        content_requirement: Yup.string().required('Content Requirement must be selected'),
        message: Yup.string().required('Please Provide Message, that will help us to know about your requirement'),
    });

    const [isSubmit, setIsSubmit] = useState(false)

    // handle submit content writing 
    const handleSubmitContentWriting = async (values: any) => {
        setIsSubmit(true)
        const { success, data } = await commonPostAPICall({ ...values }, "/content_writing_response/submit_form")
        if (success && success == true) {
            SuccessToast("Submitted For Review, Please wait for redirection to get more Information")
            navigate("/content_writing_history")
        }
        setIsSubmit(false)


    }

    return (
        <div className=''>

            {/* <div className="container  p-6 sm:p-6 lg:p-8" >
                <div className="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center">
                    <div className="lg:col-span-3">
                        <h1 className="tracking-* text-3xl font-bold lg:text-3xl">Abroly - Destination, One Click</h1>
                        <p className="my-3 text-lg ">Find all visa-related solutions, tailored for students and travelers. From application guidance to expert advice, Abroly simplifies your journey abroad.</p>

                        <Button
                            as={"a"}
                            href='#services'
                            variant='flat'
                            color='primary'
                        >
                            Getting Started
                        </Button>

                    </div>

                    <div className="lg:col-span-4 mt-10 lg:mt-0 hidden sm:block">
                        <video className="w-full h-[50vh] object-cover rounded-xl" src='https://videos.pexels.com/video-files/7431747/7431747-uhd_2732_1440_30fps.mp4' autoPlay loop muted />
                    </div>
                </div>
            </div> */}

            {/* services */}

            <section className='container' id='services' >
                <h1 className='text-3xl text-center my-5'>Everything you need for academics in one place</h1>

                {/* <p className='text-center'>Content Writing</p> */}
                <ContentWritingList setFormOptions={setFormOptions} formOptions={formOptions} />

                <section className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 p-4">
                    {[
                        {
                            title: "Visa & Course Consultation",
                            description: 
                                "Expert guidance on visa processes and course selection to help you make informed decisions for your academic journey.",
                            icon: <MapPin className="text-orange-500" size={40} />,
                            navigateTo: "/services/visa_consultation",
                        },
                        {
                            title: "Health Insurance",
                            description:
                                "Comprehensive health coverage to ensure peace of mind during your academic pursuits abroad.",
                            icon: <Shield className="text-orange-500" size={40} />,
                            navigateTo: "/services/health_ins",
                        },
                        {
                            title: "International SIM Card",
                            description:
                                "Stay connected with affordable international SIM card options tailored to your needs.",
                            icon: <Briefcase className="text-orange-500" size={40} />,
                            navigateTo: "/services/sim_card",
                        },
                        {
                            title: "Accommodation",
                            description:
                                "Find comfortable and secure accommodation options near your university or workplace.",
                            icon: <Home className="text-orange-500" size={40} />,
                            navigateTo: "/services/accommodation",
                        },
                        {
                            title: "Tourist Visa/Package",
                            description:
                                "Hassle-free visa services and exciting travel packages to explore new destinations.",
                            icon: <Globe className="text-orange-500" size={40} />,
                            navigateTo: "/services/tourist_visa",
                        },
                        {
                            title: "Language Preparation",
                            description:
                                "Master your language skills with our expert-led preparation courses for a successful future.",
                            icon: <BookOpen className="text-orange-500" size={40} />,
                            navigateTo: "/services/language",
                        },
                        
                    ].map((service, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-start justify-between"
                        >
                            <div className="flex items-center mb-4">{service.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            <Button
                                color="primary"
                                variant="shadow"
                                className="w-fit"
                                onPress={() => navigate(service.navigateTo)}
                            >
                                Know More
                            </Button>
                        </div>
                    ))}
                </section>
            </section>

            {/* why choose abroly */}

            {/* <Testimonials /> */}

            {/* <FaqSection /> */}


        </div>
    )

}

export default PrivateIntroPage
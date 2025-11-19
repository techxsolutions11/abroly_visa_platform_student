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
import { BookOpen, Briefcase, Globe, HelpCircle, Home, MapPin, Paperclip, Shield, ArrowRight } from 'lucide-react';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
        <div className='w-full min-h-screen p-4 md:p-6 lg:p-8'>
            <section className='max-w-7xl mx-auto' id='services'>
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3'>
                        Everything you need for academics in one place
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Comprehensive services to support your academic journey abroad
                    </p>
                </div>

                {/* Services Grid */}
                <section className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                    {[
                        {
                            title: "Visa & Course Consultation",
                            description: 
                                "Expert guidance on visa processes and course selection to help you make informed decisions for your academic journey.",
                            icon: <MapPin className="text-primary" size={24} />,
                            navigateTo: "/services/visa_consultation",
                        },
                        {
                            title: "Health Insurance",
                            description:
                                "Comprehensive health coverage to ensure peace of mind during your academic pursuits abroad.",
                            icon: <Shield className="text-primary" size={24} />,
                            navigateTo: "/services_request/health",
                        },
                        {
                            title: "International SIM Card",
                            description:
                                "Stay connected with affordable international SIM card options tailored to your needs.",
                            icon: <Briefcase className="text-primary" size={24} />,
                            navigateTo: "/services_request/data",
                        },
                        // {
                        //     title: "Language Preparation",
                        //     description:
                        //         "Master your language skills with our expert-led preparation courses for a successful future.",
                        //     icon: <BookOpen className="text-primary" size={24} />,
                        //     navigateTo: "/services/language",
                        // },
                    ].map((service, index) => (
                        <Card
                            key={index}
                            className="group hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer"
                            onClick={() => navigate(service.navigateTo)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                                        {service.icon}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                            {service.title}
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-400">
                                            {service.description}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    color="primary"
                                    variant="flat"
                                    size="sm"
                                    className="w-full sm:w-auto"
                                    endContent={<ArrowRight size={16} />}
                                    onPress={() => navigate(service.navigateTo)}
                                >
                                    Know More
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </section>
        </div>
    )

}

export default PrivateIntroPage
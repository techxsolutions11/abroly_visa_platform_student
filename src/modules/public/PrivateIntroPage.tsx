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
import { motion } from "framer-motion";
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

    const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.7 } },
};


const services = [
        {
            title: "Visa & Course Consultation",
            description:
                "Get expert visa support, country guidance and personalised course selection for your academic goals.",
            icon: <MapPin size={28} />,
            tag: "Top Service",
            img: "https://images.pexels.com/photos/7009468/pexels-photo-7009468.jpeg",
            navigateTo: "/services/visa_consultation",
        },
        {
            title: "Health Insurance",
            description:
                "Choose student-friendly international health policies that protect you throughout your study abroad journey.",
            icon: <Shield size={28} />,
            tag: "Trending",
            img: "https://images.unsplash.com/photo-1584466977773-e625c37cdd50",
            navigateTo: "/services_request/health",
        },
        {
            title: "Job Placement Support",
            description:
                "Access to exclusive job opportunities and career guidance to kickstart your professional journey.",
            icon: <Briefcase size={28} />,
            tag: "Popular",
            img: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
            navigateTo: "/career/1",
        },
        {
            title: "Accommodation Assistance",
            description:
                "Find safe and comfortable housing options near your educational institution.",
            icon: <Home size={28} />,
            tag: "New",
            img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
            navigateTo: "/services/accommodation",
        },
    ];




    return (
          <motion.div 
            className="w-full min-h-screen p-6 md:p-10 lg:p-14 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        >

            {/* ========= HERO SECTION ========= */}
            <motion.section 
                className="max-w-7xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
                variants={fadeUp}
            >
                <div>
                    <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide">
                        Study Abroad Services
                    </span>

                    <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        Your Complete Student Visa & Study Abroad Platform
                    </h1>

                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl">
                        All essential services designed to make your international academic journey smooth, successful and stress-free.
                    </p>
                </div>

                <motion.img
                    src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&w=1500&q=80"
                    alt="Student Abroad"
                    className="rounded-3xl shadow-xl w-full object-cover"
                    variants={fadeIn}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                />
            </motion.section>

            {/* ========= SERVICES SECTION ========= */}
            <motion.section 
                className="max-w-7xl mx-auto mb-16"
                variants={fadeUp}
            >
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Our Services
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Comprehensive solutions to support your study abroad journey
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={fadeUp}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <Card
                                className="group h-full flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                                onClick={() => navigate(service.navigateTo)}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={service.img}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                                        {service.tag}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg text-primary">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                            {service.title}
                                        </h3>
                                    </div>
                                    
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1">
                                        {service.description}
                                    </p>

                                    <Button
                                        variant="ghost"
                                        className="w-fit px-0 text-primary hover:bg-transparent hover:underline group-hover:translate-x-2 transition-transform"
                                        endContent={<ArrowRight size={16} className="ml-1" />}
                                        onPress={() => navigate(service.navigateTo)}
                                    >
                                        Learn More
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ========= CTA SECTION ========= */}
            <motion.section 
                className="max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
                variants={fadeUp}
            >
                <motion.img
                    src="https://images.pexels.com/photos/845451/pexels-photo-845451.jpeg?_gl=1*iuyguf*_ga*MjUyOTc2MDM3LjE3NTQ2NjU3OTM.*_ga_8JE65Q40S6*czE3NjM5NjI4NjIkbzE3JGcxJHQxNzYzOTYzNjUzJGo0NSRsMCRoMA.."
                    alt="Support"
                    className="rounded-3xl shadow-xl w-full object-cover"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                />

                <motion.div 
                    className="bg-white dark:bg-gray-900 bg-opacity-70 backdrop-blur-xl rounded-3xl p-10 shadow-lg border border-gray-200 dark:border-gray-700"
                    variants={fadeUp}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Need More Support?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Our counsellors help with profile assessment, university selection, visa documentation, and complete end-to-end support.
                    </p>

                    <Button
                        size="lg"
                        color="primary"
                        variant="flat"
                        className="font-medium px-9 py-2"
                        onPress={() => navigate("/contact")}
                    >
                        Contact Us
                    </Button>
                </motion.div>
            </motion.section>
        </motion.div>
    )

}

export default PrivateIntroPage
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
import { BookOpen, Briefcase, Globe, HelpCircle, Home, MapPin, Paperclip, Shield, ArrowRight, GraduationCap, Wifi } from 'lucide-react';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PRIMARY_COLOR, PRIMARY_COLOR_50, PRIMARY_COLOR_100, PRIMARY_COLOR_200, PRIMARY_COLOR_800, PRIMARY_COLOR_900 } from '@/lib/theme';

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
            icon: <MapPin size={28} style={{ color: PRIMARY_COLOR }} />,
            tag: "Top Service",
            img: "https://images.pexels.com/photos/7009468/pexels-photo-7009468.jpeg",
            navigateTo: "/services/visa_consultation",
        },
        {
            title: "Health Insurance",
            description:
                "Choose student-friendly international health policies that protect you throughout your study abroad journey.",
            icon: <Shield size={28} style={{ color: PRIMARY_COLOR }} />,
            tag: "Trending",
            img: "https://images.unsplash.com/photo-1584466977773-e625c37cdd50",
            navigateTo: "/services_request/health",
        },
        {
            title: "Job Placement Support",
            description:
                "Access to exclusive job opportunities and career guidance to kickstart your professional journey.",
            icon: <Briefcase size={28} style={{ color: PRIMARY_COLOR }} />,
            tag: "Popular",
            img: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
            navigateTo: "/career/1",
        },
        {
            title: "E-SIM Cards",
            description:
                "Get instant connectivity with international E-SIM cards for seamless communication during your study abroad journey.",
            icon: <Wifi size={28} style={{ color: PRIMARY_COLOR }} />,
            tag: "New",
            img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
            navigateTo: "/services_request/data",
        },
    ];




    return (
          <motion.div 
            className="w-full min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        >
            {/* Hero Banner Section */}
            <div className="relative w-full overflow-hidden mb-8 md:mb-12">
                {/* Background Image with Gradient Overlay */}
                <div 
                    className="relative w-full h-[100px] sm:h-[110px] md:h-[130px] lg:h-[150px] xl:h-[170px] bg-cover bg-center bg-no-repeat transition-all duration-500"
                    style={{
                        backgroundImage: `linear-gradient(135deg, ${PRIMARY_COLOR}dd 0%, ${PRIMARY_COLOR_800}dd 50%, ${PRIMARY_COLOR_900}dd 100%), url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&w=1500&q=80')`,
                        backgroundBlendMode: 'overlay',
                        backgroundColor: PRIMARY_COLOR
                    }}
                >
                    {/* Animated Gradient Overlay */}
                    <div 
                        className="absolute inset-0 opacity-90 transition-opacity duration-300"
                        style={{
                            background: `linear-gradient(135deg, ${PRIMARY_COLOR}cc 0%, ${PRIMARY_COLOR_800}cc 50%, ${PRIMARY_COLOR_900}cc 100%)`
                        }}
                    />
                    
                    {/* Content Overlay */}
                    <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
                        <div className="max-w-4xl w-full text-center">
                            {/* Icon Badge */}
                            <div className="flex justify-center mb-1">
                                <div 
                                    className="p-1 sm:p-1.5 rounded-md backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110"
                                    style={{ 
                                        backgroundColor: `${PRIMARY_COLOR_50}40`,
                                        border: `1.5px solid ${PRIMARY_COLOR_200}`
                                    }}
                                >
                                    <GraduationCap size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 hover:rotate-6" style={{ color: '#ffffff' }} />
                                </div>
                            </div>
                            
                            {/* Title */}
                            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-0.5 sm:mb-1 drop-shadow-2xl leading-tight">
                                Your Complete Student Visa & Study Abroad Platform
                            </h1>
                            
                            {/* Subtitle */}
                            <p className="text-xs sm:text-sm md:text-base text-white/90 mb-1 max-w-2xl mx-auto drop-shadow-lg">
                                All essential services designed to make your international academic journey smooth, successful and stress-free.
                            </p>
                            
                            {/* Tag Badge */}
                            <div className="flex justify-center mt-2">
                                <div 
                                    className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md shadow-lg"
                                    style={{ 
                                        backgroundColor: `${PRIMARY_COLOR_50}30`,
                                        border: `1px solid ${PRIMARY_COLOR_200}80`
                                    }}
                                >
                                    <span className="text-white font-semibold text-xs sm:text-sm">
                                        Study Abroad Services
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Bottom Wave */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg 
                            className="w-full h-3 sm:h-4 md:h-5 lg:h-6" 
                            viewBox="0 0 1440 120" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                        >
                            <path 
                                d="M0,120 L48,105 C96,90 192,60 288,45 C384,30 480,30 576,37.5 C672,45 768,60 864,67.5 C960,75 1056,75 1152,67.5 C1248,60 1344,45 1392,37.5 L1440,30 L1440,120 L1392,120 C1344,120 1248,120 1152,120 C1056,120 960,120 864,120 C768,120 672,120 576,120 C480,120 384,120 288,120 C192,120 96,120 48,120 L0,120 Z" 
                                fill="white" 
                                className="dark:fill-gray-900"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-10 lg:p-14">

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
                                    <div className="absolute top-4 right-4 text-white text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: PRIMARY_COLOR }}>
                                        {service.tag}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: PRIMARY_COLOR_50 }}>
                                            <div style={{ color: PRIMARY_COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {service.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors group-hover:opacity-80" style={{ color: 'inherit' }}>
                                            {service.title}
                                        </h3>
                                    </div>
                                    
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1">
                                        {service.description}
                                    </p>

                                    <Button
                                        // variant="ghost"
                                        className="w-fit"
                                        style={{ color: PRIMARY_COLOR,backgroundColor: PRIMARY_COLOR_50 }}
                                        // color="primary"
                                        // endContent={<ArrowRight size={16} className="ml-1" style={{ color: PRIMARY_COLOR }} />}
                                        onPress={() => navigate(service.navigateTo)}
                                    >
                                        Learn More <ArrowRight size={16} className="ml-1" style={{ color: PRIMARY_COLOR }} />
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
                        variant="flat"
                        className="font-medium px-9 py-2 text-white"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                        onPress={() => navigate("/contact")}
                    >
                        Contact Us
                    </Button>
                </motion.div>
            </motion.section>
            </div>
        </motion.div>
    )

}

export default PrivateIntroPage
import { Accordion, AccordionItem, Button, useDisclosure } from '@nextui-org/react'
import React from 'react'
import { BiBadge } from 'react-icons/bi'
import { FaPassport, FaPlayCircle, FaUniversity, FaUserGraduate } from 'react-icons/fa'
import { Briefcase, Shield, Home, Globe, BookOpen, HelpCircle, LogInIcon, MapPin } from "lucide-react";

import FaqSection from '../../components/FaqSection';
import Testimonials from '../../components/Testimonials';
import { Md12Mp } from 'react-icons/md';
import ContentWritingList from '../../components/ContentWritingList';
import { useNavigate } from 'react-router-dom';
import HomePageFlags from '../../components/HomePageFlags';
import CommonConfirmation from '../../components/CommonConfirmation';
import { Carousel } from 'rsuite';
import { motion } from 'framer-motion'
import PublicEventBanners from '../EventBanners/PublicEventBanners';
import { Layout, Target, Users, Languages, FileText, Heart, Stamp, Activity, Headphones } from "lucide-react";
import { getAppName } from '@/utils/config';


const IntroPage = () => {

    // for login 
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const navigate = useNavigate()


    const features = [
        {
            icon: <FaUniversity className="text-2xl" />,
            title: "University Admission",
            desc: "Direct admission to top universities worldwide"
        },
        {
            icon: <FaPassport className="text-2xl" />,
            title: "Visa Success",
            desc: "95% visa success rate with expert guidance"
        },
        {
            icon: <FaUserGraduate className="text-2xl" />,
            title: "Career Support",
            desc: "Complete support from admission to placement"
        }
    ];

    const blobVariants = {
        blob1: {
            initial: { x: 0, y: 0, scale: 1 },
            animate: {
                x: [0, 100, -100, 0],
                y: [0, -100, 100, 0],
                scale: [1, 1.2, 0.8, 1],
                transition: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }
        },
        blob2: {
            initial: { x: 0, y: 0, scale: 1 },
            animate: {
                x: [0, -150, 150, 0],
                y: [0, 100, -100, 0],
                scale: [1, 1.3, 0.9, 1],
                transition: {
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }
        },
        blob3: {
            initial: { x: 0, y: 0, scale: 1 },
            animate: {
                x: [0, 150, -150, 0],
                y: [0, 150, -150, 0],
                scale: [1, 1.1, 0.9, 1],
                transition: {
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }
        },

    };


    return (
        <section className='text-dark_primary dark:text-white'>

            <div className="relative overflow-hidden bg-gradient-to-b from-gray-200/20 to-gray-100/20  flex items-center justify-center">
                {/* Animated Background Blobs */}
                <div className="absolute inset-0">
                    <motion.div
                        variants={blobVariants.blob1}
                        initial="initial"
                        animate="animate"
                        className="absolute top-0 -left-4 w-72 h-72 bg-yellow-50 rounded-full 
                        filter blur-xl opacity-50"
                    />
                    <motion.div
                        variants={blobVariants.blob2}
                        initial="initial"
                        animate="animate"
                        className="absolute top-0 -right-4 w-72 h-72 bg-yellow-50 rounded-full 
                        filter blur-xl opacity-50"
                    />
                    <motion.div
                        variants={blobVariants.blob3}
                        initial="initial"
                        animate="animate"
                        className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-50 rounded-full 
                        filter blur-xl opacity-50"
                    />

                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto mx-6 px-4 pt-20 pb-16 flex flex-col items-center">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-8 text-start"
                        >
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sidebar-primary to-primary px-4 py-2 rounded-full">
                                <span className="animate-pulse h-2 w-2 rounded-full bg-yellow-600"></span>
                                <span className="font-bold text-white">Trusted by 10,000+ Students</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold  leading-tight">
                                Your Dreams of
                                <span className="bg-primary bg-clip-text text-transparent"> Studying Abroad </span>
                                Begin Here
                            </h1>

                            {/* <p className="text-xl text-sidebar-primary">
                                Get personalized guidance for admissions, scholarships, and visa processing at top universities worldwide.
                            </p> */}

                            <div className="flex flex-wrap gap-4 justify-start">
                                <Button
                                    size="lg"
                                    color="primary"
                                    variant="shadow"
                                    className="text-lg px-8"
                                    onPress={() => navigate('/signup')}
                                    endContent={<LogInIcon />}
                                >
                                    Create Free Account
                                </Button>
                                <Button
                                    size="lg"
                                    variant="bordered"
                                    className="text-gray-800 border-sidebar-primary text-lg px-8 hover:no-underline hover:text-gray-500"
                                    as={"a"}
                                    href='#services'
                                >
                                    Explore More
                                </Button>
                            </div>
                        </motion.div>


                        <div className="grid md:grid-cols-3 gap-4 pt-8">
                            {features?.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-gray/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200"
                                >
                                    <div className="text-primary mb-2">{feature.icon}</div>
                                    <h3 className="font-semibold text-sidebar-primary">{feature.title}</h3>
                                    <p className="text-sm text-gray-500">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div> 
            </div>

            {/* <PublicEventBanners /> */}

            {/* services */}

            <section className='container mx-auto my-36' id='services' >
                <h1 className='text-3xl text-center my-5'>Everything you need for academics in one place</h1> 

                <p className='text-center'>Content Writing</p>
                <ContentWritingList onOpenChange={onOpenChange} />

                <section className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 p-4">
                    {[
                        // {
                        //     title: "Visa Consultation",
                        //     description:
                        //         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint, soluta!",
                        //     icon: <HelpCircle className="text-orange-500" size={40} />,
                        //     navigateTo: "/services/visa_consultation",
                        // },
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
                        {
                            title: "Visa & Course Consultation",
                            description:
                                "Expert guidance on visa processes and course selection to help you make informed decisions for your academic journey.",
                            icon: <MapPin className="text-orange-500" size={40} />,
                            navigateTo: "/services/visa_consultation",
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

            {/* flags */}
            {/* <HomePageFlags /> */}

            {/* why choose Techxuniverse */}

           <div className="container p-10  mx-auto">
                <div className="grid  gap-12">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4"> Why Choose {getAppName()}?</h2>
                        <p className="text-gray-600 max-w-2xl text-xl mx-auto text-justify">
                            {getAppName()} is a comprehensive platform designed to simplify the journey of studying and working abroad. Whether
                            you're a student exploring course options or a professional looking to advance your career in a foreign country,
                            Techxuniverse has everything you need in one place. With trusted consultants, language preparation, and visa
                            assistance, we ensure a seamless transition to your dream destination.
                        </p>
                    </div>


                    <div className="space-y-6 lg:space-y-10">

                        <section className="container mx-auto sm:px-4 py-16">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold mb-4">Key Features</h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Everything you need for your international education journey in one place
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    {
                                        icon: <Layout className="h-8 w-8 text-primary" />,
                                        title: "All-in-One Solution",
                                        description: "Simplify your global education journey with everything you need from finding courses to securing accommodation and insurance all in one platform."
                                    },
                                    {
                                        icon: <Target className="h-8 w-8 text-primary" />,
                                        title: "Personalized Recommendations",
                                        description: "Explore course options and job roles tailored to your background and preferences in top international destinations."
                                    },
                                    {
                                        icon: <Users className="h-8 w-8 text-primary" />,
                                        title: "Consultant Marketplace",
                                        description: "Connect with multiple certified agents who offer personalized guidance on course selection, visa applications, and career opportunities."
                                    },
                                    {
                                        icon: <Languages className="h-8 w-8 text-primary" />,
                                        title: "Language Preparation",
                                        description: "Prepare for language tests like IELTS and TOEFL with expert resources to help you meet entry requirements."
                                    },
                                    {
                                        icon: <FileText className="h-8 w-8 text-primary" />,
                                        title: "Document Assistance",
                                        description: "Expert assistance with SOPs, cover letters, and other application materials to ensure your application stands out."
                                    },
                                    {
                                        icon: <Heart className="h-8 w-8 text-primary" />,
                                        title: "Health Insurance Comparison",
                                        description: "Filter through various health insurance providers by price and coverage for your stay abroad."
                                    },
                                    {
                                        icon: <Home className="h-8 w-8 text-primary" />,
                                        title: "Accommodation Finder",
                                        description: "Browse student-friendly accommodation options for a safe and comfortable stay during your studies."
                                    },
                                    {
                                        icon: <Stamp className="h-8 w-8 text-primary" />,
                                        title: "Visa Process Assistance",
                                        description: "Let our network of visa agents guide you through the visa application process seamlessly."
                                    },
                                    {
                                        icon: <Activity className="h-8 w-8 text-primary" />,
                                        title: "Real-Time Application Tracking",
                                        description: "Monitor your course and visa applications progress through real-time tracking."
                                    },
                                    {
                                        icon: <Headphones className="h-8 w-8 text-primary" />,
                                        title: "Ongoing Support",
                                        description: "Our dedicated support team is available to assist you with any queries throughout your journey."
                                    }
                                ].map((feature, index) => (
                                    <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>
            </div> 

            {/* <Testimonials /> */}

            {/* <FaqSection /> */}


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

        </section>
    )

}

export default IntroPage
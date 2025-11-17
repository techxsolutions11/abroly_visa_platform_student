import { Button, useDisclosure } from '@nextui-org/react'
import React from 'react'
import { Briefcase, Shield, Home, Globe, BookOpen, MapPin } from "lucide-react"
import ContentWritingList from '../../../components/ContentWritingList'
import { useNavigate } from 'react-router-dom'

interface ServicesSectionProps {
    onOpenChange: (isOpen: boolean) => void
}

const ServicesSection = ({ onOpenChange }: ServicesSectionProps) => {
    const navigate = useNavigate()

    return (
        <section className='container mx-auto my-20' id='services'>
            <h1 className='text-3xl text-center my-5'>Everything you need for academics in one place</h1>

            <p className='text-center mb-8'>Content Writing</p>
            <ContentWritingList onOpenChange={onOpenChange} />

            <section className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 p-4 mt-8">
                {[
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
    )
}

export default ServicesSection


import { useDisclosure } from '@nextui-org/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import CommonConfirmation from '../../components/CommonConfirmation'

// Import all section components
import HeroSection from './sections/HeroSection'
import WhyChooseUsSection from './sections/WhyChooseUsSection'
import ServicesSection from './sections/ServicesSection'
import CountrySection from './sections/CountrySection'
import TestimonialsSection from './sections/TestimonialsSection'
import CTASection from './sections/CTASection'
import LeadFormSection from './sections/LeadFormSection'


const IntroPage = () => {
    // for login 
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate()

    return (
        <section className='text-dark_primary dark:text-white'>
            {/* Header & Hero Section */}
            <HeroSection />

            {/* Why Choose Us Section */}
            <WhyChooseUsSection />

            {/* Services and Coaching Section */}
            <ServicesSection onOpenChange={onOpenChange} />

            {/* Country Section */}
            <CountrySection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* CTA Section */}
            <CTASection />

            {/* Lead Form Section */}
            <LeadFormSection />


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
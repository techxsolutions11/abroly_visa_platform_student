import React from 'react'
import { Layout, Target, Users, Languages, FileText, Heart, Stamp, Activity, Headphones, Home } from "lucide-react"
import { getAppName } from '@/utils/config'

const WhyChooseUsSection = () => {
    return (
        <div className="container p-10 mx-auto my-20">
            <div className="grid gap-12">
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
    )
}

export default WhyChooseUsSection


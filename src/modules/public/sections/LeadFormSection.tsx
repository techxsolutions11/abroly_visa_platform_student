import { Button, Input, Textarea } from '@nextui-org/react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Phone } from 'lucide-react'
import { getAgentId, getAgencyAddress, getSupportEmail, getSupportNumber } from '@/utils/config'
import useApiCallUtils from '@/hooks/useApiCallUtils'
import { ErrorToast, SuccessToast } from '@/utils/Toaster'

const LeadFormSection = () => {
    const { commonPostPublicAPICall } = useApiCallUtils()
    const agentId = getAgentId()
    const [isSubmitting, setIsSubmitting] = useState(false)

    return (
        <section className='container mx-auto my-20' id='lead-form'>
            <div className="max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mb-10 lg:mb-14 mx-auto text-center"
                >
                    <h2 className="font-semibold text-2xl md:text-4xl md:leading-tight mb-4">Get in Touch</h2>
                    <p className="text-gray-600">Have questions? We're here to help. Fill out the form below and we'll get back to you within 2 business days.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16"
                >
                    <div className="md:order-2 border-b border-neutral-800 pb-10 mb-10 md:border-b-0 md:pb-0 md:mb-0">
                        <form
                            onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                                e.preventDefault()
                                setIsSubmitting(true)

                                const formData = new FormData(e.target as HTMLFormElement)
                                const name = formData.get('name') as string
                                const number = formData.get('number') as string
                                const email = formData.get('email') as string
                                const message = formData.get('message') as string

                                // Validation
                                if (!name?.trim()) {
                                    ErrorToast("Please Provide Name")
                                    setIsSubmitting(false)
                                    return
                                }
                                if (!number?.trim()) {
                                    ErrorToast("Please Provide Number")
                                    setIsSubmitting(false)
                                    return
                                }
                                if (!email?.trim()) {
                                    ErrorToast("Please Provide Email")
                                    setIsSubmitting(false)
                                    return
                                }
                                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                                    ErrorToast("Please Provide Valid Email")
                                    setIsSubmitting(false)
                                    return
                                }
                                if (!message?.trim()) {
                                    ErrorToast("Please Provide Message")
                                    setIsSubmitting(false)
                                    return
                                }

                                const data = {
                                    name: name.trim(),
                                    number: number.trim(),
                                    email: email.trim(),
                                    message: message.trim(),
                                    agent_id: agentId
                                }

                                const { success } = await commonPostPublicAPICall(
                                    data,
                                    "contact_us/add",
                                    true
                                )

                                setIsSubmitting(false)

                                if (success) {
                                    SuccessToast("Thank You! We'll get back to you soon.")
                                    ;(e.target as HTMLFormElement).reset()
                                }
                            }}
                            className='flex flex-col gap-4'
                        >
                            <Input
                                variant='bordered'
                                label="Your Name"
                                name='name'
                                isRequired
                            />
                            <Input
                                variant='bordered'
                                label="Your Email"
                                name='email'
                                type='email'
                                isRequired
                            />
                            <Input
                                variant='bordered'
                                label="Your Phone Number"
                                name='number'
                                isRequired
                            />
                            <Textarea
                                variant='bordered'
                                label="Your Message"
                                name='message'
                                rows={4}
                                isRequired
                            />
                            <Button
                                variant='shadow'
                                color='primary'
                                type='submit'
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                                size="lg"
                            >
                                Submit
                            </Button>
                        </form>
                    </div>

                    <div className="flex flex-col items-start gap-6">
                        <div className="flex flex-row items-center gap-4">
                            <MapPin className="text-primary shrink-0 size-12" />
                            <div className='flex flex-col items-start'>
                                <h4 className="font-semibold text-lg">Our Address</h4>
                                <address className="text-sm not-italic text-gray-600">
                                    {getAgencyAddress() || "Ahmedabad, Gujarat"}
                                </address>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-4">
                            <Mail className="text-primary shrink-0 size-12" />
                            <div className='flex flex-col items-start'>
                                <h4 className="font-semibold text-lg">Email Us</h4>
                                <a
                                    className="text-sm text-gray-600 hover:text-primary focus:outline-none focus:text-primary transition-colors"
                                    href={`mailto:${getSupportEmail() || 'contact@techxuniverse.com'}`}
                                >
                                    {getSupportEmail() || 'contact@techxuniverse.com'}
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-4">
                            <Phone className="text-primary shrink-0 size-12" />
                            <div className='flex flex-col items-start'>
                                <h4 className="font-semibold text-lg">Call Us</h4>
                                <a
                                    className="text-sm text-gray-600 hover:text-primary focus:outline-none focus:text-primary transition-colors"
                                    href={`tel:${getSupportNumber() || ''}`}
                                >
                                    {getSupportNumber() || 'Contact us for support'}
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default LeadFormSection


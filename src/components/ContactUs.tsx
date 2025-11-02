import { Button, Input, Textarea } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin } from 'lucide-react'
import useApiCallUtils from '@/hooks/useApiCallUtils'
import { ErrorToast, SuccessToast } from '@/utils/Toaster'
import { getAgentId, getAgencyAddress, getSupportEmail } from '@/utils/config'

const ContactUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { commonPostPublicAPICall } = useApiCallUtils()
    const agentId = getAgentId()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            SuccessToast("Thank You!")
            ;(e.target as HTMLFormElement).reset()
        }
    }
    return (
        <div className="py-10">
            <div className="max-w-5xl px-4 xl:px-0  mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mb-10 lg:mb-14">
                    <h2 className="font-semibold text-2xl md:text-4xl md:leading-tight">Contact us</h2>
                    <p className="mt-1">Whatever your query, will get back to you within 2 business days</p>
                </motion.div>

                <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16">
                    <div className="md:order-2 border-b border-neutral-800 pb-10 mb-10 md:border-b-0 md:pb-0 md:mb-0">
                        <form 
                        onSubmit={handleSubmit}
                        className='flex flex-col gap-2'>

                            <Input
                                variant='bordered'
                                label="Your Name"
                                name='name'
                            />
                            <Input
                                variant='bordered'
                                label="Your Email"
                                name='email'
                                type='email'
                            />
                            <Input
                                variant='bordered'
                                label="Your Phone Number"
                                name='number'
                            />
                            <Textarea
                                variant='bordered'
                                label="Your Message"
                                name='message'
                                rows={4}
                            />
                            <Button
                                variant='shadow'
                                color='primary'
                                type='submit'
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                            >Submit</Button>

                        </form>
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <div className="flex flex-row items-center gap-4">
                            <MapPin className="text-primary shrink-0 size-12" />
                            <div className='flex flex-col items-start'>
                                <h4 className="font-semibold">Our address:</h4>
                                <address className="text-sm not-italic">
                                    {getAgencyAddress() || "Ahmedabad, Gujarat"}
                                </address>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-4">
                            <Mail className="text-primary shrink-0 size-12" />
                            <div className='flex flex-col items-start'>
                                <h4 className="font-semibold">Email us:</h4>
                                <a 
                                    className="text-sm hover:text-primary focus:outline-none focus:text-primary" 
                                    href={`mailto:${getSupportEmail() || 'contact@abroly.com'}`}
                                >
                                    {getSupportEmail() || 'contact@abroly.com'}
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default ContactUs
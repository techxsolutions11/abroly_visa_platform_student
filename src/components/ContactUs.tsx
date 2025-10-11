import { Button, Input, Textarea } from '@nextui-org/react'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin } from 'lucide-react'
const ContactUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
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
                        <form className='flex flex-col gap-2'>

                            <Input
                                variant='bordered'
                                label="Your Name"
                            />
                            <Input
                                variant='bordered'
                                label="Your Email"
                            />
                            <Input
                                variant='bordered'
                                label="Your Phone Number"
                            />
                            <Textarea
                                variant='bordered'
                                label="Your Message"
                            />
                            <Button
                                variant='shadow'
                                color='primary'
                            >Submit</Button>

                        </form>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            {/* <svg className="shrink-0 size-6 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg> */}
                            <MapPin className="shrink-0 size-6 text-primary" />
                            <div>
                                <h4 className=" font-semibold">Our address:</h4>
                                <address className="mt-1  text-sm not-italic">
                                    Ahmedabad <br />
                                    Gujarat <br />
                                </address>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {/* <svg className="shrink-0 size-6 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" /><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" /></svg> */}
                            <Mail className="size-6 text-primary" />
                            <div className="">
                                <h4 className=" font-semibold">Email us:</h4>
                                <a className="mt-1  text-sm hover:text-neutral-200 focus:outline-none focus:text-neutral-200" href="#mailto:example@site.co" target="_blank">
                                    contact@abroly.com
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
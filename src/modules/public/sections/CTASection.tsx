import { Button } from '@nextui-org/react'
import React from 'react'
import { LogInIcon } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAppName } from '@/utils/config'

const CTASection = () => {
    const navigate = useNavigate()

    return (
        <section className='bg-gradient-to-r from-primary to-sidebar-primary py-16 my-20'>
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join thousands of students who have successfully achieved their dreams of studying abroad with {getAppName()}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button
                            size="lg"
                            color="default"
                            variant="solid"
                            className="text-lg px-8 bg-white text-primary hover:bg-gray-100"
                            onPress={() => navigate('/signup')}
                            endContent={<LogInIcon />}
                        >
                            Get Started Free
                        </Button>
                        <Button
                            size="lg"
                            variant="bordered"
                            className="text-lg px-8 border-white text-white hover:bg-white/10"
                            onPress={() => navigate('/login')}
                        >
                            Already Have Account?
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default CTASection


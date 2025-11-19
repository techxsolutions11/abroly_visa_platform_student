import useApiCallUtils from '@/hooks/useApiCallUtils';
import { Accordion, AccordionItem, Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  MessageCircle, 
  Search,
  ChevronRight,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FaqSection = () => {

    const { commonPublicGetApiCalls } = useApiCallUtils()

    const [faqs, setFaqs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getFaqApiCall();
    }, []);

    const navigate = useNavigate()

    const getFaqApiCall = async () => {
        const { data, success } = await commonPublicGetApiCalls("/faq/list");
        if (success && success == true) {
            setFaqs(data);
        }
    };

    const filteredFaqs = faqs.filter((faq: any) => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="py-16">
            <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex justify-center mb-4">
                        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium">
                            <HelpCircle size={16} />
                            Support Center
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        How can we help you?
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Search for your questions here
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-2xl mx-auto mb-12"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </motion.div>

                {/* FAQ Grid */}
                <div className="grid  gap-8 items-start">
                    {/* Right Column - FAQs */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-8 lg:col-span-9"
                    >
                        <Accordion 
                            variant="bordered"
                            className="bg-white rounded-xl shadow-sm"
                        >
                            {filteredFaqs.map((item: any, index: number) => (
                                <AccordionItem 
                                    key={index} 
                                    aria-label={item?.question}
                                    title={
                                        <span className="font-medium text-slate-800">
                                            {item?.question}
                                        </span>
                                    }
                                >
                                    <div className="px-2 pb-4">
                                        <p className="text-slate-600 leading-relaxed">
                                            {item?.answer}
                                        </p>
                                    </div>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                </div>

                {/* Contact Support Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 bg-blue-50 rounded-2xl p-8 text-center"
                >
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">
                        Still have questions?
                    </h3>
                    <p className="text-slate-600 mb-6">
                        Can't find the answer you're looking for? Please chat with our friendly team.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            color="primary"
                            startContent={<MessageCircle size={18} />}
                            onClick={()=>{
                                navigate("/contact_us")
                            }}
                        >
                            Contact Us
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FaqSection;
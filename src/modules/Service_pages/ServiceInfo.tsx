import { Button, Image, Input, Radio, RadioGroup, Select, SelectItem, Spinner, Textarea, useDisclosure } from '@nextui-org/react';
import axios from 'axios';
import { ArrowLeft, Edit, FileText, ImageIcon, Plus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom'
import 'react-quill/dist/quill.bubble.css';
import * as Yup from 'yup'
import { SuccessToast } from '@/utils/Toaster';
import { Form, Formik } from 'formik';
import { TbReceiptRupee } from 'react-icons/tb';
import HealthInsurance from '../HealthInsurance/HealthInsurance';
import SimCardListing from '../SimcardListing/SimCardListing';
import LanguagePrep from '../LanguagePrep/LanguagePrep';
import { getAuthToken } from '@/utils/localstorage';
import CommonConfirmation from '@/components/CommonConfirmation';
import AchievementBanner from '../AchievementBanner/AchievementBanner';
import Career from '../Career/Career';
import VisaConsultation from '../VisaConsultation/VisaConsultation';
import Accommodation from '../Accommodation/Accommodation';
import useApiCallUtils from '@/hooks/useApiCallUtils';


const ServiceInfo = () => {

    const { commonPostAPICall, commonPostPublicAPICall } = useApiCallUtils()

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { service } = useParams()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [service])

    const contentWritingServices = [
        "sop", "motivation", "cover"
    ]

    const [blocks, setBlocks] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        listBlocks()
    }, [service])

    // list
    const listBlocks = async () => {
        setIsLoading(true)
        const { success, data } = await commonPostPublicAPICall({ content_of: service }, "service_info/list")
        if (success && success == true) {
            setBlocks(data)
        }
        setIsLoading(false)
    }

    const navigate = useNavigate()

    // for content writing
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

    return (
        <div className='container mx-auto'>
            <Button
                variant='light'
                onPress={() => {
                    navigate(-1)
                }}
                isIconOnly
            ><ArrowLeft className='h-4' /> </Button>


            {!getAuthToken() &&
                <div>
                    <div className="">
                        {isLoading == true && <section className='flex items-center justify-center'>
                            <Spinner /></section>}
                        {blocks
                            .sort((a, b) => a.order - b.order) // Sort blocks by order
                            .map((block) => (
                                <div
                                    key={block.uuid}
                                    className="px-4 rounded-lg flex items-start gap-4"
                                >

                                    <div className="flex-1">

                                        {/* Conditional Rendering for Text or Image */}
                                        {block?.section_type === "text" && (
                                            <div>
                                                <ReactQuill
                                                    theme="bubble"
                                                    value={block?.description}
                                                    readOnly
                                                />
                                            </div>
                                        )}

                                        {block.section_type === "image" && (
                                            <div>
                                                {block?.access_file ? (
                                                    <Image
                                                        src={block?.access_file}
                                                        alt="Block Image"
                                                        className='w-full md:w-2/3 mx-auto'
                                                    />
                                                ) : (
                                                    <p className="text-gray-500 italic">No image available</p>
                                                )}
                                            </div>
                                        )}
                                    </div>


                                </div>
                            ))}
                    </div>

                </div>
            }



            {contentWritingServices.includes(service) && getAuthToken() &&
                <section className='grid grid-cols-12'>
                    <section className='container max-w-3xl my-24 space-y-2 flex flex-col items-center mx-auto col-span-10' id='form_of_contact'>
                        <h1 className='text-center text-3xl my-5'>Contact us for more details</h1>
                        <Formik
                            initialValues={{
                                name: '',
                                number: '',
                                email: '',
                                content_requirement: formOptions.content_requirement,
                                message: '',
                            }}

                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                // console.log(values); // Submit logic here
                                handleSubmitContentWriting(values)
                            }}

                        >
                            {({ values, handleChange, handleSubmit, errors, touched }) => (
                                <Form onSubmit={handleSubmit}
                                    className=' w-full flex flex-col gap-2 items-center'
                                >

                                    <Input name="name" label="Name"
                                        isInvalid={errors.name && touched.name}
                                        errorMessage={errors.name && touched.name && errors.name}
                                        onChange={handleChange("name")}
                                        value={values.name}
                                    />
                                    {/* <ErrorMessage name="name" component="div" className="error" /> */}



                                    <Input name="number" label="Number"
                                        isInvalid={errors.number && touched.number}
                                        errorMessage={errors.number && touched.number && errors.number}
                                        onChange={handleChange("number")}
                                        value={values.number}
                                    />
                                    {/* <ErrorMessage name="number" component="div" className="error" /> */}



                                    <Input name="email" label="Email"
                                        isInvalid={errors.email && touched.email}
                                        errorMessage={errors.email && touched.email && errors.email}
                                        onChange={handleChange("email")}
                                        value={values.email}
                                    />
                                    {/* <ErrorMessage name="email" component="div" className="error" /> */}
                                    {/* <ErrorMessage name="content_requirement" component="div" className="error" /> */}
                                    <Select
                                        label="Content Requirement"
                                        name='content_requirement'
                                        placeholder="Select an Option"
                                        isInvalid={errors.content_requirement && touched.content_requirement}
                                        errorMessage={errors.content_requirement && touched.content_requirement && errors.content_requirement}
                                        onChange={handleChange("content_requirement")}
                                        value={values.content_requirement}
                                    >
                                        {["sop", "motivation_letter", "cover_letter"].map((item) => (
                                            <SelectItem key={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <Textarea
                                        name="message"
                                        label="Message"
                                        isInvalid={errors.message && touched.message}
                                        errorMessage={errors.message && touched.message && errors.message}
                                        onChange={handleChange("message")}
                                        value={values.message}

                                    />
                                    {/* <ErrorMessage name="message" component="div" className="error" /> */}
                                    <Button isLoading={isSubmit} type="submit" variant='flat' color='primary'>
                                        <TbReceiptRupee /> Pay Now And Submit
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </section>
                    <section className='col-span-2 h-full items-center'>
                        <AchievementBanner target_type={service} />
                    </section>
                </section>

            }
            {!contentWritingServices.includes(service) &&
                <section className='grid grid-cols-12'>
                    <section className='container mx-auto col-span-10'>
                        {/* display here halth insurenace and in simcard details */}
                        {
                            service == "health_ins" && <HealthInsurance />
                        }
                        {
                            service == "sim_card" && <SimCardListing />
                        }
                        {
                            service == "language" && getAuthToken() && <LanguagePrep />
                        }
                    </section>
                    <section className='col-span-2 h-full items-center'>
                        <AchievementBanner target_type={service} />
                    </section>
                </section>
            }
            {!contentWritingServices.includes(service) && service == "career" &&
                <section className='grid grid-cols-12'>
                    <section className='container mx-auto col-span-10'>
                        {
                            service == "career" && getAuthToken() && <Career />
                        }
                    </section>
                    <section className='col-span-2 h-full items-center'>
                        <AchievementBanner target_type={service} />
                    </section>
                </section>
            }
            {!contentWritingServices.includes(service) && service == "accommodation" &&
                <section className='grid grid-cols-12'>
                    <section className='container mx-auto col-span-10'>
                        {
                            service == "accommodation" && getAuthToken() && <Accommodation />
                        }
                    </section>
                    <section className='col-span-2 h-full items-center'>
                        <AchievementBanner target_type={service} />
                    </section>
                </section>
            }
            {!contentWritingServices.includes(service) && service == "visa_consultation" &&
                <section className='grid grid-cols-12'>
                    <section className='container mx-auto col-span-10'>
                        {
                            service == "visa_consultation" && getAuthToken() && <VisaConsultation />
                        }
                    </section>
                    <section className='col-span-2 h-full items-center'>
                        <AchievementBanner target_type={service} />
                    </section>
                    
                </section>
            }

            {getAuthToken() == null && <section className='flex my-4 items-center justify-center'><Button
                onPress={onOpenChange}
            >Explore More</Button></section>}


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
        </div>
    )
}

export default ServiceInfo
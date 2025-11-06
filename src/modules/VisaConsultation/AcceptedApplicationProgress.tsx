import CommonConfirmation from "@/components/CommonConfirmation";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import fetchQueriesHook from "@/hooks/fetchQueriesHook";
import useApiCallUtils from "@/hooks/useApiCallUtils";
import { ErrorToast, SuccessToast } from "@/utils/Toaster";
import { Avatar, Button, Card, CardBody, CardFooter, Input, Radio, RadioGroup, Spinner, Tab, Tabs } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FileSaver from "file-saver";
import { ArrowDownToLine, CircleCheck, Phone, User } from 'lucide-react';
import moment from "moment";
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Steps } from "rsuite";

const AcceptedApplicationProgress = () => {
    const { id } = useParams()
    const { commonGetAPICalls, commonPostAPICallWithFile } = useApiCallUtils()

    const [searchParams, setSearchParams] = useSearchParams();
    const queryStep = parseInt(searchParams.get("step")) || 0;

    const [step, setStep] = useState(queryStep);

    useEffect(() => {
        setStep(queryStep);
    }, [queryStep]);


    const onChange = (nextStep) => {
        const maxSteps = tabs?.steps?.length ? tabs?.steps?.length - 1 : 3;
        const newStep = nextStep < 0 ? 0 : nextStep > maxSteps ? maxSteps : nextStep;
        setStep(newStep);
        setSearchParams({ step: newStep });
    };

    const fetchQueryClient = fetchQueriesHook()

    const queryClient = useQueryClient();

    const StepDetails = ({ step_id, description }) => {

        // Function to fetch questions for the given step
        const fetchQuestions = async () => {
            const { success, data, message } = await commonGetAPICalls(
                `/leads/lead_progress/student/get_questions/${step_id}`
            );
            if (success && success === true) {
                return data;
            }
            throw new Error(message);
        };

        const { data, isFetching, isError, error } = useQuery({
            queryKey: ['questions', step_id],
            queryFn: fetchQuestions,
        });

        // submit answer 
        const submitAnswerAPI = async ({ questionId, answer, file }) => {
            // For file uploads, you might need to use FormData.
            const formData = new FormData();
            formData.append('questionId', questionId);
            if (file) {
                formData.append('file', file);
            } else {
                formData.append('answer', answer);
            }
            const response = await commonPostAPICallWithFile(formData, `/leads/lead_progress/student/submit_answer`);
            if (response.success) {
                return response;
            }
            throw new Error(response.message);
        };

        // useMutation hook to submit an answer for a specific question
        const mutation = useMutation({
            mutationFn: submitAnswerAPI,
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.invalidateQueries({ queryKey: ['questions', step_id] });
            },
        });

        // Local state to keep track of individual answers
        const [answers, setAnswers] = useState({});

        // Handle input changes for text-based answers
        const handleTextChange = (questionId, value) => {
            setAnswers(prev => ({
                ...prev,
                [questionId]: { ...prev[questionId], answer: value },
            }));
        };

        // Handle file changes for file_selector questions
        const handleFileChange = (questionId, file) => {
            setAnswers(prev => ({
                ...prev,
                [questionId]: { ...prev[questionId], file },
            }));
        };

        // Submit answer for a specific question using mutation
        const handleSubmitAnswer = (questionId) => {
            const answerData = answers[questionId] || {};
            mutation.mutate({
                questionId,
                answer: answerData.answer,
                file: answerData.file,
            });
        };

        return (
            <Card>
                <CardBody className="w-full">
                    <div className="flex justify-between items-center gap-4 mb-4">
                        <div>
                            <h1 className="text-lg font-semibold">{data?.step?.step_title || ""}</h1>
                            <p>{description || ""}</p>
                        </div>
                    </div>

                    {isError ? (
                        <p className="text-red-500">{error?.message}</p>
                    ) : isFetching ? (
                        <div className="flex items-center justify-center w-full h-20">
                            <Spinner />
                        </div>
                    ) : data?.questions?.length === 0 ? (
                        <div className="flex w-full flex-col items-center p-4 bg-gray-100 rounded-lg">
                            <p className="text-gray-600">No Questions Created Yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {data?.questions?.map((question) => (
                                <div key={question?.id} className="bg-white p-4 rounded-lg shadow-md border space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar showFallback src={question?.created_by?.profile_image} size="sm" className="w-8 h-8" />
                                        <p>{question?.created_by?.username || "Unknown"}</p>
                                    </div>

                                    <h2 className="text-base font-medium text-gray-800">
                                        {question?.question_text || ""}
                                    </h2>

                                    {/* For pending questions, provide an individual answer form */}
                                    {(question?.status === 'pending' || question?.status === 'rejected') && (
                                        <div className="mt-2">
                                            {question?.question_type === 'text_input' && (
                                                <>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your answer"
                                                        value={answers[question?.id]?.answer || ''}
                                                        onChange={(e) =>
                                                            handleTextChange(question?.id, e.target.value)
                                                        }
                                                        className="border p-2 rounded w-full"
                                                    />
                                                    <Button
                                                        onClick={() => handleSubmitAnswer(question?.id)}
                                                        className="mt-2"
                                                        size="sm"
                                                        variant="flat"
                                                        color="primary"
                                                    >
                                                        Answer this
                                                    </Button>
                                                </>
                                            )}

                                            {question?.question_type === 'file_selector' && (
                                                <>
                                                    <input
                                                        type="file"
                                                        onChange={(e) =>
                                                            handleFileChange(
                                                                question?.id,
                                                                e.target.files?.[0] || null
                                                            )
                                                        }
                                                        className="border p-2 rounded w-full"
                                                    />
                                                    <Button
                                                        onClick={() => handleSubmitAnswer(question?.id)}
                                                        className="mt-2"
                                                        size="md"
                                                        variant="shadow"
                                                        color="primary"
                                                    >
                                                        Submit File
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* For completed questions, display answer details */}
                                    {(question?.status === 'completed' || question?.status === 'provided') && (
                                        <div className="mt-2">
                                            {question?.question_type === 'text_input' && (
                                                <p className="text-sm text-gray-700">
                                                    Answer: {question?.question_answer || "N/A"}
                                                </p>
                                            )}
                                            {(question?.question_type === 'file_selector' || question?.question_type === 'document_provide') && (
                                               <div className="flex gap-2 items-center">
                                                    <p className="text-sm text-gray-700">File:</p>
                                                    <a
                                                        href={question?.file_path || "#"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 underline text-sm"
                                                    >
                                                        View File
                                                    </a>
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        color="primary"
                                                        isIconOnly={true}
                                                        onClick={() => {
                                                            if (question?.file_path) {
                                                                FileSaver.saveAs(question?.file_path);
                                                            }
                                                        }}
                                                    ><ArrowDownToLine /></Button>
                                                </div>
                                            )}
                                            {question?.question_type === 'update_status' && (
                                                <div className="text-sm text-green-600 font-semibold">
                                                    Update
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Display rejection reason if rejected */}
                                    {question?.status === 'rejected' && (
                                        <div className="mt-2">
                                            <p className="text-sm text-red-600">
                                                Rejected: {question?.reason || "No reason provided"}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-3 flex items-center justify-between">
                                        <Badge
                                            className={`
                                                capitalize
                                                ${question?.status === 'pending' ? 'bg-yellow-500' : ''}
                                                ${question?.status === 'completed' ? 'bg-green-500' : ''}
                                                ${question?.status === 'rejected' ? 'bg-red-500' : ''}
                                            `}
                                        >
                                            {question?.status}
                                        </Badge>
                                        <div>
                                            <p>{question?.createdAt ? moment(question?.createdAt).format('lll') : "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardBody>
                <CardFooter className="flex justify-between">
                    Status : {data?.step?.step_status === 0 ? "Incomplete" : data?.step?.step_status === 1 ? "Completed" : "Unknown"}
                </CardFooter>
            </Card>
        );
    };


    // fetch steps 

    const { data: tabs, isFetching, isError, error } = useQuery({
        queryKey: ['steps', id],
        queryFn: () => fetchSteps()
    })

    const fetchSteps = async (): Promise<any> => {
        const { success, data, message } = await commonGetAPICalls(`/leads/lead_progress/student/get_steps/${id}`)
        if (success && success === true) {
            return data
        }
        throw new Error(message)
    }

    const navigate = useNavigate()

    // withdraw application
    const [isOpen, setIsOpen] = useState(false)

    const withdrawApplication = async () => {
        const { success, data, message } = await commonGetAPICalls(`/leads/lead_progress/student/widthdraw_application/${id}`)
        if (success && success === true) {
            SuccessToast(message)
            return data
        }
        ErrorToast(message)
        throw new Error(message)
    }

    const withdrawApplicationMutation = useMutation({
        mutationFn: withdrawApplication,
        onSuccess: () => {
            navigate(-1)
        }
    })

    return (
        <section className='space-y-4 w-full'>
            <div className="flex w-full justify-end">
                <Button
                    size="sm"
                    color="danger"
                    variant="shadow"
                    onClick={() => {
                        setIsOpen(true)
                    }}
                >Withdraw Application</Button>
            </div>
            
            {/* Agent Details - Always visible */}
            {!isFetching && tabs?.agent && (
                <Card className="p-4 w-fit flex flex-row items-center m-2">
                    <Avatar
                        showFallback
                        src={tabs?.agent?.profile_image || tabs?.agent?.access_profile}
                        size="lg"
                        className="border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                    />
                    <CardBody className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <User className="w-5 h-5 text-primary" />
                            <p className="text-gray-800 dark:text-gray-200">{tabs?.agent?.username || "Unknown"}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4 text-green-500" />
                            <p>{tabs?.agent?.phone || tabs?.agent?.phone_number || "N/A"}</p>
                        </div>
                    </CardBody>
                </Card>
            )}

            {isError ? <p>{error?.message}</p> : isFetching ? <div className="flex items-center justify-center w-full h-20"><Spinner /></div> :
                tabs?.steps?.length === 0 ? <div className="flex w-full flex-col items-center"> <p>No Steps Created Yet, You'll here out from agent soon...</p> </div> : <div className="flex w-full">
                    <div className="w-full">

                        {/* <Tabs aria-label="Dynamic tabs" items={tabs?.steps} isVertical variant='solid'>
                            {(item: any) => (
                                <Tab key={item?.id} title={<div className="w-48 flex items-center justify-between gap-2 ">
                                    <CircleCheck className={`${item?.step_status == 1 ? "text-green-600" : "text-yellow-600"} `} />
                                    <p className="truncate">{item?.step_title}</p>
                                </div>} >
                                    <div className="flex-1 border-l pl-4">
                                        <StepDetails step_id={item?.id} description={item?.step_description} />
                                    </div>
                                </Tab>
                            )}
                        </Tabs> */}
                        <div className="grid sm:grid-cols-3 sm:w-[70vw]">
                            <Steps current={step} vertical>
                                {tabs?.steps?.map((item: any, index: number) => (
                                    <Steps.Item
                                        onClick={() => { onChange(index) }}
                                        title={item?.step_title || ""}
                                        description={item?.step_description || ""}
                                        key={item?.id}
                                        className={`cursor-pointer ${step === index ? "font-bold text-black" : "text-gray-600"}`}
                                        status={`${item?.step_status === 1 ? "finish" : "wait"}`}
                                    />
                                ))}
                            </Steps>
                            <div className="col-span-2">
                                {tabs?.steps?.[step] && (
                                    <StepDetails step_id={tabs?.steps?.[step]?.id} description={tabs?.steps?.[step]?.step_description} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            }

            <CommonConfirmation
                isOpen={isOpen}
                onOpenChange={() => setIsOpen(false)}
                title='Are you sure you want to withdraw application?'
                handleSubmit={() => withdrawApplicationMutation.mutate()}
                nagativeTitle='No'
                positiveTitle='Yes'
            />
        </section>
    )
}

export default AcceptedApplicationProgress
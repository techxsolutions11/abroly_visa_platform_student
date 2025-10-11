import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Button, RadioGroup, Radio, Progress } from "@nextui-org/react";
import { Panel, Message } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { AlertCircle } from 'lucide-react';
import useApiCallUtils from '@/hooks/useApiCallUtils';

const LanguagePrepQuiz = () => {

    const { commonPostAPICall } = useApiCallUtils()

    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [purchase, setPurchase] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getQuistions();
    }, []);

    const getQuistions = async () => {
        const { data, success } = await commonPostAPICall(
            { purchase_uuid: id },
            "/quiz/student/get_quiz"
        );
        if (success && success === true) {
            setQuestions(data.questions);
            setPurchase(data.purchase);
            // If quiz is already submitted, set the submitted state
            if (data.purchase.is_quiz_submited === 1) {
                setSubmitted(true);
            }
        }
    };

    const handleAnswerChange = (questionUuid, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionUuid]: answer
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const answersToSubmit = questions.map(question => ({
                question_uuid: question.uuid,
                answer: answers[question.uuid],
            }));

            const { success } = await commonPostAPICall(
                { answers: answersToSubmit, purchase_uuid: id },
                "/quiz/student/submit_quiz"
            );

            if (success && success == true) {
                getQuistions()
                setSubmitted(true);
            } else {
                throw new Error('Failed to submit quiz');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const navigate = useNavigate()

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (submitted) {
        return (
            <div className="w-full mx-auto p-4 flex flex-col gap-2">
                <Message type="success" className="w-fit mx-auto">
                    <div className='flex flex-row items-center gap-2 font-medium'>
                        <AlertCircle size={15} /> <p>Quiz Already Submitted!</p>
                    </div>
                </Message>
                {purchase && (
                    <Card className="mt-4">
                        <CardBody>
                            <h3 className="text-xl mb-4">Quiz Results</h3>
                            <p>Score: {purchase?.quiz_score}%</p>
                        </CardBody>
                    </Card>
                )}

                <Button
                    color='primary'
                    variant='shadow'
                    className='w-fit'
                    onPress={() => {
                        setSubmitted(false)
                    }}
                >Reattempt Quiz</Button>
                <Button
                    color='primary'
                    variant='shadow'
                    className='w-fit'
                    onPress={() => {
                        navigate(`/language_prep/certificate/${id}`)
                    }}
                >Generate Certificate</Button>
            </div>
        );
    }

    if (questions?.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-4">
                <Message>Loading quiz questions...</Message>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const options = JSON.parse(currentQuestion.options);
    const progress = (Object.keys(answers).length / questions.length) * 100;

    return (
        <div className="container mx-auto p-4">
            <Panel bordered className="mb-4">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl">Quiz</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">Progress:</span>
                            <Progress
                                aria-label="Quiz progress"
                                value={progress}
                                className="w-48"
                                color="primary"
                            />
                            <span className="text-sm">{Math.round(progress)}%</span>
                        </div>
                    </div>

                    <Card>
                        <CardBody>
                            <div className="mb-4">
                                <h3 className="text-lg font-medium">
                                    Question {currentQuestionIndex + 1} of {questions?.length}
                                </h3>
                                <p className="mt-2">{currentQuestion.question_text}</p>
                            </div>

                            <RadioGroup
                                value={answers[currentQuestion.uuid] || ''}
                                onValueChange={(value) => handleAnswerChange(currentQuestion.uuid, value)}
                                className="mt-4"
                            >
                                {Object.entries(options).map(([key, value]: any) => (
                                    <Radio key={key} value={key} className="mb-2">
                                        {value}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        </CardBody>
                    </Card>

                    <div className="flex justify-between mt-4">
                        <Button
                            color="primary"
                            variant="flat"
                            onClick={handlePrevious}
                            isDisabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>

                        {currentQuestionIndex === questions.length - 1 ? (
                            <Button
                                color="success"
                                onClick={handleSubmit}
                                isDisabled={Object.keys(answers).length !== questions.length || isLoading}
                                isLoading={isLoading}
                            >
                                Submit Quiz
                            </Button>
                        ) : (
                            <Button
                                color="primary"
                                onClick={handleNext}
                                isDisabled={!answers[currentQuestion.uuid]}
                            >
                                Next Question
                            </Button>
                        )}
                    </div>
                </div>
            </Panel>
        </div>
    );
};

export default LanguagePrepQuiz;
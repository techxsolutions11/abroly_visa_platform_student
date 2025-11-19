import useApiCallUtils from '@/hooks/useApiCallUtils';
import { Spinner, Button, Checkbox } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, Building2, GraduationCap, Calendar, BookOpen, DollarSign, FileText } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import moment from 'moment';
import fetchQueriesHook from '@/hooks/fetchQueriesHook';
import { countries } from 'country-data';

const VisaConsultationDetails = () => {
    const queryClient = fetchQueriesHook();
    const navigate = useNavigate()
    const { commonGetAPICalls, commonPostAPICall } = useApiCallUtils();
    const { id } = useParams();
    const [selectedLead, setSelectedLead] = useState(null);
    const [selectedSuggestions, setSelectedSuggestions] = useState<number[]>([]); // Changed to array
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const fetchSuggestions = async () => {
        const { data, success } = await commonGetAPICalls(`/leads/get_suggestions?id=${id}`);
        if (success) return data;
        throw new Error("Failed to fetch suggestions.");
    };

    const { data, isFetching } = useQuery({
        queryKey: ["fetchSuggestions", id],
        queryFn: fetchSuggestions,
    });

    const handleContinueWithSuggestions = async (selectedLead, selectedIndexes: number[]): Promise<void> => {
        const { data, success } = await commonPostAPICall(
            { id: selectedLead?.id, selected_indexes: selectedIndexes },
            `/leads/select_suggestion`,
            true
        );
        if (success) {
            setSelectedLead(null);
            setIsDrawerOpen(false);
        }
    };

    const continueWithSelectedOptions = useMutation({
        mutationFn: () => handleContinueWithSuggestions(selectedLead, selectedSuggestions),
        onSuccess: () => {
            queryClient(["fetchSuggestions", id]);
            queryClient(["coins_balance"]);
            setSelectedSuggestions([]);
            setSelectedLead(null);
            setIsDrawerOpen(false);
            navigate("/accepted_applications");
        }
    });

    // Toggle selection of suggestions
    const toggleSuggestion = (index: number) => {
        setSelectedSuggestions(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">
            {/* Left Panel - Lead Cards */}
            <div className="w-full md:w-1/3 space-y-4">
                {isFetching ? (
                    <Spinner className='mx-auto' />
                ) : (
                    data?.map((lead) => (
                        <Card 
                            key={lead.id} 
                            onClick={() => { setSelectedLead(lead); setIsDrawerOpen(true); }}
                            className={`cursor-pointer hover:shadow-xl transition-all ${selectedLead?.id === lead.id ? 'border-blue-500 border-2' : ''}`}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="w-5 h-5 text-blue-500" /> {lead.lead_of.username}
                                </CardTitle>
                                <CardDescription>
                                    <p className='text-sm text-gray-500'>
                                        {moment.duration(moment().diff(lead?.updatedAt)).asWeeks() >= 1 
                                            ? `${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asWeeks())} week${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asWeeks()) > 1 ? 's' : ''} ago` 
                                            : moment.duration(moment().diff(lead?.updatedAt)).asDays() >= 1 
                                            ? `${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asDays())} day${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asDays()) > 1 ? 's' : ''} ago` 
                                            : moment.duration(moment().diff(lead?.updatedAt)).asHours() >= 1 
                                            ? `${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asHours())} hour${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asHours()) > 1 ? 's' : ''} ago` 
                                            : moment.duration(moment().diff(lead?.updatedAt)).asMinutes() >= 1 
                                            ? `${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asMinutes())} minute${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asMinutes()) > 1 ? 's' : ''} ago` 
                                            : 'Just now'}
                                    </p>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{JSON.parse(lead.suggestions).length} Suggestions</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Drawer - Suggestions Details */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction='bottom' onClose={() => {
                setSelectedSuggestions([]);
                setSelectedLead(null);
            }}>
                <DrawerContent className='h-[90vh]'>
                    <DrawerHeader>
                        <DrawerTitle>Suggestions</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-6 overflow-scroll">
                        {selectedLead ? (
                            <div>
                                <div className='flex gap-2 items-center my-4'>
                                    <h2 className="text-2xl font-semibold text-gray-800">Suggestions from {selectedLead?.lead_of?.username}</h2>
                                    <Button 
                                        onClick={() => window.open(`/agent_profile/${selectedLead?.id}`, "_blank")}
                                        size='sm'
                                        color='warning'
                                        variant='flat'
                                        startContent={<User className="p-1" />}
                                    >View Agent Profile</Button>
                                </div>
                                <p className='text-sm text-gray-500 mb-4'>Please Select at least one suggestion to continue.</p>

                                <div className="space-4 grid md:grid-cols-3 gap-2">
                                    {JSON.parse(selectedLead?.suggestions).map((suggestion, index) => (
                                        <Card 
                                            key={index} 
                                            className={`cursor-pointer hover:shadow-md transition-all ${selectedSuggestions.includes(index) ? 'border-blue-500 border-2' : ''}`} 
                                            onClick={() => toggleSuggestion(index)}
                                        >
                                            <CardContent className="space-y-2 p-4 my-2">
                                                <div>
                                                    <Checkbox
                                                        isSelected={selectedSuggestions.includes(index)}
                                                        onValueChange={() => toggleSuggestion(index)}
                                                    />
                                                </div>
                                                <div className="max-w-lg mx-auto transition-shadow duration-300">
                                                    <div className="flex items-center justify-between">
                                                        <h2 className="text-md font-semibold flex items-center gap-2">
                                                            Recommendation
                                                        </h2>
                                                        <span className="text-sm text-gray-500">Option #{index + 1}</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-3">
                                                            <p className="flex items-center gap-2 text-gray-700">
                                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                                <span><strong>Country:</strong> {countries[suggestion?.country || "IN"]?.name || 'Not specified'}</span>
                                                            </p>
                                                            <p className="flex items-center gap-2 text-gray-700">
                                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                                <span><strong>State:</strong> {suggestion?.state || 'Not specified'}</span>
                                                            </p>
                                                            <p className="flex items-center gap-2 text-gray-700">
                                                                <Building2 className="w-4 h-4 text-gray-500" />
                                                                <span><strong>University:</strong> {suggestion?.university || 'Not specified'}</span>
                                                            </p>
                                                            <p className="flex items-center gap-2 text-gray-700">
                                                                <Building2 className="w-4 h-4 text-gray-500" />
                                                                <span><strong>Type:</strong> {suggestion?.universityType || 'Not specified'}</span>
                                                            </p>
                                                            <p className="flex items-center gap-2 text-gray-700">
                                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                                <span><strong>Intake:</strong> {suggestion?.intakeMonth && suggestion?.intakeYear ? ` ${suggestion.intakeMonth} ${suggestion.intakeYear}` : 'Not specified'}</span>
                                                            </p>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <p className="flex items-center gap-2 text-gray-700">
                                                                <GraduationCap className="w-4 h-4 text-gray-500" />
                                                                <span><strong>Program Level:</strong> {suggestion?.programLevel || 'Not specified'}</span>
                                                            </p>
                                                            <p className="flex items-center gap-2 text-gray-700">
                                                                <FileText className="w-4 h-4 text-gray-500" />
                                                                <span><strong>Course/Program Name:</strong> {suggestion?.course_program_name || 'Not specified'}</span>
                                                            </p>
                                                            <p className="flex items-center gap-2 text-gray-700">
                                                                <BookOpen className="w-4 h-4 text-gray-500" />
                                                                <span><strong>Field of Study:</strong> {suggestion?.fieldOfStudy || 'Not specified'}</span>
                                                            </p>
                                                            <p className="flex items-center gap-2 text-gray-700">
                                                                <DollarSign className="w-4 h-4 text-gray-500" />
                                                                <span><strong>Tuition Fees:</strong> {suggestion?.tuitionFees || 'Not specified'}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                {selectedSuggestions.length > 0 && (
                                    <Button 
                                        onClick={() => continueWithSelectedOptions.mutate()}
                                        className="mt-4 w-fit mx-auto bg-blue-600 text-white hover:bg-blue-700 transition-all" 
                                        color="primary"
                                    >
                                        Continue With {selectedSuggestions.length} Selected Option{selectedSuggestions.length > 1 ? 's' : ''}
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-lg">Select a lead to view suggestions.</p>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default VisaConsultationDetails;

// older 2

// import useApiCallUtils from '@/hooks/useApiCallUtils';
// import { Spinner, Button } from '@nextui-org/react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { User, Info, Globe, MapPin, Building2, GraduationCap, Calendar, BookOpen, DollarSign, FileText } from 'lucide-react';
// import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
// import moment from 'moment';
// import fetchQueriesHook from '@/hooks/fetchQueriesHook';
// import { countries } from 'country-data';

// const VisaConsultationDetails = () => {

//     // const queryClient = useQueryClient();
//     const queryClient = fetchQueriesHook()

//     const { commonGetAPICalls,commonPostAPICall } = useApiCallUtils();
//     const { id } = useParams();
//     const [selectedLead, setSelectedLead] = useState(null);
//     const [selectedSuggestion, setSelectedSuggestion] = useState(null);
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//     const fetchSuggestions = async () => {
//         const { data, success } = await commonGetAPICalls(`/leads/get_suggestions?id=${id}`);
//         if (success) return data;
//         throw new Error("Failed to fetch suggestions.");
//     };

//     const { data, isFetching } = useQuery({
//         queryKey: ["fetchSuggestions", id],
//         queryFn: fetchSuggestions,
//     });

//     const handleContinueWithSuggestion = async (selectedLead, selectedSuggestion):Promise<void> => {
//         console.log(selectedLead, selectedSuggestion,"SELECTED");
        
//         const { data, success } = await commonPostAPICall({id:selectedLead?.id,selected_index:selectedSuggestion},`/leads/select_suggestion`,true);
//         if (success) {
//             setSelectedLead(data);
//             setIsDrawerOpen(false);
//         }
//     };

//     const continueWithSelectedOption = useMutation({
//         mutationFn:()=>handleContinueWithSuggestion(selectedLead, selectedSuggestion),
//         onSuccess:()=>{
//             queryClient(["fetchSuggestions", id])
//             queryClient(["coins_balance"])
//             setSelectedSuggestion(null)
//             setSelectedLead(null)
//             setIsDrawerOpen(false)
//         }
//     });

//     return (
//         <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">
//             {/* Left Panel - Lead Cards */}
//             <div className="w-full md:w-1/3 space-y-4">
//                 {isFetching ? (
//                     <Spinner className='mx-auto' />
//                 ) : (
//                     data?.map((lead) => (
//                         <Card 
//                             key={lead.id} 
//                             onClick={() => { setSelectedLead(lead); setIsDrawerOpen(true); }}
//                             className={`cursor-pointer hover:shadow-xl transition-all ${selectedLead?.id === lead.id ? 'border-blue-500 border-2' : ''}`}
//                         >
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2 text-lg">
//                                     <User className="w-5 h-5 text-blue-500" /> {lead.lead_of.username}
//                                 </CardTitle>
//                                 <CardDescription>
//                                 <p className='text-sm text-gray-500'>
//                                 {moment.duration(moment().diff(lead?.updatedAt)).asWeeks() >= 1 ? `${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asWeeks())} week${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asWeeks()) > 1 ? 's' : ''} ago` : moment.duration(moment().diff(lead?.updatedAt)).asDays() >= 1 ? `${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asDays())} day${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asDays()) > 1 ? 's' : ''} ago` : moment.duration(moment().diff(lead?.updatedAt)).asHours() >= 1 ? `${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asHours())} hour${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asHours()) > 1 ? 's' : ''} ago` : moment.duration(moment().diff(lead?.updatedAt)).asMinutes() >= 1 ? `${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asMinutes())} minute${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asMinutes()) > 1 ? 's' : ''} ago` : 'Just now'}</p>
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <p>{JSON.parse(lead.suggestions).length} Suggestions</p>
//                             </CardContent>
//                         </Card>
//                     ))
//                 )}
//             </div>

//             {/* Drawer - Suggestions Details */}
//             <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction='bottom' onClose={() => {
//                 setSelectedSuggestion(null)
//                 setSelectedLead(null)
//                 }}>
//                 <DrawerContent className='h-[90vh]'>
//                     <DrawerHeader>
//                         <DrawerTitle>Suggestions</DrawerTitle>
//                     </DrawerHeader>
//                     <div className="p-6 overflow-scroll">
//                         {selectedLead ? (
//                             <div>
//                                 <div className='flex gap-2 items-center my-4'>
//                                 <h2 className="text-2xl font-semibold text-gray-800">Suggestions from {selectedLead?.lead_of?.username}</h2>
//                                 <Button 
//                                 onClick={()=>{
//                                     window.open(`/agent_profile/${selectedLead?.id}`, "_blank")
//                                 }}
//                                 size='sm'
//                                 color='warning'
//                                 variant='flat'
//                                 startContent={<User className="p-1" />}
//                                 >View Agent Profile</Button>
//                                 </div>
//                                 <div className="space-4 grid md:grid-cols-3 gap-2">
//                                     {JSON.parse(selectedLead?.suggestions).map((suggestion, index) => (
//                                         <Card 
//                                             key={index} 
//                                             className={`cursor-pointer hover:shadow-md transition-all ${selectedSuggestion === index ? 'border-blue-500 border-2' : ''}`} 
//                                             onClick={() => setSelectedSuggestion(index)}
//                                         >
//                                             <CardContent className="space-y-2 p-4 my-2">
//                                             <div className="max-w-lg mx-auto transition-shadow duration-300">
//                                         {/* Header */}
//                                         <div className="flex items-center justify-between">
//                                                 <h2 className="text-md font-semibold flex items-center gap-2">
//                                                     Recommendation
//                                                 </h2>
//                                                 <span className="text-sm text-gray-500">Option #{index + 1}</span>
//                                             </div>

//                                             {/* Grid Layout for Details */}
//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                 {/* Left Column */}
//                                                 <div className="space-y-3">
//                                                     <p className="flex items-center gap-2 text-gray-700">
//                                                         <MapPin className="w-4 h-4 text-gray-500" />
//                                                         <span>
//                                                             <strong>Country:</strong> {countries[suggestion?.country || "IN"]?.name || 'Not specified'}
//                                                         </span>
//                                                     </p>
//                                                     <p className="flex items-center gap-2 text-gray-700">
//                                                         <MapPin className="w-4 h-4 text-gray-500" />
//                                                         <span>
//                                                             <strong>State:</strong> {suggestion?.state || 'Not specified'}
//                                                         </span>
//                                                     </p>
//                                                     <p className="flex items-center gap-2 text-gray-700">
//                                                         <Building2 className="w-4 h-4 text-gray-500" />
//                                                         <span>
//                                                             <strong>University:</strong> {suggestion?.university || 'Not specified'}
//                                                         </span>
//                                                     </p>
//                                                     <p className="flex items-center gap-2 text-gray-700">
//                                                         <Building2 className="w-4 h-4 text-gray-500" />
//                                                         <span>
//                                                             <strong>Type:</strong> {suggestion?.universityType || 'Not specified'}
//                                                         </span>
//                                                     </p>
//                                                     <p className="flex items-center gap-2 text-gray-700">
//                                                         <Calendar className="w-4 h-4 text-gray-500" />
//                                                         <span>
//                                                             <strong>Intake:</strong>
//                                                             {suggestion?.intakeMonth && suggestion?.intakeYear
//                                                                 ? ` ${suggestion.intakeMonth} ${suggestion.intakeYear}`
//                                                                 : 'Not specified'}
//                                                         </span>
//                                                     </p>
//                                                 </div>

//                                                 {/* Right Column */}
//                                                 <div className="space-y-3">
//                                                     <p className="flex items-center gap-2 text-gray-700">
//                                                         <GraduationCap className="w-4 h-4 text-gray-500" />
//                                                         <span>
//                                                             <strong>Program Level:</strong> {suggestion?.programLevel || 'Not specified'}
//                                                         </span>
//                                                     </p>
//                                                     <p className="flex items-center gap-2 text-gray-700">
//                                                         <FileText className="w-4 h-4 text-gray-500" />
//                                                         <span>
//                                                             <strong>Course/Program Name:</strong> {suggestion?.course_program_name || 'Not specified'}
//                                                         </span>
//                                                     </p>
//                                                     <p className="flex items-center gap-2 text-gray-700">
//                                                         <BookOpen className="w-4 h-4 text-gray-500" />
//                                                         <span>
//                                                             <strong>Field of Study:</strong> {suggestion?.fieldOfStudy || 'Not specified'}
//                                                         </span>
//                                                     </p>
                                                   
//                                                     <p className="flex items-center gap-2 text-gray-700">
//                                                         <DollarSign className="w-4 h-4 text-gray-500" />
//                                                         <span>
//                                                             <strong>Tuition Fees:</strong> {suggestion?.tuitionFees || 'Not specified'}
//                                                         </span>
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                             </CardContent>
//                                         </Card>
//                                     ))}
//                                 </div>
//                                 {selectedSuggestion !== null && (
//                                     <Button 
//                                     onClick={()=>{
//                                         continueWithSelectedOption.mutate(selectedLead, selectedSuggestion)
//                                     }}
//                                     className="mt-4 w-fit mx-auto bg-blue-600 text-white hover:bg-blue-700 transition-all" color="primary">
//                                         Continue With This Option
//                                     </Button>
//                                 )}
//                             </div>
//                         ) : (
//                             <p className="text-gray-600 text-lg">Select a lead to view suggestions.</p>
//                         )}
//                     </div>
//                 </DrawerContent>
//             </Drawer>
//         </div>
//     );
// };

// export default VisaConsultationDetails;

// older 1

// import useApiCallUtils from '@/hooks/useApiCallUtils'
// import { Spinner } from '@nextui-org/react'
// import { useQuery } from '@tanstack/react-query'
// import React from 'react'
// import { useParams } from 'react-router-dom'

// const VisaConsultationDetails = () => {

//     const { commonGetAPICalls } = useApiCallUtils()

//     const { id } = useParams()

//     // check provided suggestions 
//     const fetchSuggestions = async () => {
//         const { data, success } = await commonGetAPICalls(`/leads/get_suggestions?id=${id}`)
//         if (success && success == true) {
//             return data
//         }
//         throw new Error("Failed to fetch suggestions.");
//     }

//     const { data, isLoading, isError, error ,isFetching} = useQuery({
//         queryKey: ["fetchSuggestions",id],
//         queryFn: fetchSuggestions,
//     });

//     return (
//         <div>
//             {isFetching && <div className='mx-auto w-full'><Spinner /></div>}

            
//         </div>
//     )
// }

// export default VisaConsultationDetails
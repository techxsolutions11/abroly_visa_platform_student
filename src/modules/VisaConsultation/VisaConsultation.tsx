
import { Spinner, useDisclosure, Button, Chip, Checkbox } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectPicker, Input, Checkbox as RsuiteCheckbox, RadioGroup, Radio, InputNumber, IconButton, CheckboxGroup, Table } from 'rsuite';
import { MdLocationOn } from 'react-icons/md';
import ReactFlagsSelect from 'react-flags-select'
import { ErrorToast } from '@/utils/Toaster';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Eye, Globe, MapPin, GraduationCap, Calendar, DollarSign, School, User, Building2, FileText } from 'lucide-react';
import CommonLocationSelector from '@/components/CommonLocationSelector';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import { countries } from 'country-data'
import 'rsuite/dist/rsuite.min.css';
import { PREDEFINED_AGENCY_ID } from '@/utils/Constants';
import { useQuery, useMutation } from '@tanstack/react-query';
import fetchQueriesHook from '@/hooks/fetchQueriesHook';
import moment from 'moment';


const VisaConsultation = () => {

    const { commonGetAPICalls, commonPostAPICall } = useApiCallUtils()
    const queryClient = fetchQueriesHook()

    // first check here profile complition of student % wise, if it not completed then show alert and redirect to profile
    const [profileCompletion, setProfileCompletion] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [previous_applications, set_previoius_applications] = useState([])

    const [raiseApplicationLoader, setRaisedApplicationLoader] = useState(false)

    // Drawer state for suggestions
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
    const [selectedLead, setSelectedLead] = useState<any>(null)
    const [selectedSuggestions, setSelectedSuggestions] = useState<number[]>([])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        profileComplteApiCall()
        previousRaisedApplications()
    }, [])

    const profileComplteApiCall = async () => {
        setIsLoading(true)
        const { data, success } = await commonPostAPICall({}, "/student/profile_completion_progress")
        if (success && success == true) {
            setProfileCompletion(data?.completionPercentage)
        }
        setIsLoading(false)
    }
    const previousRaisedApplications = async () => {
        setIsLoading(true)
        const { data, success } = await commonGetAPICalls("/student/prvious_raised_applications")
        if (success && success == true) {
            set_previoius_applications(data)
        }
        setIsLoading(false)
    }

    // raise application 
    const [raiseApplicationFormOpen, setRaiseApplicationFormOpen] = useState(false)

    // raise application form
    const [formData, setFormData] = useState<any>({
        country: '',
        state: '',
        university: '',
        universityType: '',
        useCurrentLocation: false,
        range: 10,
        programLevel: '',
        fieldOfStudy: '',
        intakeMonth: '',
        intakeYear: '',
        tuitionFees: '',
        otherOption: '',
    });

    const programLevels = [
        {
            label: 'Undergraduate',
            items: [
                '1-Year Post-Secondary Certificate',
                '2-Year Undergraduate Diploma',
                '3-Year Undergraduate Advanced Diploma',
                "3-Year Bachelor's Degree",
                'Top-up Degree',
                "4-Year Bachelor's Degree",
                'Integrated Masters',
            ],
        },
        {
            label: 'Post-graduate',
            items: [
                'Postgraduate Certificate',
                'Postgraduate Diploma',
                "Master's Degree",
                'Doctoral / PhD',
                'Non-Credential',
            ],
        },
        {
            label: 'Elementary and High School',
            items: Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
        },
        {
            label: 'Language Proficiency',
            items: ['English as Second Language (ESL)'],
        },
        {
            label: 'Other',
            items: ['Other Option'],
        },
    ];

    const tuitionFees = [
        '0 - 1k',
        '1k - 5k',
        '5k - 10k',
        '10k - 20k',
        '20k - 30k',
        '30k+',
    ];

    const fieldsOfStudy = [
        'Arts',
        'Business, Management and Economics',
        'Elementary and High School',
        'Engineering and Technology',
        'English for Academic Studies',
        'Health Sciences, Medicine, Nursing, Paramedic and Kinesiology',
        'Law, Politics, Social, Community Service and Teaching',
    ];

    const handleInputChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    // First, create these helper functions at the top of your component
    // const generateMonths = () => {
    //     const months = ['January', 'February', 'March', 'April', 'May', 'June',
    //         'July', 'August', 'September', 'October', 'November', 'December'];
    //     const currentYear = new Date().getFullYear();
    //     const currentMonth = new Date().getMonth(); // 0-11

    //     if (formData.intakeYear === currentYear.toString()) {
    //         return months
    //             .slice(currentMonth)
    //             .map(month => ({ label: month, value: month }));
    //     }
    //     return months.map(month => ({ label: month, value: month }));
    // };

    // const generateYears = () => {
    //     const currentYear = new Date().getFullYear();
    //     const years = [];
    //     for (let i = 0; i <= 1; i++) {
    //         years.push({ label: `${currentYear + i}`, value: `${currentYear + i}` });
    //     }
    //     return years;
    // };
    const generateMonths = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-11

        const selectedYear = formData.intakeYear ? parseInt(formData.intakeYear) : currentYear;

        // Calculate end date (exactly 36 months from current month)
        const endDate = new Date(currentDate);
        endDate.setMonth(endDate.getMonth() + 36);
        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth();

        // If no year selected or current year
        if (!formData.intakeYear || selectedYear === currentYear) {
            return months
                .slice(currentMonth)
                .map(month => ({ label: month, value: month }));
        }

        // If selected year is beyond end year, return empty array
        if (selectedYear > endYear) {
            return [];
        }

        // If selected year is the end year, limit to endMonth
        if (selectedYear === endYear) {
            return months
                .slice(0, endMonth)  // endMonth is exclusive, so this gives us up to but not including the 37th month
                .map(month => ({ label: month, value: month }));
        }

        // For years between current and end year, return all months
        return months.map(month => ({ label: month, value: month }));
    };

    const generateYears = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const endDate = new Date(currentDate);
        endDate.setMonth(endDate.getMonth() + 36);
        const endYear = endDate.getFullYear();

        return Array.from(
            { length: endYear - currentYear + 1 },
            (_, i) => {
                const year = currentYear + i;
                return { label: `${year}`, value: `${year}` };
            }
        );
    };

    const { isOpen, onOpenChange } = useDisclosure()

    // const { latitude, longitude, area } = useSelector((state: any) => state.user_location);

    const handleSubmit = async () => {
        // raise_application
        setRaisedApplicationLoader(true)

        const sendData = {
            agency_id:PREDEFINED_AGENCY_ID,
            country: formData.country,
            state: formData.state,
            university: formData.university,
            universityType: formData.universityType,
            useCurrentLocation: formData.useCurrentLocation,
            range: formData.range,
            programLevel: formData.programLevel,
            fieldOfStudy: formData.fieldOfStudy,
            intake: formData.intakeMonth + " " + formData.intakeYear,
            // intakeYear: formData.intakeYear,
            tuitionFees: formData.tuitionFees,
            otherOption: formData.otherOption,
            // latitude: latitude,
            // longitude: longitude,
        };

        const { success } = await commonPostAPICall({ ...sendData }, "/student/raise_application", true)

        if (success && success == true) {
            setRaiseApplicationFormOpen(false)
            previousRaisedApplications()
        }

        setRaisedApplicationLoader(false)
    }

    const isFormValid = () => {
        const requiredFields = [
            formData?.country,
            // formData?.state,
            // formData?.university,
            // formData?.universityType?.length > 0,
            formData?.programLevel,
            formData?.fieldOfStudy,
            formData?.intakeMonth,
            formData?.intakeYear,
            // formData?.tuitionFees
        ]
        return requiredFields.every(field => field && field !== '')
    }

    // Fetch suggestions for selected application
    const fetchSuggestions = async () => {
        if (!selectedApplicationId) return null;
        const { data, success } = await commonGetAPICalls(`/leads/get_suggestions?id=${selectedApplicationId}`);
        if (success) return data;
        throw new Error("Failed to fetch suggestions.");
    };

    const { data: suggestionsData, isFetching: isFetchingSuggestions } = useQuery({
        queryKey: ["fetchSuggestions", selectedApplicationId],
        queryFn: fetchSuggestions,
        enabled: !!selectedApplicationId && isDrawerOpen,
    });

    // Handle continue with selected suggestions
    const handleContinueWithSuggestions = async (selectedLead: any, selectedIndexes: number[]): Promise<void> => {
        const { data, success } = await commonPostAPICall(
            { id: selectedLead?.id, selected_indexes: selectedIndexes },
            `/leads/select_suggestion`,
            true
        );
        if (success) {
            setSelectedLead(null);
            setIsDrawerOpen(false);
            setSelectedApplicationId(null);
        }
    };

    const continueWithSelectedOptions = useMutation({
        mutationFn: () => handleContinueWithSuggestions(selectedLead, selectedSuggestions),
        onSuccess: () => {
            queryClient(["fetchSuggestions", selectedApplicationId]);
            queryClient(["coins_balance"]);
            setSelectedSuggestions([]);
            setSelectedLead(null);
            setIsDrawerOpen(false);
            setSelectedApplicationId(null);
            previousRaisedApplications();
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

    // Handle view suggestions button click
    const handleViewSuggestions = (applicationId: string) => {
        setSelectedApplicationId(applicationId);
        setIsDrawerOpen(true);
    };

    return (
        <div className="w-[122%] min-h-screen p-4 md:p-6 lg:p-8">
            {isLoading ? (
                <div className='flex items-center justify-center min-h-[50vh]'>
                    <Spinner size="lg" />
                </div>
            ) 
            : 
            // profileCompletion !== 100 ? (
            //     <div className='flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center px-4'>
            //         <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold'>Visa & Course Consultation</h1>
            //         <div className='w-full max-w-md'>
            //             <div className='bg-background rounded-lg p-6 shadow-lg'>
            //                 <p className='text-lg mb-2'>Profile Completion: {profileCompletion}%</p>
            //                 <p className='text-muted-foreground mb-4'>Complete your profile to 100% to apply for visa consultation</p>
            //                 <Button
            //                     className='w-full md:w-auto'
            //                     onClick={() => navigate("/student_profile")}
            //                 >
            //                     Complete Profile
            //                 </Button>
            //             </div>
            //         </div>
            //     </div>
            // ) :
             (
                <div className='max-w-[1800px] mx-auto'>
                    {/* Header with Button */}
                    <div className={`flex flex-col ${previous_applications.length == 0 ? 'items-center' : 'items-end'} mb-6`}>
                        <Button
                            className='w-full md:w-auto'
                            onClick={() => setRaiseApplicationFormOpen(true)}
                            isDisabled={raiseApplicationFormOpen}
                            color='primary'
                        >
                            + Application Raise
                        </Button>
                    </div>

                    {/* Side by Side Layout: Form (Left) and Listing (Right) */}
                    <div className={`flex flex-col gap-6 ${raiseApplicationFormOpen ? 'lg:flex-row lg:items-start' : ''}`}>
                        {/* Left Side - Form */}
                        {raiseApplicationFormOpen && (
                            raiseApplicationLoader ? (
                                <div className='w-full lg:w-1/2 flex items-center gap-4 justify-center py-12'>
                                    <Spinner size="lg" /> 
                                    <p className="text-gray-600 dark:text-gray-400">Please Wait...</p>
                                </div>
                            ) : (
                                <div className="w-full lg:w-1/2 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]">
                                    {/* Form Container with Banner */}
                                    <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl relative flex flex-col max-h-[calc(100vh-8rem)]">
                                        {/* Banner Heading - Inside Card */}
                                        <div className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 border-b border-primary/20 dark:border-primary/30 py-5 px-6 rounded-t-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                                                    <GraduationCap size={24} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                                        Raise New Application
                                                    </h2>
                                                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                                                        Fill in your application details
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Decorative gradient overlay */}
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-primary z-10"></div>
                                        
                                        <CardContent className="pt-6 pb-20 px-4 md:px-6 overflow-y-auto flex-1">
                                                <div className="space-y-8">
                                                    {/* Location & University Section */}
                                                    <div className="space-y-5">
                                                        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                                                            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                                                                <MapPin size={20} className="text-primary" />
                                                            </div>
                                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                                                                Location & University Information
                                                            </h3>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                            <div className="space-y-2">
                                                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                                    <Globe size={18} className="text-primary" />
                                                                    Country *
                                                                </label>
                                                                <ReactFlagsSelect
                                                                    selected={formData?.country}
                                                                    searchable={true}
                                                                    onSelect={(e) => handleInputChange('country', e)}
                                                                    className="w-full"
                                                                    selectButtonClassName="w-full h-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-left bg-white dark:bg-gray-800 hover:border-primary dark:hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                                    <MapPin size={18} className="text-primary" />
                                                                    State / Province
                                                                </label>
                                                                <Input
                                                                    className="w-full"
                                                                    placeholder="Enter State/Province"
                                                                    value={formData?.state}
                                                                    onChange={(value) => handleInputChange('state', value)}
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                                    <School size={18} className="text-primary" />
                                                                    University
                                                                </label>
                                                                <Input
                                                                    className="w-full"
                                                                    placeholder="Enter University"
                                                                    value={formData?.university}
                                                                    onChange={(value) => handleInputChange('university', value)}
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                                    <School size={18} className="text-primary" />
                                                                    Type of University
                                                                </label>
                                                                <CheckboxGroup
                                                                    inline
                                                                    onChange={(value) => handleInputChange('universityType', value)}
                                                                    className="flex gap-6 mt-2"
                                                                >
                                                                    <Checkbox value="private">Private</Checkbox>
                                                                    <Checkbox value="public">Public</Checkbox>
                                                                </CheckboxGroup>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Academic Details Section */}
                                                    <div className="space-y-5 pt-6 border-t border-gray-200 dark:border-gray-700">
                                                        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                                                            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                                                                <BookOpen size={20} className="text-primary" />
                                                            </div>
                                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                                                                Academic Details
                                                            </h3>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                            <div className="space-y-2 md:col-span-2">
                                                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                                    <GraduationCap size={18} className="text-primary" />
                                                                    Program Level *
                                                                </label>
                                                                <SelectPicker
                                                                    data={programLevels.flatMap((group) =>
                                                                        group.items.map((item) => ({
                                                                            label: item,
                                                                            value: item,
                                                                            group: group.label,
                                                                        }))
                                                                    )}
                                                                    groupBy="group"
                                                                    block
                                                                    onChange={(value) => handleInputChange('programLevel', value)}
                                                                    placeholder="Select Program Level"
                                                                    value={formData?.programLevel}
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                                    <BookOpen size={18} className="text-primary" />
                                                                    Field of Study *
                                                                </label>
                                                                <SelectPicker
                                                                    data={fieldsOfStudy.map((field) => ({ label: field, value: field }))}
                                                                    onChange={(value) => handleInputChange('fieldOfStudy', value)}
                                                                    placeholder="Select Field of Study"
                                                                    block
                                                                    value={formData?.fieldOfStudy}
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                                    <Calendar size={18} className="text-primary" />
                                                                    Intake *
                                                                </label>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <SelectPicker
                                                                        data={generateYears()}
                                                                        onChange={(value) => handleInputChange('intakeYear', value)}
                                                                        value={formData.intakeYear || null}
                                                                        placeholder="Select Year"
                                                                        block
                                                                    />
                                                                    <SelectPicker
                                                                        data={generateMonths()}
                                                                        onChange={(value) => handleInputChange('intakeMonth', value)}
                                                                        value={formData.intakeMonth || null}
                                                                        placeholder="Select Month"
                                                                        block
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                                    <DollarSign size={18} className="text-primary" />
                                                                    Tuition Fees (USD)
                                                                </label>
                                                                <SelectPicker
                                                                    data={tuitionFees.map((fee) => ({ label: fee, value: fee }))}
                                                                    onChange={(value) => handleInputChange('tuitionFees', value)}
                                                                    placeholder="Select Tuition Range"
                                                                    block
                                                                    value={formData?.tuitionFees}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>

                                            {/* Sticky Submit Button - Always Visible at Bottom */}
                                            <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] px-4 md:px-6 py-4 z-[100] -mx-4 md:-mx-6 -mb-4 md:-mb-6">
                                                <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                                                    <Button
                                                        variant="flat"
                                                        className="w-full sm:w-auto min-w-[100px]"
                                                        onClick={() => { 
                                                            setRaiseApplicationFormOpen(false)
                                                            setFormData({
                                                                country: '',
                                                                state: '',
                                                                university: '',
                                                                universityType: '',
                                                                useCurrentLocation: false,
                                                                range: 10,
                                                                programLevel: '',
                                                                fieldOfStudy: '',
                                                                intakeMonth: '',
                                                                intakeYear: '',
                                                                tuitionFees: '',
                                                                otherOption: '',  
                                                            })
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        className="w-full sm:w-auto min-w-[140px] font-semibold text-sm"
                                                        color='primary'
                                                        onClick={handleSubmit}
                                                        disabled={!isFormValid()}
                                                        isDisabled={!isFormValid()}
                                                        size="md"
                                                    >
                                                        Submit Application
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                </div>
                            )
                        )}

                        {/* Right Side - Listing */}
                        <div className={`w-full ${raiseApplicationFormOpen ? 'lg:w-1/2' : 'lg:w-full'}`}>
                            {/* Header matching form banner height */}
                            <div className="mb-6 py-5 px-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                                        <BookOpen size={24} className="text-gray-700 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                            Previous Applications
                                        </h2>
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                            {previous_applications?.length || 0} {previous_applications?.length === 1 ? 'application' : 'applications'} found
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid gap-4 md:gap-6">
                {previous_applications?.map((application) => (
                    <Card 
                        key={application?.id} 
                        className="group hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
                    >
                        <CardContent className="p-6">
                            {/* Header Section with Suggestions Badge */}
                            <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BookOpen size={18} className="text-primary" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {application?.fieldOfStudy}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">
                                        {application?.programLevel}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Chip 
                                        variant='flat' 
                                        color={application?.suggestions > 0 ? 'success' : 'default'}
                                        className="font-semibold"
                                    >
                                        {application?.suggestions} {application?.suggestions === 1 ? 'Suggestion' : 'Suggestions'}
                                    </Chip>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <Globe size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                            Country
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                            {countries[application?.country]?.name || application?.country}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                            State / Province
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                            {application?.state || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {application?.tuitionFees && (
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 md:col-span-2">
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                Tuition Fees
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {application?.tuitionFees}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Section */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    <span className="font-medium">Submitted:</span>{' '}
                                    {new Date(application?.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                <Button 
                                    isDisabled={application?.suggestions == 0} 
                                    onClick={() => {
                                        handleViewSuggestions(application?.id)
                                    }} 
                                    size='sm' 
                                    color='primary' 
                                    variant={application?.suggestions > 0 ? 'solid' : 'flat'}
                                    className="w-full sm:w-auto"
                                    startContent={<Eye size={16} />}
                                >
                                    View Suggestions
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                            </div>
                            
                            {previous_applications?.length === 0 && !raiseApplicationFormOpen && (
                                <Card className="p-12 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <GraduationCap className="w-16 h-16 text-gray-400" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Applications Yet</h3>
                                            <p className="text-gray-600 dark:text-gray-400">Click "Application Raise" to create your first application</p>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <CommonLocationSelector
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />

            {/* Drawer - Suggestions Details */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction='bottom' onClose={() => {
                setSelectedSuggestions([]);
                setSelectedLead(null);
                setSelectedApplicationId(null);
            }}>
                <DrawerContent className='h-[90vh]'>
                    <DrawerHeader>
                        <DrawerTitle>Suggestions</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-6 overflow-scroll">
                        {isFetchingSuggestions ? (
                            <div className="flex items-center justify-center py-12">
                                <Spinner size="lg" />
                            </div>
                        ) : suggestionsData && suggestionsData.length > 0 ? (
                            <div className="space-y-4">
                                {suggestionsData.map((lead: any) => (
                                    <div key={lead.id}>
                                        <div 
                                            onClick={() => { 
                                                setSelectedLead(lead); 
                                            }}
                                            className={`cursor-pointer p-4 rounded-lg border-2 transition-all mb-4 ${selectedLead?.id === lead.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-5 h-5 text-blue-500" />
                                                    <h3 className="text-lg font-semibold">{lead.lead_of.username}</h3>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {moment.duration(moment().diff(lead?.updatedAt)).asWeeks() >= 1 
                                                        ? `${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asWeeks())} week${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asWeeks()) > 1 ? 's' : ''} ago` 
                                                        : moment.duration(moment().diff(lead?.updatedAt)).asDays() >= 1 
                                                        ? `${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asDays())} day${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asDays()) > 1 ? 's' : ''} ago` 
                                                        : moment.duration(moment().diff(lead?.updatedAt)).asHours() >= 1 
                                                        ? `${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asHours())} hour${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asHours()) > 1 ? 's' : ''} ago` 
                                                        : moment.duration(moment().diff(lead?.updatedAt)).asMinutes() >= 1 
                                                        ? `${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asMinutes())} minute${Math.floor(moment.duration(moment().diff(lead?.updatedAt)).asMinutes()) > 1 ? 's' : ''} ago` 
                                                        : 'Just now'}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">{JSON.parse(lead.suggestions).length} Suggestions</p>
                                        </div>

                                        {selectedLead?.id === lead.id && (
                                            <div>
                                                <div className='flex gap-2 items-center my-4'>
                                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Suggestions from {selectedLead?.lead_of?.username}</h2>
                                                    <Button 
                                                        onClick={() => window.open(`/agent_profile/${selectedLead?.id}`, "_blank")}
                                                        size='sm'
                                                        color='warning'
                                                        variant='flat'
                                                        startContent={<User className="p-1" />}
                                                    >View Agent Profile</Button>
                                                </div>
                                                <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>Please Select at least one suggestion to continue.</p>

                                                <div className="space-4 grid md:grid-cols-3 gap-2">
                                                    {JSON.parse(selectedLead?.suggestions).map((suggestion: any, index: number) => (
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
                                                                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                                                <span><strong>Country:</strong> {countries[suggestion?.country || "IN"]?.name || 'Not specified'}</span>
                                                                            </p>
                                                                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                                                <span><strong>State:</strong> {suggestion?.state || 'Not specified'}</span>
                                                                            </p>
                                                                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                                                <Building2 className="w-4 h-4 text-gray-500" />
                                                                                <span><strong>University:</strong> {suggestion?.university || 'Not specified'}</span>
                                                                            </p>
                                                                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                                                <Building2 className="w-4 h-4 text-gray-500" />
                                                                                <span><strong>Type:</strong> {suggestion?.universityType || 'Not specified'}</span>
                                                                            </p>
                                                                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                                                <span><strong>Intake:</strong> {suggestion?.intakeMonth && suggestion?.intakeYear ? ` ${suggestion.intakeMonth} ${suggestion.intakeYear}` : 'Not specified'}</span>
                                                                            </p>
                                                                        </div>
                                                                        <div className="space-y-3">
                                                                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                                                <GraduationCap className="w-4 h-4 text-gray-500" />
                                                                                <span><strong>Program Level:</strong> {suggestion?.programLevel || 'Not specified'}</span>
                                                                            </p>
                                                                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                                                <FileText className="w-4 h-4 text-gray-500" />
                                                                                <span><strong>Course/Program Name:</strong> {suggestion?.course_program_name || 'Not specified'}</span>
                                                                            </p>
                                                                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                                                <BookOpen className="w-4 h-4 text-gray-500" />
                                                                                <span><strong>Field of Study:</strong> {suggestion?.fieldOfStudy || 'Not specified'}</span>
                                                                            </p>
                                                                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
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
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400 text-lg">No suggestions available.</p>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export default VisaConsultation;

import { Spinner, useDisclosure, Button, Chip } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectPicker, Input, Checkbox, RadioGroup, Radio, InputNumber, IconButton, CheckboxGroup, Table } from 'rsuite';
import { MdLocationOn } from 'react-icons/md';
import ReactFlagsSelect from 'react-flags-select'
import { ErrorToast } from '@/utils/Toaster';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Eye, Globe, MapPin, GraduationCap, Calendar, DollarSign, School } from 'lucide-react';
import CommonLocationSelector from '@/components/CommonLocationSelector';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import { countries } from 'country-data'
import 'rsuite/dist/rsuite.min.css';
import { PREDEFINED_AGENCY_ID } from '@/utils/Constants';


const VisaConsultation = () => {

    const { commonGetAPICalls, commonPostAPICall } = useApiCallUtils()

    // first check here profile complition of student % wise, if it not completed then show alert and redirect to profile
    const [profileCompletion, setProfileCompletion] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [previous_applications, set_previoius_applications] = useState([])

    const [raiseApplicationLoader, setRaisedApplicationLoader] = useState(false)

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

    return (
        <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
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
                <div className='max-w-7xl mx-auto'>
                    <div className={`flex flex-col ${previous_applications.length == 0 ? 'items-center' : 'items-end'}  mb-8`}>
                        <Button
                            className='w-full md:w-auto'
                            onClick={() => setRaiseApplicationFormOpen(true)}
                            isDisabled={raiseApplicationFormOpen}
                            color='primary'
                        >
                            + Application Raise
                        </Button>
                    </div>

                    {raiseApplicationFormOpen && (
                        raiseApplicationLoader ? (
                            <div className='w-full flex items-center gap-4 justify-center py-12'>
                                <Spinner size="lg" /> 
                                <p className="text-gray-600 dark:text-gray-400">Please Wait...</p>
                            </div>
                        ) : (
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                                <CardHeader className="pb-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3 mb-2">
                                        <GraduationCap size={24} className="text-primary" />
                                        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                            Raise New Application
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        Fill in your application details to get personalized visa consultation suggestions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-6">
                                        {/* Location & University Section */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                                                Location & University Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        <Globe size={16} className="text-primary" />
                                                        Country *
                                                    </label>
                                                    <ReactFlagsSelect
                                                        selected={formData?.country}
                                                        searchable={true}
                                                        onSelect={(e) => handleInputChange('country', e)}
                                                        className="w-full"
                                                        selectButtonClassName="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-left bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        <MapPin size={16} className="text-primary" />
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
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        <School size={16} className="text-primary" />
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
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        <School size={16} className="text-primary" />
                                                        Type of University
                                                    </label>
                                                    <CheckboxGroup
                                                        inline
                                                        onChange={(value) => handleInputChange('universityType', value)}
                                                        className="flex gap-4"
                                                    >
                                                        <Checkbox value="private">Private</Checkbox>
                                                        <Checkbox value="public">Public</Checkbox>
                                                    </CheckboxGroup>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Academic Details Section */}
                                        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                                                Academic Details
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        <GraduationCap size={16} className="text-primary" />
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
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        <BookOpen size={16} className="text-primary" />
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
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        <Calendar size={16} className="text-primary" />
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
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        <DollarSign size={16} className="text-primary" />
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

                                        {/* Submit Button */}
                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                                                <Button
                                                    variant="flat"
                                                    className="w-full sm:w-auto"
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
                                                    className="w-full sm:w-auto"
                                                    color='primary'
                                                    onClick={handleSubmit}
                                                    disabled={!isFormValid()}
                                                    isDisabled={!isFormValid()}
                                                >
                                                    Submit Application
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
            )}

            <div className="grid gap-4 md:gap-6 mt-5">
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
                                        navigate("/visa_consultation/" + application?.id)
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

            <CommonLocationSelector
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
        </div>
    );
}

export default VisaConsultation;
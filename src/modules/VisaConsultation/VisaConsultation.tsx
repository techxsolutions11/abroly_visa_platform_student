
import { Spinner, useDisclosure, Button, Chip } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectPicker, Input, Checkbox, RadioGroup, Radio, InputNumber, IconButton, CheckboxGroup, Table } from 'rsuite';
import { MdLocationOn } from 'react-icons/md';
import ReactFlagsSelect from 'react-flags-select'
import { ErrorToast } from '@/utils/Toaster';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Eye, Globe, MapPin } from 'lucide-react';
import CommonLocationSelector from '@/components/CommonLocationSelector';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import { countries } from 'country-data'
import 'rsuite/dist/rsuite.min.css';


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

    const { latitude, longitude, area } = useSelector((state: any) => state.user_location);

    const handleSubmit = async () => {
        // raise_application
        setRaisedApplicationLoader(true)

        const sendData = {
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
            latitude: latitude,
            longitude: longitude,
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
            formData?.state,
            formData?.university,
            formData?.universityType?.length > 0,
            formData?.programLevel,
            formData?.fieldOfStudy,
            formData?.intakeMonth,
            formData?.intakeYear,
            formData?.tuitionFees
        ]
        return requiredFields.every(field => field && field !== '')
    }

    return (
        <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
            {isLoading ? (
                <div className='flex items-center justify-center min-h-[50vh]'>
                    <Spinner size="lg" />
                </div>
            ) : profileCompletion !== 100 ? (
                <div className='flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center px-4'>
                    <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold'>Visa & Course Consultation</h1>
                    <div className='w-full max-w-md'>
                        <div className='bg-background rounded-lg p-6 shadow-lg'>
                            <p className='text-lg mb-2'>Profile Completion: {profileCompletion}%</p>
                            <p className='text-muted-foreground mb-4'>Complete your profile to 100% to apply for visa consultation</p>
                            <Button
                                className='w-full md:w-auto'
                                onClick={() => navigate("/student_profile")}
                            >
                                Complete Profile
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
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
                        raiseApplicationLoader ? <div className='w-full flex items-center gap-4 justify-center'>
                            <Spinner size="lg" /> <h1>Please Wait...</h1>
                        </div> : (<div className="bg-card rounded-xl p-6 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                {/* First section - Country, State, University */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Country</label>
                                    <ReactFlagsSelect
                                        selected={formData?.country}
                                        searchable={true}
                                        onSelect={(e) => handleInputChange('country', e)}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">State / Province</label>
                                    <Input
                                        className="w-full"
                                        placeholder="Enter State/Province"
                                        value={formData?.state}
                                        onChange={(value) => handleInputChange('state', value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">University</label>
                                    <Input
                                        className="w-full"
                                        placeholder="Enter University"
                                        value={formData?.university}
                                        onChange={(value) => handleInputChange('university', value)}
                                    />
                                </div>

                                {/* University Type */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type of University</label>
                                    <CheckboxGroup
                                        inline
                                        onChange={(value) => handleInputChange('universityType', value)}
                                        className="flex gap-4"
                                    >
                                        <Checkbox value="private">Private</Checkbox>
                                        <Checkbox value="public">Public</Checkbox>
                                    </CheckboxGroup>
                                </div>


                                {/* Program Level */}
                                <div className="col-span-full space-y-2">
                                    <label className="text-sm font-medium">Program Level</label>
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

                                {/* Field of Study */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Field of Study</label>
                                    <SelectPicker
                                        data={fieldsOfStudy.map((field) => ({ label: field, value: field }))}
                                        onChange={(value) => handleInputChange('fieldOfStudy', value)}
                                        placeholder="Select Field of Study"
                                        block
                                        value={formData?.fieldOfStudy}
                                    />
                                </div>

                                {/* Intake Section */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Intake</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* <SelectPicker
                                            data={generateMonths()}
                                            onChange={(value) => handleInputChange('intakeMonth', value)}
                                            placeholder="Select Month"
                                            block
                                        />
                                        <SelectPicker
                                            data={generateYears()}
                                            onChange={(value) => handleInputChange('intakeYear', value)}
                                            placeholder="Select Year"
                                            block
                                        /> */}

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

                                {/* Tuition Fees */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tuition Fees (USD)</label>
                                    <SelectPicker
                                        data={tuitionFees.map((fee) => ({ label: fee, value: fee }))}
                                        onChange={(value) => handleInputChange('tuitionFees', value)}
                                        placeholder="Select Tuition Range"
                                        block
                                        value={formData?.tuitionFees}
                                    />
                                </div>

                                {/* Location Section */}
                                <div className="col-span-full flex flex-col gap-4 items-center bg-accent/10  rounded-lg">
                                    <p className="text-md font-medium">Selected Location: {area}</p>

                                    <div className='flex flex-row items-center justify-center gap-4 col-span-2'>
                                        <Separator orientation="horizontal" className="my-2 mx-auto" />
                                        OR
                                        <Separator orientation="horizontal" className="my-2 mx-auto" />
                                    </div>
                                    <IconButton onClick={() => { onOpenChange() }} icon={<MapPin className='p-1' />}>Select Other Location</IconButton>

                                </div>

                                {/* Submit Button */}
                                <div className="col-span-full mt-6 mx-auto flex items-center justify-center gap-4 flex-wrap">
                                    <Button
                                        className="w-full md:w-auto"
                                        color='primary'
                                        onClick={handleSubmit}
                                        disabled={!isFormValid()}
                                        isDisabled={!isFormValid()}
                                    >
                                        Submit Application
                                    </Button>
                                    <Button
                                        className="w-full md:w-auto"
                                        color='danger'
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
                                </div>
                            </div>
                        </div>)
                    )}
                </div>
            )}

            {/* submited application form */}

            {/* <Card className="shadow-lg border border-gray-300">
                    <CardHeader className="text-xl font-bold text-blue-800 border-b pb-2">
                        Previous Applications
                    </CardHeader>
                    <CardContent>
                        <Table
                            autoHeight
                            bordered
                            data={previous_applications}
                            className="rounded-lg"
                        >
                            <Table.Column width={50} align="center" fixed>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.Cell dataKey="id" />
                            </Table.Column>

                            <Table.Column flexGrow={2} fixed>
                                <Table.HeaderCell>Field of Study</Table.HeaderCell>
                                <Table.Cell>
                                    {rowData => (
                                        <div className="flex items-center space-x-2">
                                            <BookOpen size={16} className="text-gray-600" />
                                            <span>{rowData.fieldOfStudy}</span>
                                        </div>
                                    )}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column flexGrow={2}>
                                <Table.HeaderCell>Program Level</Table.HeaderCell>
                                <Table.Cell dataKey="programLevel" />
                            </Table.Column>

                            <Table.Column flexGrow={2}>
                                <Table.HeaderCell>University</Table.HeaderCell>
                                <Table.Cell>
                                    {rowData => (
                                        <div className="flex items-center space-x-2">
                                            <Globe size={16} className="text-gray-600" />
                                            <span>{rowData.university}</span>
                                        </div>
                                    )}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column flexGrow={1}>
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.Cell dataKey="universityType" />
                            </Table.Column>

                            <Table.Column flexGrow={1}>
                                <Table.HeaderCell>Tuition Fees</Table.HeaderCell>
                                <Table.Cell dataKey="tuitionFees" />
                            </Table.Column>

                            <Table.Column flexGrow={1}>
                                <Table.HeaderCell>State</Table.HeaderCell>
                                <Table.Cell>
                                    {rowData => (
                                        <div className="flex items-center space-x-2">
                                            <MapPin size={16} className="text-gray-600" />
                                            <span>{rowData.state}</span>
                                        </div>
                                    )}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column flexGrow={1}>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.Cell>
                                    {rowData => (
                                        <Badge
                                            className={`px-2 py-1 text-sm rounded-lg ${rowData.status === 'pending'
                                                    ? 'bg-yellow-200 text-yellow-800'
                                                    : 'bg-green-200 text-green-800'
                                                }`}
                                        >
                                            {rowData.status}
                                        </Badge>
                                    )}
                                </Table.Cell>
                            </Table.Column>

                            <Table.Column flexGrow={2}>
                                <Table.HeaderCell>Created At</Table.HeaderCell>
                                <Table.Cell>
                                    {rowData => new Date(rowData.createdAt).toLocaleString()}
                                </Table.Cell>
                            </Table.Column>
                        </Table>
                    </CardContent>
                </Card> */}
            <div className="grid gap-6 mt-5">
                {previous_applications?.map((application) => (
                    <Card key={application?.id} className="shadow-lg border border-gray-300">
                        <CardHeader className="text-lg font-bold text-blue-800 border-b pb-2">
                            {application?.university} ({application?.universityType})
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 space-y-2">
                                <div className="flex items-center space-x-2 my-2">
                                    <BookOpen size={16} className="text-gray-600" />
                                    <span className="font-semibold">Field of Study:</span>
                                    <span>{application?.fieldOfStudy}</span>
                                </div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="font-semibold">Program Level:</span>
                                    <span>{application?.programLevel}</span>
                                </div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Globe size={16} className="text-gray-600" />
                                    <span className="font-semibold">Country:</span>
                                    <span>{countries[application?.country]?.name}</span>
                                </div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <MapPin size={16} className="text-gray-600" />
                                    <span className="font-semibold">State:</span>
                                    <span>{application?.state}</span>
                                </div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="font-semibold">Tuition Fees:</span>
                                    <span>{application?.tuitionFees}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold">Suggestions:</span>
                                    <Chip variant='flat' color='warning'>
                                        {application?.suggestions}
                                    </Chip>
                                </div>
                                <div>
                                    <Button isDisabled={application?.suggestions == 0} onClick={() => {
                                        navigate("/visa_consultation/" + application?.id)
                                    }} size='sm' color='success' variant='flat' startContent={<Eye className='p-1' />}>View Suggestions</Button>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                Submitted On : {new Date(application?.createdAt).toLocaleString()}
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
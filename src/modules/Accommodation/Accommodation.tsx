import { Button, Card, CardBody, ModalBody, ModalContent, ModalHeader, useDisclosure, Modal, ModalFooter } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { getFromLocal } from '../../utils/localstorage';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CommonConfirmation from '../../components/CommonConfirmation';
import { Carousel } from 'rsuite';
import { BadgeCheck, Building2, Calendar, Clock, DollarSign, DoorClosed, FileCheck, Info, MapPin, Plug, Plus, RefreshCw, School, Sofa, Star, Utensils } from 'lucide-react'
import { FaWheelchair } from 'react-icons/fa';
import { Switch } from "@nextui-org/react";
import { Filter } from "lucide-react";
import { Checkbox } from "@nextui-org/react";
import { Pagination } from "@nextui-org/react";
import { ErrorToast } from '@/utils/Toaster';
import useApiCallUtils from '@/hooks/useApiCallUtils';

interface FilterState {
    [key: string]: boolean;
}

const Accommodation = () => {

    const { commonGetAPICalls, commonPostPublicAPICall } = useApiCallUtils()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [accommodationData, setAccommodationData] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        is_destination_confirmed: false,
        has_specific_move_in_date: false,
        knows_accommodation_duration: false,
        has_fixed_budget: false,
        prefers_private_room: false,
        wants_fully_furnished: false,
        needs_utilities_included: false,
        prefers_near_university_or_work: false,
        requires_accessibility_features: false,
        wants_shared_kitchen_or_meal_plan: false,
        needs_additional_facilities: false,
        has_documents_ready: false,
        wants_student_reviews: false,
        wants_flexible_cancellation: false,
        interested_in_verified_listings: false
    });

    useEffect(() => {
        fetchApiCall()
    }, [])


    // const fetchApiCall = async () => {
    //     const activeFilters = Object.entries(filters)
    //         .filter(([_, value]) => value)
    //         .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    //     const { data, success } = await commonPostPublicAPICall({ ...activeFilters }, "/accommodation/list_public")
    //     if (success && success == true) {
    //         setAccommodationData(data?.data)
    //     }
    // }

    const fetchApiCall = async (page = 1) => {
        const activeFilters = Object.entries(filters)
            .filter(([_, value]) => value)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        const { data, success } = await commonPostPublicAPICall({
            ...activeFilters,
            page: page,
            limit: 30
        }, "/accommodation/list_public")

        if (success && success == true) {
            setAccommodationData(data?.data);
            setTotalPages(data?.totalPages);
            setCurrentPage(data?.currentPage);
        }
    }

    const [selectedItem, setSelectedItem] = useState(null);
    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onOpenChange: onDetailOpenChange } = useDisclosure();


    const questions = [
        { key: 'is_destination_confirmed', label: "Is your destination country and city confirmed?" },
        { key: 'has_specific_move_in_date', label: "Do you have a specific move-in date?" },
        { key: 'knows_accommodation_duration', label: "Do you know how long you’ll need accommodation for?" },
        { key: 'has_fixed_budget', label: "Do you have a fixed monthly budget for accommodation?" },
        { key: 'prefers_private_room', label: "Do you prefer a private room over a shared one?" },
        { key: 'wants_fully_furnished', label: "Are you looking for a fully furnished accommodation option?" },
        { key: 'needs_utilities_included', label: "Do you need utilities (electricity, water, internet) included in the rent?" },
        { key: 'prefers_near_university_or_work', label: "Do you want your accommodation to be within walking distance of your university/workplace?" },
        { key: 'requires_accessibility_features', label: "Do you require accessibility features (for differently-abled individuals)?" },
        { key: 'wants_shared_kitchen_or_meal_plan', label: "Would you like access to a shared kitchen or meal-inclusive plans?" },
        { key: 'needs_additional_facilities', label: "Do you need additional facilities like laundry, gym, or parking?" },
        { key: 'has_documents_ready', label: "Do you have the necessary documents ready, such as ID proof and admission letters?" },
        { key: 'wants_student_reviews', label: "Would you like to see student reviews before making a decision?" },
        { key: 'wants_flexible_cancellation', label: "Do you want flexible cancellation options in case your plans change?" },
        { key: 'interested_in_verified_listings', label: "Are you interested in verified listings from trusted sources?" }
    ];


    const handleFilterChange = (key: string, checked: boolean) => {
        setFilters((prev) => ({
            ...prev,
            [key]: checked,
        }));
    };



    const navigate = useNavigate()
    return (
        <div className=" min-h-screen py-12">
            <section className='container mx-auto my-16 space-y-8'>
                <div className="flex justify-start items-center p-2 sm:px-4 gap-2">
                    <h1 className='text-sm sm:text-4xl font-bold text-gray-800'>
                        Find Your Perfect Accommodation
                    </h1>
                    <Button
                        onPress={() => setFilterOpen(true)}
                        className="bg-orange-500 text-white"
                        size='sm'
                        endContent={<Filter className="w-4 h-4" />}
                    >
                        Filters
                    </Button>
                </div>

                <Modal isOpen={filterOpen} onOpenChange={setFilterOpen} size="2xl" scrollBehavior="inside">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>Filter Accommodations</ModalHeader>
                                <ModalBody>
                                    <div className="space-y-4">
                                        {questions.map((question) => (
                                            <div key={question.key} className="flex gap-2 items-center rounded-lg hover:bg-gray-50">
                                                <Checkbox
                                                    isSelected={filters[question.key]}
                                                    onValueChange={(checked) => handleFilterChange(question.key, checked)}
                                                    color="primary"
                                                    size="sm"
                                                />
                                                <span className="text-sm">{question.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            fetchApiCall(); // Apply filters manually if needed
                                            onClose();
                                        }}
                                    >
                                        Apply Filters
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>


                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 px-4'>
                    {accommodationData?.map((item: any, index: number) => (
                        <Card key={index} className='hover:shadow-xl transition-shadow duration-300'>
                            <CardBody className='p-0'>
                                {JSON.parse(item?.images).length !== 0 &&
                                    <Carousel
                                        autoplay={true}
                                        shape='bar'
                                        autoplayInterval={3000}
                                        className="w-full h-48"
                                    >
                                        {JSON.parse(item?.images)?.map((img: string, i: number) => (
                                            <div key={i} className="h-48">
                                                <img
                                                    src={img}
                                                    alt={`${item.company_name} - ${i}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                }

                                <div className="p-5 space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                        <Building2 className="w-5 h-5" />
                                        {item?.company_name}
                                    </h2>

                                    <p className="text-gray-600 line-clamp-2">
                                        {item?.short_description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {item?.prefers_near_university_or_work && (
                                            <span className="flex items-center gap-1 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                <School className="w-4 h-4" />
                                                Near University
                                            </span>
                                        )}
                                        {item?.wants_fully_furnished && (
                                            <span className="flex items-center gap-1 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                                Furnished
                                            </span>
                                        )}
                                        {item?.wants_shared_kitchen_or_meal_plan && (
                                            <span className="flex items-center gap-1 text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                                <Utensils className="w-4 h-4" />
                                                Share Kitchen Or Meal Plan
                                            </span>
                                        )}
                                    </div>

                                    <Button
                                        className="w-full bg-orange-500 text-white"
                                        onPress={() => {
                                            setSelectedItem(item);
                                            onDetailOpen();
                                        }}
                                        endContent={<Info className="w-4 h-4" />}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}

                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <Pagination
                            total={totalPages}
                            page={currentPage}
                            onChange={(page) => {
                                fetchApiCall(page);
                            }}
                            isCompact
                            initialPage={1}
                            showControls
                            color="primary"
                        />
                    </div>
                )}

                {accommodationData?.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h1 className="text-2xl font-bold text-gray-800">No Accommodation Found</h1>
                        <p className="text-gray-600">
                            We couldn't find any accommodation that matches your search criteria.
                        </p>
                    </div>
                )}

            </section>

            {/* Details Modal */}
            <Modal size="2xl" isOpen={isDetailOpen} onOpenChange={onDetailOpenChange} scrollBehavior='inside'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-xl font-bold">
                                <div>
                                    <h1>{selectedItem?.company_name}</h1>
                                    {JSON.parse(selectedItem?.images).length !== 0 &&
                                        <Carousel
                                            autoplay={true}
                                            shape='bar'
                                            autoplayInterval={3000}
                                            className="w-full h-[30vh] overflow-hidden rounded-lg"
                                        >
                                            {selectedItem && JSON.parse(selectedItem.images).map((img: string, i: number) => (
                                                <div key={i} className="h-[30vh] relative">
                                                    {/* Background image - blurred and stretched */}
                                                    <div
                                                        className="absolute inset-0 bg-blue-100"
                                                        style={{
                                                            backgroundImage: `url(${img})`,
                                                            backgroundPosition: 'center',
                                                            backgroundSize: 'cover',
                                                            filter: 'blur(8px)',
                                                            opacity: '0.3'
                                                        }}
                                                    />
                                                    <img
                                                        src={img}
                                                        alt={`Full view ${i}`}
                                                        className="relative w-full h-full object-scale-down rounded-lg p-4 z-10"
                                                    />
                                                </div>
                                            ))}
                                        </Carousel>
                                    }
                                </div>
                            </ModalHeader>
                            <ModalBody className="space-y-4">


                                <p className="text-gray-700">{selectedItem?.short_description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="col-span-full mb-4">
                                        <h3 className="text-lg font-semibold mb-2">Property Features</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <DetailItem
                                                icon={<Building2 className="w-4 h-4" />}
                                                title="Destination Confirmed"
                                                value={selectedItem?.is_destination_confirmed}
                                            />
                                            <DetailItem
                                                icon={<Calendar className="w-4 h-4" />}
                                                title="Specific Move-in Date"
                                                value={selectedItem?.has_specific_move_in_date}
                                            />
                                            <DetailItem
                                                icon={<Clock className="w-4 h-4" />}
                                                title="Known Duration"
                                                value={selectedItem?.knows_accommodation_duration}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full mb-4">
                                        <h3 className="text-lg font-semibold mb-2">Room & Amenities</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <DetailItem
                                                icon={<DoorClosed className="w-4 h-4" />}
                                                title="Private Room"
                                                value={selectedItem?.prefers_private_room}
                                            />
                                            <DetailItem
                                                icon={<Sofa className="w-4 h-4" />}
                                                title="Fully Furnished"
                                                value={selectedItem?.wants_fully_furnished}
                                            />
                                            <DetailItem
                                                icon={<Plug className="w-4 h-4" />}
                                                title="Utilities Included"
                                                value={selectedItem?.needs_utilities_included}
                                            />
                                            <DetailItem
                                                icon={<School className="w-4 h-4" />}
                                                title="Near University/Work"
                                                value={selectedItem?.prefers_near_university_or_work}
                                            />
                                            <DetailItem
                                                icon={<FaWheelchair className="w-4 h-4" />}
                                                title="Accessibility Features"
                                                value={selectedItem?.requires_accessibility_features}
                                            />
                                            <DetailItem
                                                icon={<Utensils className="w-4 h-4" />}
                                                title="Kitchen/Meal Plan"
                                                value={selectedItem?.wants_shared_kitchen_or_meal_plan}
                                            />
                                            <DetailItem
                                                icon={<Plus className="w-4 h-4" />}
                                                title="Additional Facilities"
                                                value={selectedItem?.needs_additional_facilities}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <DetailItem
                                                icon={<FileCheck className="w-4 h-4" />}
                                                title="Documents Ready"
                                                value={selectedItem?.has_documents_ready}
                                            />
                                            <DetailItem
                                                icon={<Star className="w-4 h-4" />}
                                                title="Student Reviews"
                                                value={selectedItem?.wants_student_reviews}
                                            />
                                            <DetailItem
                                                icon={<RefreshCw className="w-4 h-4" />}
                                                title="Flexible Cancellation"
                                                value={selectedItem?.wants_flexible_cancellation}
                                            />
                                            <DetailItem
                                                icon={<BadgeCheck className="w-4 h-4" />}
                                                title="Verified Listing"
                                                value={selectedItem?.interested_in_verified_listings}
                                            />
                                            <DetailItem
                                                icon={<DollarSign className="w-4 h-4" />}
                                                title="Fixed Budget"
                                                value={selectedItem?.has_fixed_budget}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={async () => {
                                    onClose()

                                    const { data, success } = await commonGetAPICalls(`/accommodation/request_link/${selectedItem?.id}`)
                                    if (success) {
                                        // navigate(`/accommodation/request_link/${data.id}`)
                                        window.open(data?.link, '_blank')
                                    } else {
                                        ErrorToast("Something went wrong!")
                                    }

                                }}>
                                    Visit Website
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

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

const DetailItem = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: boolean }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className={`p-2 rounded-full ${value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <span className={`text-xs ${value ? 'text-green-600' : 'text-red-600'}`}>
                {value ? 'Available' : 'Not Available'}
            </span>
        </div>
    </div>
)

export default Accommodation
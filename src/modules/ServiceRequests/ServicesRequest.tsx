import { Input } from "@/components/ui/input";
import { Button, Select, SelectItem } from "@nextui-org/react";
import useApiCallUtils from "@/hooks/useApiCallUtils";
import { Form, Formik, Field } from "formik";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorToast, SuccessToast } from "@/utils/Toaster";
import ReactFlagsSelect from "react-flags-select";
import AchievementBanner from "../AchievementBanner/AchievementBanner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  Globe,
  Calendar,
  Shield,
  Wifi,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { PRIMARY_COLOR, PRIMARY_COLOR_50, PRIMARY_COLOR_100, PRIMARY_COLOR_200, PRIMARY_COLOR_800, PRIMARY_COLOR_900 } from '@/lib/theme';
import { getAgentId } from "@/utils/config";

const ServicesRequest = () => {
  const { service } = useParams();
  const { commonPostPublicAPICall } = useApiCallUtils();
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);

  const isHealth = service === "health";
  const pageTitle = isHealth ? "Health Insurance Request" : "International E-SIM Request";
  const pageTag = isHealth ? "Student Health Coverage" : "Stay Connected Abroad";
  const pageSubtitle = isHealth
    ? "Get the right health insurance plan for your study abroad journey with expert support."
    : "Request an international e-SIM with the right data plan before you land.";
  const heroImage = isHealth
    ? "https://images.pexels.com/photos/7163955/pexels-photo-7163955.jpeg"
    : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&w=1500&q=80";

  // animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Initial values for Health Insurance form
  const healthInitialValues = {
    name: "",
    email: "",
    phone: "",
    country_of_study_or_travel: "",
    coverage_type: "",
    start_date_of_insurance: "",
    type_of_response: "health",
  };

  // Initial values for E-sim form
  const eSimInitialValues = {
    name: "",
    email: "",
    phone: "",
    country_of_study_or_travel: "",
    coverage_type: "",
    data_requirements: "",
    travel_date: "",
    type_of_response: "data",
  };

  // Validation function
  const validateForm = (formData: any, type: "health" | "data") => {
    const errors: any = {};

    if (!formData.name?.trim()) {
      errors.name = "Please Provide Name";
    }
    if (!formData.email?.trim()) {
      errors.email = "Please Provide Email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please Provide Valid Email";
    }
    if (!formData.phone?.trim()) {
      errors.phone = "Please Provide Phone";
    }
    if (!formData.country_of_study_or_travel?.trim()) {
      errors.country_of_study_or_travel =
        "Please Provide Country of Study or Travel";
    }

    if (type === "health") {
      if (!formData.start_date_of_insurance?.trim()) {
        errors.start_date_of_insurance =
          "Please Provide Start Date of Insurance";
      }
    }

    if (type === "data") {
      if (!formData.data_requirements?.trim()) {
        errors.data_requirements = "Please Provide Data Requirements";
      }
      if (!formData.coverage_type?.trim()) {
        errors.coverage_type = "Please Provide Coverage Type";
      }
    }

    return errors;
  };

  // Health Insurance form submission
  const handleHealthSubmit = async (values: any, { resetForm }: any) => {
    const errors = validateForm(values, "health");
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0] as string;
      ErrorToast(firstError);
      return;
    }

    const { success } = await commonPostPublicAPICall(
      {...values,agent_id:getAgentId()},
      "service_form_requests/add",
      true
    );

    if (success) {
      SuccessToast("Health Insurance request submitted successfully!");
      resetForm();
      setShowThankYouDialog(true);
    }
  };

  // E-sim form submission
  const handleESimSubmit = async (values: any, { resetForm }: any) => {
    const errors = validateForm(values, "data");
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0] as string;
      ErrorToast(firstError);
      return;
    }

    const { success } = await commonPostPublicAPICall(
      {
        ...values,
        start_date_of_insurance: values.travel_date, // Map travel_date to start_date_of_insurance for API
      },
      "service_form_requests/add",
      true
    );

    if (success) {
      SuccessToast("E-sim request submitted successfully!");
      resetForm();
      setShowThankYouDialog(true);
    }
  };

  // ====== FORM COMPONENTS (UI only changed, functionality same) ======
  const HealthInsurance = () => {
    return (
      <div className="w-full flex flex-col">
        <Card className="border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-2xl flex flex-col h-full">
          <CardHeader className="pb-5 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl flex-shrink-0" style={{ background: `linear-gradient(to right, ${PRIMARY_COLOR_50}40, transparent)` }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: PRIMARY_COLOR_50 }}>
                <Shield size={22} style={{ color: PRIMARY_COLOR }} />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Health Insurance Request
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Share your details and our team will suggest the best student
                  health coverage for you.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 md:pt-7 px-4 md:px-6 lg:px-8 pb-0 flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 -mr-3">
            <Formik
              initialValues={healthInitialValues}
              onSubmit={handleHealthSubmit}
            >
              {({ values, setFieldValue, handleSubmit }) => (
                <Form id="health-form" onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-7">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.16em]">
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <User size={16} style={{ color: PRIMARY_COLOR }} />
                          Full Name *
                        </label>
                        <Field
                          as={Input}
                          name="name"
                          placeholder="Enter your full name"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Mail size={16} style={{ color: PRIMARY_COLOR }} />
                          Email Address *
                        </label>
                        <Field
                          as={Input}
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Phone size={16} style={{ color: PRIMARY_COLOR }} />
                        Mobile Number (WhatsApp preferred) *
                      </label>
                      <Field
                        as={Input}
                        name="phone"
                        type="tel"
                        placeholder="Enter your mobile number"
                        className="w-full"
                        onKeyPress={(e: any) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Insurance Details Section */}
                  <div className="space-y-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.16em]">
                      Insurance Details
                    </h3>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Globe size={16} style={{ color: PRIMARY_COLOR }} />
                        Country of Study / Destination *
                      </label>
                      <ReactFlagsSelect
                        selected={values.country_of_study_or_travel}
                        onSelect={(countryCode) =>
                          setFieldValue(
                            "country_of_study_or_travel",
                            countryCode
                          )
                        }
                        placeholder="Select country"
                        searchable
                        className="w-full"
                        selectButtonClassName="w-full h-11 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-left bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Shield size={16} style={{ color: PRIMARY_COLOR }} />
                          Preferred Coverage Type *
                        </label>
                        <Select
                          name="coverage_type"
                          placeholder="Select coverage type"
                          selectedKeys={
                            values.coverage_type ? [values.coverage_type] : []
                          }
                          onSelectionChange={(keys) => {
                            const selectedValue = Array.from(keys)[0] as string;
                            setFieldValue("coverage_type", selectedValue);
                          }}
                          className="w-full"
                        >
                          <SelectItem key="Basic" value="Basic">
                            Basic
                          </SelectItem>
                          <SelectItem key="Comprehensive" value="Comprehensive">
                            Comprehensive
                          </SelectItem>
                          <SelectItem
                            key="Not sure, suggest me"
                            value="Not sure, suggest me"
                          >
                            Not sure, suggest me
                          </SelectItem>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Calendar size={16} style={{ color: PRIMARY_COLOR }} />
                          Start Date of Insurance *
                        </label>
                        <Field
                          as={Input}
                          name="start_date_of_insurance"
                          type="date"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                </Form>
              )}
            </Formik>
            </div>
            <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900/90 pt-4 pb-6 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="submit"
                form="health-form"
                size="lg"
                className="w-full font-semibold text-white"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Submit Health Insurance Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const InternationalSIMCard = () => {
    return (
      <div className="w-full flex flex-col">
        <Card className="border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-2xl flex flex-col h-full">
          <CardHeader className="pb-5 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl flex-shrink-0" style={{ background: `linear-gradient(to right, ${PRIMARY_COLOR_50}40, transparent)` }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: PRIMARY_COLOR_50 }}>
                <Wifi size={22} style={{ color: PRIMARY_COLOR }} />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  E-SIM Request
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Fill in your details to get the right international e-SIM and
                  data plan for your travel.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 md:pt-7 px-4 md:px-6 lg:px-8 pb-0 flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 -mr-3">
            <Formik initialValues={eSimInitialValues} onSubmit={handleESimSubmit}>
              {({ values, setFieldValue, handleSubmit }) => (
                <Form id="esim-form" onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-7">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.16em]">
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <User size={16} style={{ color: PRIMARY_COLOR }} />
                          Full Name *
                        </label>
                        <Field
                          as={Input}
                          name="name"
                          placeholder="Enter your full name"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Mail size={16} style={{ color: PRIMARY_COLOR }} />
                          Email Address *
                        </label>
                        <Field
                          as={Input}
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Phone size={16} style={{ color: PRIMARY_COLOR }} />
                        Mobile Number (WhatsApp preferred) *
                      </label>
                      <Field
                        as={Input}
                        name="phone"
                        type="tel"
                        placeholder="Enter your mobile number"
                        className="w-full"
                        onKeyPress={(e: any) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* E-SIM Details Section */}
                  <div className="space-y-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.16em]">
                      E-SIM Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Globe size={16} style={{ color: PRIMARY_COLOR }} />
                          Country of Travel / Destination *
                        </label>
                        <ReactFlagsSelect
                          selected={values.country_of_study_or_travel}
                          onSelect={(countryCode) =>
                            setFieldValue(
                              "country_of_study_or_travel",
                              countryCode
                            )
                          }
                          placeholder="Select country"
                          searchable
                          className="w-full"
                          selectButtonClassName="w-full h-11 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-left bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Calendar size={16} style={{ color: PRIMARY_COLOR }} />
                          Travel Date (Approx.) *
                        </label>
                        <Field
                          as={Input}
                          name="travel_date"
                          type="date"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Wifi size={16} style={{ color: PRIMARY_COLOR }} />
                          Data Requirement *
                        </label>
                        <Select
                          name="data_requirements"
                          placeholder="Select data requirement"
                          selectedKeys={
                            values.data_requirements
                              ? [values.data_requirements]
                              : []
                          }
                          onSelectionChange={(keys) => {
                            const selectedValue = Array.from(keys)[0] as string;
                            setFieldValue("data_requirements", selectedValue);
                          }}
                          className="w-full"
                        >
                          <SelectItem key="1GB–5GB" value="1GB–5GB">
                            1GB–5GB
                          </SelectItem>
                          <SelectItem key="5GB–10GB" value="5GB–10GB">
                            5GB–10GB
                          </SelectItem>
                          <SelectItem key="Unlimited" value="Unlimited">
                            Unlimited
                          </SelectItem>
                          <SelectItem
                            key="Not sure, suggest me"
                            value="Not sure, suggest me"
                          >
                            Not sure, suggest me
                          </SelectItem>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <MapPin size={16} style={{ color: PRIMARY_COLOR }} />
                          Coverage Type *
                        </label>
                        <Select
                          name="coverage_type"
                          placeholder="Select coverage type"
                          selectedKeys={
                            values.coverage_type ? [values.coverage_type] : []
                          }
                          onSelectionChange={(keys) => {
                            const selectedValue = Array.from(keys)[0] as string;
                            setFieldValue("coverage_type", selectedValue);
                          }}
                          className="w-full"
                        >
                          <SelectItem key="Local" value="Local">
                            Local
                          </SelectItem>
                          <SelectItem key="Regional" value="Regional">
                            Regional
                          </SelectItem>
                          <SelectItem key="Global" value="Global">
                            Global
                          </SelectItem>
                          <SelectItem
                            key="Not sure, suggest me"
                            value="Not sure, suggest me"
                          >
                            Not sure, suggest me
                          </SelectItem>
                        </Select>
                      </div>
                    </div>
                  </div>

                </Form>
              )}
            </Formik>
            </div>
            <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900/90 pt-4 pb-6 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="submit"
                form="esim-form"
                size="lg"
                className="w-full font-semibold text-white"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Submit E-SIM Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // ====== PAGE LAYOUT (form on left, banner on right) ======
  return (
    <motion.div
      className="min-h-screen w-full bg-gray-100 dark:bg-gray-900"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Hero Banner Section */}
      <div className="relative w-full overflow-hidden mb-8 md:mb-12">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="relative w-full h-[100px] sm:h-[110px] md:h-[130px] lg:h-[150px] xl:h-[170px] bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{
            backgroundImage: `linear-gradient(135deg, ${PRIMARY_COLOR}dd 0%, ${PRIMARY_COLOR_800}dd 50%, ${PRIMARY_COLOR_900}dd 100%), url('${heroImage}')`,
            backgroundBlendMode: 'overlay',
            backgroundColor: PRIMARY_COLOR
          }}
        >
          {/* Animated Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-90 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${PRIMARY_COLOR}cc 0%, ${PRIMARY_COLOR_800}cc 50%, ${PRIMARY_COLOR_900}cc 100%)`
            }}
          />
          
          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-4xl w-full text-center">
              {/* Icon Badge */}
              <div className="flex justify-center mb-1">
                <div 
                  className="p-1 sm:p-1.5 rounded-md backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110"
                  style={{ 
                    backgroundColor: `${PRIMARY_COLOR_50}40`,
                    border: `1.5px solid ${PRIMARY_COLOR_200}`
                  }}
                >
                  {isHealth ? (
                    <Shield size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 hover:rotate-6" style={{ color: '#ffffff' }} />
                  ) : (
                    <Wifi size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 hover:rotate-6" style={{ color: '#ffffff' }} />
                  )}
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-0.5 sm:mb-1 drop-shadow-2xl leading-tight">
                {pageTitle}
              </h1>
              
              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-white/90 mb-1 max-w-2xl mx-auto drop-shadow-lg">
                {pageSubtitle}
              </p>
              
              {/* Tag Badge */}
              <div className="flex justify-center mt-2">
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md shadow-lg"
                  style={{ 
                    backgroundColor: `${PRIMARY_COLOR_50}30`,
                    border: `1px solid ${PRIMARY_COLOR_200}80`
                  }}
                >
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    {pageTag}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg 
              className="w-full h-3 sm:h-4 md:h-5 lg:h-6" 
              viewBox="0 0 1440 120" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path 
                d="M0,120 L48,105 C96,90 192,60 288,45 C384,30 480,30 576,37.5 C672,45 768,60 864,67.5 C960,75 1056,75 1152,67.5 C1248,60 1344,45 1392,37.5 L1440,30 L1440,120 L1392,120 C1344,120 1248,120 1152,120 C1056,120 960,120 864,120 C768,120 672,120 576,120 C480,120 384,120 288,120 C192,120 96,120 48,120 L0,120 Z" 
                fill="white" 
                className="dark:fill-gray-900"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">

        {/* MAIN CONTENT ROW */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDE - FORM */}
          <motion.div 
            className="lg:w-2/3"
            variants={fadeUp}
          >
            {isHealth ? <HealthInsurance /> : <InternationalSIMCard />}
          </motion.div>

          {/* RIGHT SIDE - BANNER */}
          <motion.aside 
            className="lg:w-1/3 lg:pl-6"
            variants={fadeUp}
          >
            <div className="sticky top-24">
              <div className="relative h-36 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={heroImage}
                  alt="Student Service"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pageTitle}</h3>
                  <p className="text-gray-200 text-sm">{pageSubtitle}</p>
                </div>
              </div>
              
              <Card className="mt-6 border-none bg-white/80 dark:bg-gray-900/90 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="py-4 px-4">
                  <AchievementBanner
                    target_type={isHealth ? "health_ins" : "sim_card"}
                  />
                </CardContent>
              </Card>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* Thank You Dialog */}
      <Dialog open={showThankYouDialog} onOpenChange={setShowThankYouDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Thank You for Your Inquiry!
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Our team will connect with you soon.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ServicesRequest;

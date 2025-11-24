import { Input } from "@/components/ui/input";
import { Button, Select, SelectItem } from "@nextui-org/react";
import useApiCallUtils from "@/hooks/useApiCallUtils";
import { Form, Formik, Field } from "formik";
import React from "react";
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
  User,
  Mail,
  Phone,
  Globe,
  Calendar,
  Shield,
  Wifi,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const ServicesRequest = () => {
  const { service } = useParams();
  const { commonPostPublicAPICall } = useApiCallUtils();

  const isHealth = service === "health";
  const pageTitle = isHealth ? "Health Insurance Request" : "International E-SIM Request";
  const pageTag = isHealth ? "Student Health Coverage" : "Stay Connected Abroad";
  const pageSubtitle = isHealth
    ? "Get the right health insurance plan for your study abroad journey with expert support."
    : "Request an international e-SIM with the right data plan before you land.";
  const heroImage = isHealth
    ? "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&w=1500&q=80"
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
      values,
      "service_form_requests/add",
      true
    );

    if (success) {
      SuccessToast("Health Insurance request submitted successfully!");
      resetForm();
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
    }
  };

  // ====== FORM COMPONENTS (UI only changed, functionality same) ======
  const HealthInsurance = () => {
    return (
      <div className="w-full h-full flex flex-col">
        <Card className="border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-2xl flex flex-col h-full">
          <CardHeader className="pb-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary/5 to-transparent rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Shield size={22} />
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
                          <User size={16} className="text-primary" />
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
                          <Mail size={16} className="text-primary" />
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
                        <Phone size={16} className="text-primary" />
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
                        <Globe size={16} className="text-primary" />
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
                          <Shield size={16} className="text-primary" />
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
                          <Calendar size={16} className="text-primary" />
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
                color="primary"
                size="lg"
                className="w-full font-semibold"
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
      <div className="w-full h-full flex flex-col">
        <Card className="border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-2xl flex flex-col h-full">
          <CardHeader className="pb-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary/5 to-transparent rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Wifi size={22} />
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
                          <User size={16} className="text-primary" />
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
                          <Mail size={16} className="text-primary" />
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
                        <Phone size={16} className="text-primary" />
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
                          <Globe size={16} className="text-primary" />
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
                          selectButtonClassName="w-full h-11 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-left bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Calendar size={16} className="text-primary" />
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
                          <Wifi size={16} className="text-primary" />
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
                          <MapPin size={16} className="text-primary" />
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
                color="primary"
                size="lg"
                className="w-full font-semibold"
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
      className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-10 py-8 md:py-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-7xl mx-auto">
        {/* TITLE ROW */}
        <motion.div className="mb-8 md:mb-12" variants={fadeUp}>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
            {pageTag}
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {pageTitle}
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
            {pageSubtitle}
          </p>
        </motion.div>

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
              <div className="relative h-64 md:h-80 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={heroImage}
                  alt="Student Service"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6">
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
    </motion.div>
  );
};

export default ServicesRequest;

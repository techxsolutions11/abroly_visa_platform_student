import { Input } from "@/components/ui/input";
import { Button, Select, SelectItem } from "@nextui-org/react";
import useApiCallUtils from "@/hooks/useApiCallUtils";
import { Form, Formik, Field } from "formik";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorToast, SuccessToast } from "@/utils/Toaster";
import ReactFlagsSelect from "react-flags-select";
import AchievementBanner from "../AchievementBanner/AchievementBanner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Phone, Globe, Calendar, Shield, Wifi, MapPin } from "lucide-react";

const ServicesRequest = () => {
  const { service } = useParams();
  const { commonPostPublicAPICall } = useApiCallUtils();

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

    const { success, data, message } = await commonPostPublicAPICall(
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

    const { success, data, message } = await commonPostPublicAPICall(
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

  const HealthInsurance = () => {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
          <CardHeader className="pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={24} className="text-primary" />
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Health Insurance Request
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Fill in your details to request health insurance coverage
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Formik
              initialValues={healthInitialValues}
              onSubmit={handleHealthSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
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
                          setFieldValue("country_of_study_or_travel", countryCode)
                        }
                        placeholder="Select country"
                        searchable
                        className="w-full"
                        selectButtonClassName="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-left bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      className="w-full font-semibold"
                    >
                      Submit Health Insurance Request
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    );
  };
  const InternationalSIMCard = () => {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
          <CardHeader className="pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Wifi size={24} className="text-primary" />
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                E-SIM Request
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Fill in your details to request an international E-SIM card
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Formik initialValues={eSimInitialValues} onSubmit={handleESimSubmit}>
              {({ values, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                      E-SIM Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Globe size={16} className="text-primary" />
                          Country of Travel / Destination *
                        </label>
                        <ReactFlagsSelect
                          selected={values.country_of_study_or_travel}
                          onSelect={(countryCode) =>
                            setFieldValue("country_of_study_or_travel", countryCode)
                          }
                          placeholder="Select country"
                          searchable
                          className="w-full"
                          selectButtonClassName="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-left bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary focus:ring-1 focus:ring-primary"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Wifi size={16} className="text-primary" />
                          Data Requirement *
                        </label>
                        <Select
                          name="data_requirements"
                          placeholder="Select data requirement"
                          selectedKeys={
                            values.data_requirements ? [values.data_requirements] : []
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

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      className="w-full font-semibold"
                    >
                      Submit E-SIM Request
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-4">
      <section className="col-span-3">
        {(service == "health" && <HealthInsurance />) ||
          (service == "data" && <InternationalSIMCard />)}
      </section>
      <section className="col-span-1 h-full items-center">
        <AchievementBanner
          target_type={service == "health" ? "health_ins" : "sim_card"}
        />
      </section>
    </div>
  );
};

export default ServicesRequest;

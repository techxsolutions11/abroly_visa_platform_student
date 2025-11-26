import useApiCallUtils from "@/hooks/useApiCallUtils";
import { Spinner, Button, Checkbox } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  MapPin,
  Building2,
  GraduationCap,
  Calendar,
  BookOpen,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import moment from "moment";
import fetchQueriesHook from "@/hooks/fetchQueriesHook";
import { countries } from "country-data";

const VisaConsultationDetails = () => {
  const queryClient = fetchQueriesHook();
  const navigate = useNavigate();
  const { commonGetAPICalls, commonPostAPICall } = useApiCallUtils();
  const { id } = useParams();
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState<number[]>([]); // Changed to array
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchSuggestions = async () => {
    const { data, success } = await commonGetAPICalls(
      `/leads/get_suggestions?id=${id}`
    );
    if (success) return data;
    throw new Error("Failed to fetch suggestions.");
  };

  const { data, isFetching } = useQuery({
    queryKey: ["fetchSuggestions", id],
    queryFn: fetchSuggestions,
  });

  const handleContinueWithSuggestions = async (
    selectedLead,
    selectedIndexes: number[]
  ): Promise<void> => {
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
    mutationFn: () =>
      handleContinueWithSuggestions(selectedLead, selectedSuggestions),
    onSuccess: () => {
      queryClient(["fetchSuggestions", id]);
      queryClient(["coins_balance"]);
      setSelectedSuggestions([]);
      setSelectedLead(null);
      setIsDrawerOpen(false);
      navigate("/accepted_applications");
    },
  });

  // Toggle selection of suggestions
  const toggleSuggestion = (index: number) => {
    setSelectedSuggestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#ab0d0d] to-[#c41e1e] text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Visa Consultation Suggestions
            </h1>
          </div>
          <p className="text-white/90 text-lg mt-2">
            Review and select your preferred recommendations from our expert
            agents
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Lead Cards */}
          <div className="w-full lg:w-1/3 space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Available Agents
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click on an agent card to view their suggestions
              </p>
            </div>
            {isFetching ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : data && data.length > 0 ? (
              data.map((lead) => (
                <Card
                  key={lead.id}
                  onClick={() => {
                    setSelectedLead(lead);
                    setIsDrawerOpen(true);
                  }}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group ${
                    selectedLead?.id === lead.id
                      ? "border-[#ab0d0d] border-2 shadow-xl bg-gradient-to-br from-[#ab0d0d]/5 to-white dark:from-[#ab0d0d]/10 dark:to-gray-800"
                      : "border-gray-200 dark:border-gray-700 hover:border-[#ab0d0d]/50"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            selectedLead?.id === lead.id
                              ? "bg-[#ab0d0d] text-white"
                              : "bg-[#ab0d0d]/10 text-[#ab0d0d]"
                          } transition-colors`}
                        >
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                            {lead.lead_of.username}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">
                              {moment
                                .duration(moment().diff(lead?.updatedAt))
                                .asWeeks() >= 1
                                ? `${Math.floor(
                                    moment
                                      .duration(moment().diff(lead?.updatedAt))
                                      .asWeeks()
                                  )} week${
                                    Math.floor(
                                      moment
                                        .duration(
                                          moment().diff(lead?.updatedAt)
                                        )
                                        .asWeeks()
                                    ) > 1
                                      ? "s"
                                      : ""
                                  } ago`
                                : moment
                                    .duration(moment().diff(lead?.updatedAt))
                                    .asDays() >= 1
                                ? `${Math.floor(
                                    moment
                                      .duration(moment().diff(lead?.updatedAt))
                                      .asDays()
                                  )} day${
                                    Math.floor(
                                      moment
                                        .duration(
                                          moment().diff(lead?.updatedAt)
                                        )
                                        .asDays()
                                    ) > 1
                                      ? "s"
                                      : ""
                                  } ago`
                                : moment
                                    .duration(moment().diff(lead?.updatedAt))
                                    .asHours() >= 1
                                ? `${Math.floor(
                                    moment
                                      .duration(moment().diff(lead?.updatedAt))
                                      .asHours()
                                  )} hour${
                                    Math.floor(
                                      moment
                                        .duration(
                                          moment().diff(lead?.updatedAt)
                                        )
                                        .asHours()
                                    ) > 1
                                      ? "s"
                                      : ""
                                  } ago`
                                : moment
                                    .duration(moment().diff(lead?.updatedAt))
                                    .asMinutes() >= 1
                                ? `${Math.floor(
                                    moment
                                      .duration(moment().diff(lead?.updatedAt))
                                      .asMinutes()
                                  )} minute${
                                    Math.floor(
                                      moment
                                        .duration(
                                          moment().diff(lead?.updatedAt)
                                        )
                                        .asMinutes()
                                    ) > 1
                                      ? "s"
                                      : ""
                                  } ago`
                                : "Just now"}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      {selectedLead?.id === lead.id && (
                        <CheckCircle2 className="w-5 h-5 text-[#ab0d0d]" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-[#ab0d0d]/10 dark:bg-[#ab0d0d]/20">
                      <Sparkles className="w-4 h-4 text-[#ab0d0d]" />
                      <span className="text-sm font-semibold text-[#ab0d0d]">
                        {JSON.parse(lead.suggestions).length}{" "}
                        {JSON.parse(lead.suggestions).length === 1
                          ? "Suggestion"
                          : "Suggestions"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No suggestions available at the moment.
                </p>
              </Card>
            )}
          </div>

          {/* Right Panel - Info/Empty State */}
          {!selectedLead && !isDrawerOpen && (
            <div className="w-full lg:w-2/3">
              <Card className="p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-[#ab0d0d]/10">
                    <Sparkles className="w-12 h-12 text-[#ab0d0d]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Select an Agent
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Choose an agent from the left panel to view their
                    personalized visa consultation suggestions
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Drawer - Suggestions Details */}
      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="bottom"
        onClose={() => {
          setSelectedSuggestions([]);
          setSelectedLead(null);
        }}
      >
        <DrawerContent className="h-[90vh] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="bg-gradient-to-r from-[#ab0d0d] to-[#c41e1e] text-white">
            <DrawerHeader className="border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <DrawerTitle className="text-2xl font-bold">
                    Suggestions Details
                  </DrawerTitle>
                </div>
              </div>
            </DrawerHeader>
          </div>
          <div className="p-6 overflow-y-auto">
            {selectedLead ? (
              <div className="max-w-7xl mx-auto">
                {/* Agent Info Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-xl border-2 border-[#ab0d0d]/20 dark:border-[#ab0d0d]/30 relative overflow-hidden">
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ab0d0d] to-[#c41e1e]"></div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#ab0d0d]/20 to-[#ab0d0d]/10 border-2 border-[#ab0d0d]/30 shadow-md">
                        <User className="w-8 h-8 text-[#ab0d0d]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Suggestions from {selectedLead?.lead_of?.username}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Sparkles className="w-4 h-4 text-[#ab0d0d]" />
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {JSON.parse(selectedLead?.suggestions).length}{" "}
                            {JSON.parse(selectedLead?.suggestions).length === 1
                              ? "recommendation"
                              : "recommendations"}{" "}
                            available
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        window.open(
                          `/agent_profile/${selectedLead?.id}`,
                          "_blank"
                        )
                      }
                      size="md"
                      className="bg-[#ab0d0d] hover:bg-[#c41e1e] active:bg-[#8a0a0a] text-white font-semibold transition-all shadow-lg hover:shadow-xl border-2 border-[#ab0d0d] hover:border-[#c41e1e]"
                      startContent={<User className="w-4 h-4" />}
                    >
                      View Agent Profile
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-gradient-to-r from-[#ab0d0d]/10 via-[#ab0d0d]/5 to-[#ab0d0d]/10 dark:from-[#ab0d0d]/20 dark:via-[#ab0d0d]/10 dark:to-[#ab0d0d]/20 border-2 border-[#ab0d0d]/30 rounded-xl p-5 mb-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#ab0d0d] text-white flex-shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        <span className="font-bold text-[#ab0d0d]">
                          Important:
                        </span>{" "}
                        Select Your Preferred Options
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Please select at least one suggestion to continue with
                        your visa consultation process. You can select multiple
                        options if needed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Suggestions Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {JSON.parse(selectedLead?.suggestions).map(
                    (suggestion: any, index: number) => (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group relative overflow-hidden ${
                          selectedSuggestions.includes(index)
                            ? "border-[#ab0d0d] border-[3px] shadow-2xl bg-gradient-to-br from-[#ab0d0d]/10 via-white to-[#ab0d0d]/5 dark:from-[#ab0d0d]/20 dark:via-gray-800 dark:to-[#ab0d0d]/10 ring-2 ring-[#ab0d0d]/20"
                            : "border-2 border-gray-300 dark:border-gray-600 hover:border-[#ab0d0d] hover:shadow-lg"
                        }`}
                        onClick={() => toggleSuggestion(index)}
                      >
                        {/* Top Border Accent */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 ${
                            selectedSuggestions.includes(index)
                              ? "bg-[#ab0d0d]"
                              : "bg-gray-300 dark:bg-gray-600 group-hover:bg-[#ab0d0d]"
                          } transition-colors`}
                        ></div>

                        {/* Selection Indicator */}
                        {selectedSuggestions.includes(index) && (
                          <div className="absolute top-3 right-3 p-2 rounded-full bg-[#ab0d0d] text-white shadow-lg animate-pulse">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        )}

                        <CardContent className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2.5 rounded-xl shadow-md transition-all ${
                                  selectedSuggestions.includes(index)
                                    ? "bg-[#ab0d0d] text-white"
                                    : "bg-[#ab0d0d]/10 text-[#ab0d0d] group-hover:bg-[#ab0d0d]/20"
                                }`}
                              >
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                  Option #{index + 1}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Recommendation
                                </p>
                              </div>
                            </div>
                            <Checkbox
                              isSelected={selectedSuggestions.includes(index)}
                              onValueChange={() => toggleSuggestion(index)}
                              classNames={{
                                base: "cursor-pointer",
                                wrapper: selectedSuggestions.includes(index)
                                  ? "after:bg-[#ab0d0d] after:text-white border-[#ab0d0d]"
                                  : "border-gray-300",
                              }}
                              size="lg"
                            />
                          </div>

                          {/* Details Grid */}
                          <div className="space-y-3">
                            <div
                              className={`p-4 rounded-xl border-2 transition-all ${
                                selectedSuggestions.includes(index)
                                  ? "border-[#ab0d0d]/30 bg-[#ab0d0d]/5 dark:bg-[#ab0d0d]/10"
                                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                              }`}
                            >
                              <p className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 mb-1">
                                <MapPin
                                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                    selectedSuggestions.includes(index)
                                      ? "text-[#ab0d0d]"
                                      : "text-gray-500"
                                  }`}
                                />
                                <span>
                                  <strong className="text-gray-900 dark:text-white">
                                    Country:
                                  </strong>{" "}
                                  {countries[suggestion?.country || "IN"]
                                    ?.name || "Not specified"}
                                </span>
                              </p>
                              {suggestion?.state && (
                                <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 ml-6 mt-1">
                                  <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <span>
                                    <strong>State:</strong> {suggestion.state}
                                  </span>
                                </p>
                              )}
                            </div>

                            <div
                              className={`p-4 rounded-xl border-2 transition-all ${
                                selectedSuggestions.includes(index)
                                  ? "border-[#ab0d0d]/30 bg-[#ab0d0d]/5 dark:bg-[#ab0d0d]/10"
                                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                              }`}
                            >
                              <p className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 mb-1">
                                <Building2
                                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                    selectedSuggestions.includes(index)
                                      ? "text-[#ab0d0d]"
                                      : "text-gray-500"
                                  }`}
                                />
                                <span>
                                  <strong className="text-gray-900 dark:text-white">
                                    University:
                                  </strong>{" "}
                                  {suggestion?.university || "Not specified"}
                                </span>
                              </p>
                              {suggestion?.universityType && (
                                <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 ml-6 mt-1">
                                  <span>
                                    <strong>Type:</strong>{" "}
                                    {suggestion.universityType}
                                  </span>
                                </p>
                              )}
                            </div>

                            <div
                              className={`p-4 rounded-xl border-2 transition-all ${
                                selectedSuggestions.includes(index)
                                  ? "border-[#ab0d0d]/30 bg-[#ab0d0d]/5 dark:bg-[#ab0d0d]/10"
                                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                              }`}
                            >
                              <p className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <GraduationCap
                                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                    selectedSuggestions.includes(index)
                                      ? "text-[#ab0d0d]"
                                      : "text-gray-500"
                                  }`}
                                />
                                <span>
                                  <strong className="text-gray-900 dark:text-white">
                                    Program:
                                  </strong>{" "}
                                  {suggestion?.programLevel || "Not specified"}
                                </span>
                              </p>
                            </div>

                            <div
                              className={`p-4 rounded-xl border-2 transition-all ${
                                selectedSuggestions.includes(index)
                                  ? "border-[#ab0d0d]/30 bg-[#ab0d0d]/5 dark:bg-[#ab0d0d]/10"
                                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                              }`}
                            >
                              <p className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <BookOpen
                                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                    selectedSuggestions.includes(index)
                                      ? "text-[#ab0d0d]"
                                      : "text-gray-500"
                                  }`}
                                />
                                <span>
                                  <strong className="text-gray-900 dark:text-white">
                                    Field:
                                  </strong>{" "}
                                  {suggestion?.fieldOfStudy || "Not specified"}
                                </span>
                              </p>
                            </div>

                            {suggestion?.intakeMonth &&
                              suggestion?.intakeYear && (
                                <div
                                  className={`p-4 rounded-xl border-2 transition-all ${
                                    selectedSuggestions.includes(index)
                                      ? "border-[#ab0d0d]/30 bg-[#ab0d0d]/5 dark:bg-[#ab0d0d]/10"
                                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                                  }`}
                                >
                                  <p className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <Calendar
                                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                        selectedSuggestions.includes(index)
                                          ? "text-[#ab0d0d]"
                                          : "text-gray-500"
                                      }`}
                                    />
                                    <span>
                                      <strong className="text-gray-900 dark:text-white">
                                        Intake:
                                      </strong>{" "}
                                      {suggestion.intakeMonth}{" "}
                                      {suggestion.intakeYear}
                                    </span>
                                  </p>
                                </div>
                              )}

                            {suggestion?.tuitionFees && (
                              <div
                                className={`p-4 rounded-xl border-2 transition-all ${
                                  selectedSuggestions.includes(index)
                                    ? "border-[#ab0d0d]/30 bg-[#ab0d0d]/5 dark:bg-[#ab0d0d]/10"
                                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                                }`}
                              >
                                <p className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                  <DollarSign
                                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                      selectedSuggestions.includes(index)
                                        ? "text-[#ab0d0d]"
                                        : "text-gray-500"
                                    }`}
                                  />
                                  <span>
                                    <strong className="text-gray-900 dark:text-white">
                                      Tuition:
                                    </strong>{" "}
                                    {suggestion.tuitionFees}
                                  </span>
                                </p>
                              </div>
                            )}

                            {suggestion?.course_program_name && (
                              <div
                                className={`p-4 rounded-xl border-2 transition-all ${
                                  selectedSuggestions.includes(index)
                                    ? "border-[#ab0d0d]/30 bg-[#ab0d0d]/5 dark:bg-[#ab0d0d]/10"
                                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                                }`}
                              >
                                <p className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                  <FileText
                                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                      selectedSuggestions.includes(index)
                                        ? "text-[#ab0d0d]"
                                        : "text-gray-500"
                                    }`}
                                  />
                                  <span>
                                    <strong className="text-gray-900 dark:text-white">
                                      Course:
                                    </strong>{" "}
                                    {suggestion.course_program_name}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>

                {/* Continue Button - Sticky */}
                {selectedSuggestions.length > 0 && (
                  <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t-[3px] border-[#ab0d0d] shadow-[0_-8px_30px_rgba(171,13,13,0.2)] dark:shadow-[0_-8px_30px_rgba(171,13,13,0.3)] p-6 -mx-6 -mb-6 mt-6">
                    <div className="max-w-7xl mx-auto">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                          <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                            <CheckCircle2 className="w-5 h-5 text-[#ab0d0d]" />
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                              {selectedSuggestions.length}{" "}
                              {selectedSuggestions.length === 1
                                ? "Option"
                                : "Options"}{" "}
                              Selected
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ready to proceed with your selection
                          </p>
                        </div>
                        <Button
                          onClick={() => continueWithSelectedOptions.mutate()}
                          className="w-full sm:w-auto bg-[#ab0d0d] hover:bg-[#c41e1e] active:bg-[#8a0a0a] text-white font-bold px-10 py-7 text-lg transition-all shadow-xl hover:shadow-2xl border-2 border-[#ab0d0d] hover:border-[#c41e1e] transform hover:scale-105 active:scale-100"
                          size="lg"
                          startContent={<CheckCircle2 className="w-5 h-5" />}
                        >
                          Continue With {selectedSuggestions.length} Selected{" "}
                          {selectedSuggestions.length === 1
                            ? "Option"
                            : "Options"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Select a lead to view suggestions.
                  </p>
                </div>
              </div>
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

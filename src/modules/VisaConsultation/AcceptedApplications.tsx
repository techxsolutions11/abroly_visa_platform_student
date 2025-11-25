import { commonGetAPICalls } from "@/utils/ApiCallUtils";
import { Button, Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, School, DollarSign, User, ExternalLink, ArrowRight, FileCheck, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { countries } from 'country-data'
import moment from "moment";

const AcceptedApplications = () => {
  const fetchSuggestions = async () => {
    const { data, success } = await commonGetAPICalls(`/leads/user_accepted_leads`);
    if (success) return data;
    throw new Error("Failed to fetch suggestions.");
  };

  const { data, isFetching } = useQuery({
    queryKey: ["accepted_applications"],
    queryFn: fetchSuggestions,
  });

  const navigate = useNavigate();

  const isWithdrawn = (status: string) => {
    return status === "withdrawn" || status === "withdrawn_by_student";
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
              <CheckCircle2 size={24} className="text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Accepted Applications
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg ml-11">
            Track and manage your accepted visa consultation applications
          </p>
        </div>

        {/* Loading State */}
        {isFetching ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="lg" />
              <p className="text-gray-600 dark:text-gray-400">Loading your applications...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Applications List */}
            {data && data.length > 0 ? (
              <div className="grid gap-4 md:gap-6">
                {data.map((item: any) => {
                  const details = JSON.parse(item.selected_suggestion);
                  const withdrawn = isWithdrawn(item?.status);

                  return (
                    <Card
                      key={item.id}
                      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl border ${
                        withdrawn
                          ? "opacity-75 border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/20"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                      }`}
                    >
                      <CardContent className="p-6">
                        {/* Header Section */}
                        <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                                <School size={18} className="text-primary" />
                              </div>
                              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {details.university}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 ml-11">
                              <User size={14} className="text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Agent: {item.lead_of.username}
                              </span>
                            </div>
                          </div>
                          {/* Status Badge */}
                          {withdrawn && (
                            <Badge
                              variant="destructive"
                              className="bg-red-500 text-white shadow-lg flex-shrink-0"
                            >
                              Withdrawn
                            </Badge>
                          )}
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {/* Location */}
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Location
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {details.state}, {countries[details?.country]?.name || details?.country}
                              </p>
                            </div>
                          </div>

                          {/* Program Level */}
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <School size={18} className="text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Program Level
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {details.programLevel}
                              </p>
                            </div>
                          </div>

                          {/* Intake */}
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <Calendar size={18} className="text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Intake
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {details.intakeMonth} {details.intakeYear}
                              </p>
                            </div>
                          </div>

                          {/* Tuition Fees */}
                          {details.tuitionFees && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                              <DollarSign size={18} className="text-primary mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                  Tuition Fees
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  {details.tuitionFees}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Field of Study */}
                          {details.fieldOfStudy && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 md:col-span-2">
                              <div className="flex-1">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                  Field of Study
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  {details.fieldOfStudy}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer Section with Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <Button
                              onClick={() => {
                                window.open(`/agent_profile/${item?.id}`, "_blank");
                              }}
                              size="sm"
                              variant="bordered"
                              className="w-full sm:w-auto border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                              startContent={<User size={16} />}
                              endContent={<ExternalLink size={14} />}
                            >
                              View Agent Profile
                            </Button>
                            <Button
                              onClick={() => {
                                navigate("/accepted_applications/" + item.id);
                              }}
                              size="sm"
                              color="primary"
                              variant="solid"
                              className="w-full sm:w-auto"
                              endContent={<ArrowRight size={16} />}
                              isDisabled={withdrawn}
                            >
                              View Progress
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">Last Updated: {moment(item?.updatedAt).format('DD/MM/YYYY HH:mm')}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              // Empty State
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
                    <FileCheck className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    No Accepted Applications
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    You don't have any accepted applications yet. Once you accept a suggestion from an agent, it will appear here.
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AcceptedApplications;

import { commonGetAPICalls } from "@/utils/ApiCallUtils";
import { Button, Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, School, DollarSign, User, ExternalLink, ArrowRight, FileCheck, CheckCircle2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { countries } from 'country-data'
import moment from "moment";
import { PRIMARY_COLOR, PRIMARY_COLOR_50, PRIMARY_COLOR_100, PRIMARY_COLOR_200, PRIMARY_COLOR_800, PRIMARY_COLOR_900 } from '@/lib/theme';

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
    <div className="w-full min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative w-full overflow-hidden mb-8 md:mb-12">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="relative w-full h-[100px] sm:h-[110px] md:h-[130px] lg:h-[150px] xl:h-[170px] bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{
            backgroundImage: `linear-gradient(135deg, ${PRIMARY_COLOR}dd 0%, ${PRIMARY_COLOR_800}dd 50%, ${PRIMARY_COLOR_900}dd 100%), url('https://images.pexels.com/photos/7009468/pexels-photo-7009468.jpeg')`,
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
                  <CheckCircle2 size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 hover:rotate-6" style={{ color: '#ffffff' }} />
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-0.5 sm:mb-1 drop-shadow-2xl leading-tight">
                Accepted Applications
              </h1>
              
              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-white/90 mb-1 max-w-2xl mx-auto drop-shadow-lg">
                Track and manage your accepted visa consultation applications
              </p>
              
              {/* Stats Badge */}
              {data && data.length > 0 && (
                <div className="flex justify-center mt-2">
                  <div 
                    className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md shadow-lg"
                    style={{ 
                      backgroundColor: `${PRIMARY_COLOR_50}30`,
                      border: `1px solid ${PRIMARY_COLOR_200}80`
                    }}
                  >
                    <TrendingUp size={16} className="sm:w-4 sm:h-4" style={{ color: '#ffffff' }} />
                    <span className="text-white font-semibold text-xs sm:text-sm">
                      Total Applications: <span className="font-bold">{data.length}</span>
                    </span>
                  </div>
                </div>
              )}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Loading State */}
        {isFetching ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="lg" style={{ color: PRIMARY_COLOR }} />
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
                              <div className="p-2 rounded-lg" style={{ backgroundColor: PRIMARY_COLOR_50 }}>
                                <School size={18} style={{ color: PRIMARY_COLOR }} />
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
                            <MapPin size={18} style={{ color: PRIMARY_COLOR }} className="mt-0.5 flex-shrink-0" />
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
                            <School size={18} style={{ color: PRIMARY_COLOR }} className="mt-0.5 flex-shrink-0" />
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
                            <Calendar size={18} style={{ color: PRIMARY_COLOR }} className="mt-0.5 flex-shrink-0" />
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
                              <DollarSign size={18} style={{ color: PRIMARY_COLOR }} className="mt-0.5 flex-shrink-0" />
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
                              variant="solid"
                              className="w-full sm:w-auto text-white"
                              style={{ backgroundColor: PRIMARY_COLOR }}
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

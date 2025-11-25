import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import { 
  User, Mail, Phone, Globe, Building, MapPin, BookOpen, Briefcase, 
  CheckCircle, XCircle, Clock, Share2, MessageCircle, Info, Award,
  GraduationCap, Plane, FileText, DollarSign, Languages, Building2,
  Heart, Briefcase as Work, Calendar
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { countries } from 'country-data';
import { PRIMARY_COLOR, PRIMARY_COLOR_50, PRIMARY_COLOR_100, PRIMARY_COLOR_200, PRIMARY_COLOR_800, PRIMARY_COLOR_900 } from '@/lib/theme';
import { Spinner as NextUISpinner } from '@nextui-org/react';

const AgentProfile = () => {
  const { id } = useParams();
  const { commonGetAPICalls } = useApiCallUtils();

  const fetchAgentProfile = async (id) => {
    const { success, data, message } = await commonGetAPICalls(`/leads/agent_profile/${id}`);
    if (success) return data;
    throw new Error(message);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['agent_profile', id],
    queryFn: () => fetchAgentProfile(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <NextUISpinner size="lg" style={{ color: PRIMARY_COLOR }} />
          <p className="font-semibold flex items-center gap-2" style={{ color: PRIMARY_COLOR }}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 p-4 rounded-lg text-red-600 font-semibold flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          Error: {error.message}
        </div>
      </div>
    );
  }

  const { agent, service, profile } = data;
  const { agent_details, countries_specialization } = profile;

  const ServiceCard = ({ title, icon: Icon, children }) => (
    <Card className="overflow-hidden transition-all hover:shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader 
        className="border-b border-gray-200 dark:border-gray-700"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY_COLOR}08 0%, ${PRIMARY_COLOR_50}05 50%, ${PRIMARY_COLOR}08 100%)`
        }}
      >
        <CardTitle className="flex items-center gap-3 text-lg font-bold">
          <div 
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: `${PRIMARY_COLOR_50}80`,
              border: `1.5px solid ${PRIMARY_COLOR_200}`
            }}
          >
            <Icon className="w-5 h-5" style={{ color: PRIMARY_COLOR }} />
          </div>
          <span className="text-gray-900 dark:text-white">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner Section */}
      <div className="relative w-full overflow-hidden mb-8 md:mb-12">
        <div 
          className="relative w-full h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{
            backgroundImage: `linear-gradient(135deg, ${PRIMARY_COLOR}dd 0%, ${PRIMARY_COLOR_800}dd 50%, ${PRIMARY_COLOR_900}dd 100%), url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&w=1500&q=80')`,
            backgroundBlendMode: 'overlay',
            backgroundColor: PRIMARY_COLOR
          }}
        >
          <div 
            className="absolute inset-0 opacity-90 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${PRIMARY_COLOR}cc 0%, ${PRIMARY_COLOR_800}cc 50%, ${PRIMARY_COLOR_900}cc 100%)`
            }}
          />
          
          <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-4xl w-full text-center">
              <div className="flex justify-center mb-2">
                <div 
                  className="p-2 sm:p-2.5 rounded-xl backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110"
                  style={{ 
                    backgroundColor: `${PRIMARY_COLOR_50}40`,
                    border: `2px solid ${PRIMARY_COLOR_200}`
                  }}
                >
                  <User size={24} className="sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform duration-300 hover:rotate-6" style={{ color: '#ffffff' }} />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-2xl leading-tight">
                {agent?.username}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto drop-shadow-lg">
                {agent?.app_name} Representative
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0">
            <svg 
              className="w-full h-6 sm:h-8 md:h-10 lg:h-12" 
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Contact Information Card */}
        <Card className="mb-8 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  style={{ 
                    backgroundColor: `${PRIMARY_COLOR_50}80`,
                    border: `2px solid ${PRIMARY_COLOR_200}`
                  }}
                >
                  <User className="w-8 h-8" style={{ color: PRIMARY_COLOR }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{agent?.username}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{agent?.app_name} Representative</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: PRIMARY_COLOR_50 }}
                  >
                    <Mail className="w-5 h-5" style={{ color: PRIMARY_COLOR }} />
                  </div>
                  <a 
                    href={`mailto:${agent?.email}`} 
                    className="hover:underline font-medium transition-colors"
                    style={{ 
                      color: PRIMARY_COLOR,
                      '--hover-color': PRIMARY_COLOR_800
                    } as React.CSSProperties}
                  >
                    {agent?.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: PRIMARY_COLOR_50 }}
                  >
                    <Phone className="w-5 h-5" style={{ color: PRIMARY_COLOR }} />
                  </div>
                  <a 
                    href={`tel:${agent?.country_code}${agent?.phone_number}`} 
                    className="hover:underline font-medium transition-colors"
                    style={{ 
                      color: PRIMARY_COLOR,
                      '--hover-color': PRIMARY_COLOR_800
                    } as React.CSSProperties}
                  >
                    {agent?.country_code} {agent?.phone_number}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Office Information */}
        <ServiceCard title="Office Information" icon={Building}>
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Address</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {agent_details?.officeStreetAddress}, {agent_details?.officeArea}<br />
                  {agent_details?.officeCity}, {agent_details?.officeStateProvince}<br />
                  {agent_details?.officeCountry} - {agent_details?.officePostalCode}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Clock className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Operating Hours</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Weekdays: {agent_details?.operatingHoursWeekdays}<br />
                  Weekends: {agent_details?.operatingHoursWeekends}<br />
                  Timezone: {agent_details?.operatingHoursTimeZone}
                </p>
              </div>
            </div>
          </div>
        </ServiceCard>

        {/* Specialization */}
        <ServiceCard title="Countries & Expertise" icon={Globe}>
          <div className="space-y-5">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Specialized Countries</h4>
              <div className="flex flex-wrap gap-2">
                {countries_specialization.map((item:any, index:number) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 rounded-full text-sm font-medium shadow-sm transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: PRIMARY_COLOR_50,
                      color: PRIMARY_COLOR,
                      border: `1px solid ${PRIMARY_COLOR_200}`
                    }}
                  >
                    {countries[item?.country]?.name}
                  </span>
                ))}
              </div>
            </div>
            {service?.fieldExpertise && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Field Expertise</h4>
                <p className="text-gray-600 dark:text-gray-400">{service?.fieldExpertise}</p>
              </div>
            )}
          </div>
        </ServiceCard>

        {/* Education Services */}
        <ServiceCard title="Education Services" icon={GraduationCap}>
          <div className="grid grid-cols-1 gap-4">
            {service?.courseAdvisors && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Course Advisory</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Specialization: {service?.courseSpecialization}</p>
                </div>
              </div>
            )}
            {service?.universityRecommendations && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">University Recommendations</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Partnered with: {service?.partneredUniversities}</p>
                </div>
              </div>
            )}
            {service?.scholarshipAssistance && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Scholarship Assistance</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{service?.scholarshipDetails}</p>
                </div>
              </div>
            )}
          </div>
        </ServiceCard>

        {/* Visa & Immigration */}
        <ServiceCard title="Visa & Immigration" icon={Plane}>
          <div className="grid grid-cols-1 gap-4">
            {service?.visaConsultancy && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Visa Consultancy</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Specialization: {service?.visaSpecialization}</p>
                </div>
              </div>
            )}
            {service?.visaSuccessRate && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <Award className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Success Rate</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{service?.visaSuccessRateDetails}</p>
                </div>
              </div>
            )}
          </div>
        </ServiceCard>

        {/* Additional Services */}
        <div className="md:col-span-2">
          <ServiceCard title="Additional Services" icon={Briefcase}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {service?.sopWriting && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-all">
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: PRIMARY_COLOR_50 }}
                  >
                    <FileText className="w-5 h-5" style={{ color: PRIMARY_COLOR }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">SOP Writing</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{service?.sopWritingText}</p>
                  </div>
                </div>
              )}
              {service?.budgetPlanning && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-all">
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: PRIMARY_COLOR_50 }}
                  >
                    <DollarSign className="w-5 h-5" style={{ color: PRIMARY_COLOR }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Budget Planning</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{service?.budgetDetails}</p>
                  </div>
                </div>
              )}
              {service?.accommodationHelp && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-all">
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: PRIMARY_COLOR_50 }}
                  >
                    <Building2 className="w-5 h-5" style={{ color: PRIMARY_COLOR }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Accommodation</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{service?.accommodationHelpText || 'Assistance available'}</p>
                  </div>
                </div>
              )}
              {service?.healthInsuranceOptions && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-all">
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: PRIMARY_COLOR_50 }}
                  >
                    <Heart className="w-5 h-5" style={{ color: PRIMARY_COLOR }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Health Insurance</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{service?.healthInsuranceOptionsText || 'Options available'}</p>
                  </div>
                </div>
              )}
              {service?.partTimeJobs && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-all">
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: PRIMARY_COLOR_50 }}
                  >
                    <Work className="w-5 h-5" style={{ color: PRIMARY_COLOR }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Part-time Jobs</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{service?.partTimeJobsText}</p>
                  </div>
                </div>
              )}
              {service?.flightTicketAssistance && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-all">
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: PRIMARY_COLOR_50 }}
                  >
                    <Plane className="w-5 h-5" style={{ color: PRIMARY_COLOR }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Flight Assistance</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Help with booking and arrangements</p>
                  </div>
                </div>
              )}
            </div>
          </ServiceCard>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AgentProfile;
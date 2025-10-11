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
import { countries } from 'country-data'

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
        <div className="animate-pulse text-blue-600 font-semibold flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce"></div>
          Loading profile...
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
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Icon className="w-5 h-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );

  return (
    <div className="container  mx-auto p-4 sm:p-6 lg:p-8 ">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{agent.username}</h1>
              <p className="text-gray-500">Agency Representative</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-5 h-5" />
              <a href={`mailto:${agent?.email}`} className="hover:text-blue-600">{agent.email}</a>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-5 h-5" />
              <a href={`tel:${agent?.country_code}${agent?.phone_number}`} className="hover:text-blue-600">{agent?.country_code} {agent?.phone_number}</a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Office Information */}
        <ServiceCard title="Office Information" icon={Building}>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Address</p>
                <p className="text-gray-600">
                  {agent_details.officeStreetAddress}, {agent_details.officeArea}<br />
                  {agent_details.officeCity}, {agent_details.officeStateProvince}<br />
                  {agent_details.officeCountry} - {agent_details.officePostalCode}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Operating Hours</p>
                <p className="text-gray-600">
                  Weekdays: {agent_details.operatingHoursWeekdays}<br />
                  Weekends: {agent_details.operatingHoursWeekends}<br />
                  Timezone: {agent_details.operatingHoursTimeZone}
                </p>
              </div>
            </div>
          </div>
        </ServiceCard>

        {/* Specialization */}
        <ServiceCard title="Countries & Expertise" icon={Globe}>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Specialized Countries</h4>
              <div className="flex flex-wrap gap-2">
                {countries_specialization.map((item, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                    {countries[item.country]?.name}
                  </span>
                ))}
              </div>
            </div>
            {service?.fieldExpertise && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Field Expertise</h4>
                <p className="text-gray-600">{service?.fieldExpertise}</p>
              </div>
            )}
          </div>
        </ServiceCard>

        {/* Education Services */}
        <ServiceCard title="Education Services" icon={GraduationCap}>
          <div className="grid grid-cols-1 gap-3">
            {service?.courseAdvisors && (
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Course Advisory</p>
                  <p className="text-gray-600">Specialization: {service?.courseSpecialization}</p>
                </div>
              </div>
            )}
            {service?.universityRecommendations && (
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">University Recommendations</p>
                  <p className="text-gray-600">Partnered with: {service?.partneredUniversities}</p>
                </div>
              </div>
            )}
            {service?.scholarshipAssistance && (
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Scholarship Assistance</p>
                  <p className="text-gray-600">{service?.scholarshipDetails}</p>
                </div>
              </div>
            )}
          </div>
        </ServiceCard>

        {/* Visa & Immigration */}
        <ServiceCard title="Visa & Immigration" icon={Plane}>
          <div className="grid grid-cols-1 gap-3">
            {service?.visaConsultancy && (
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Visa Consultancy</p>
                  <p className="text-gray-600">Specialization: {service?.visaSpecialization}</p>
                </div>
              </div>
            )}
            {service?.visaSuccessRate && (
              <div className="flex items-start gap-2">
                <Award className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Success Rate</p>
                  <p className="text-gray-600">{service?.visaSuccessRateDetails}</p>
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
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">SOP Writing</p>
                    <p className="text-sm text-gray-600">{service?.sopWritingText}</p>
                  </div>
                </div>
              )}
              {service?.budgetPlanning && (
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Budget Planning</p>
                    <p className="text-sm text-gray-600">{service?.budgetDetails}</p>
                  </div>
                </div>
              )}
              {service?.accommodationHelp && (
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Accommodation</p>
                    <p className="text-sm text-gray-600">{service?.accommodationHelpText || 'Assistance available'}</p>
                  </div>
                </div>
              )}
              {service?.healthInsuranceOptions && (
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <Heart className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Health Insurance</p>
                    <p className="text-sm text-gray-600">{service?.healthInsuranceOptionsText || 'Options available'}</p>
                  </div>
                </div>
              )}
              {service?.partTimeJobs && (
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <Work className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Part-time Jobs</p>
                    <p className="text-sm text-gray-600">{service?.partTimeJobsText}</p>
                  </div>
                </div>
              )}
              {service?.flightTicketAssistance && (
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Flight Assistance</p>
                    <p className="text-sm text-gray-600">Help with booking and arrangements</p>
                  </div>
                </div>
              )}
            </div>
          </ServiceCard>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
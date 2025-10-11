import React, { useEffect, useState } from 'react'
import 'rsuite/dist/rsuite.min.css';
import { Nav, Input, SelectPicker, Button } from 'rsuite';
import { Spinner } from '@nextui-org/react';
import useApiCallUtils from '@/hooks/useApiCallUtils';


const StudentProfile = () => {

  const { commonPostAPICall } = useApiCallUtils()

  const [isLoading, setIsLoading] = useState(true)
  // State variables for all fields
  const [study_abroad_intentions, setStudyAbroadIntentions] = useState("");
  const [study_abroad_reasons, setStudyAbroadReasons] = useState("");
  const [field_of_study, setFieldOfStudy] = useState("");
  const [degree_level, setDegreeLevel] = useState("");
  const [career_goals, setCareerGoals] = useState("");
  const [course_selection, setCourseSelection] = useState("");
  const [program_duration, setProgramDuration] = useState("");
  const [preferred_country, setPreferredCountry] = useState("");
  const [university_preferences, setUniversityPreferences] = useState("");
  const [scholarship_requirements, setScholarshipRequirements] = useState("");
  const [budget, setBudget] = useState("");
  const [academic_performance, setAcademicPerformance] = useState("");
  const [language_proficiency_scores, setLanguageProficiencyScores] = useState("");
  const [work_experience, setWorkExperience] = useState("");
  const [preferred_internship_roles, setPreferredInternshipRoles] = useState("");
  const [visa_type, setVisaType] = useState("");
  const [accommodation_needs, setAccommodationNeeds] = useState("");
  const [accommodation_preferences, setAccommodationPreferences] = useState("");
  const [health_insurance_needs, setHealthInsuranceNeeds] = useState("");
  const [other_preferences, setOtherPreferences] = useState("");
  const [extracurricular_interests, setExtracurricularInterests] = useState("");
  const [previous_applications, setPreviousApplications] = useState("false");
  const [previous_application_details, setPreviousApplicationDetails] = useState("");
  const [interested_in_part_time_jobs, setInterested_in_part_time_jobs] = useState("false");
  const [interested_in_language_courses, setInterested_in_language_courses] = useState("false");
  const [application_documents, setApplication_documents] = useState("");

  useEffect(() => {
    getProfile()
    fetchProfileCompletionProgress();
  }, [])

  // Event handler for form submission per section
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit data based on the section
    const { success } = await commonPostAPICall({
      study_abroad_intentions,
      study_abroad_reasons,
      field_of_study,
      degree_level,
      career_goals,
      course_selection,
      program_duration,
      preferred_country,
      university_preferences,
      scholarship_requirements,
      budget,
      academic_performance,
      language_proficiency_scores,
      work_experience,
      preferred_internship_roles,
      visa_type,
      accommodation_needs,
      accommodation_preferences,
      health_insurance_needs,
      other_preferences,
      extracurricular_interests,
      previous_applications,
      previous_application_details,
      interested_in_part_time_jobs,
      interested_in_language_courses,
      application_documents,
    }, "student/update_visa_profile", true)

    if (success && success == true) {
      getProfile()
      fetchProfileCompletionProgress()

    }
  };

  const getProfile = async () => {
    setIsLoading(true)
    const { data, success } = await commonPostAPICall({}, "/student/get_visa_profile")
    if (success && success == true) {
      setStudyAbroadIntentions(data?.study_abroad_intentions || "");
      setStudyAbroadReasons(data?.study_abroad_reasons || "");
      setFieldOfStudy(data?.field_of_study || "");
      setDegreeLevel(data?.degree_level || "");
      setCareerGoals(data?.career_goals || "");
      setCourseSelection(data?.course_selection || "");
      setProgramDuration(data?.program_duration || "");
      setPreferredCountry(data?.preferred_country || "");
      setUniversityPreferences(data?.university_preferences || "");
      setScholarshipRequirements(data?.scholarship_requirements || "");
      setBudget(data?.budget || "");
      setAcademicPerformance(data?.academic_performance || "");
      setLanguageProficiencyScores(data?.language_proficiency_scores || "");
      setWorkExperience(data?.work_experience || "");
      setPreferredInternshipRoles(data?.preferred_internship_roles || "");
      setVisaType(data?.visa_type && data.visa_type + "" || "");
      setAccommodationNeeds(data?.accommodation_needs && data.accommodation_needs + "" || "false");
      setAccommodationPreferences(data?.accommodation_preferences || "");
      setHealthInsuranceNeeds(data?.health_insurance_needs && data.health_insurance_needs + "" || "false");
      setOtherPreferences(data?.other_preferences || "");
      setExtracurricularInterests(data?.extracurricular_interests || "");
      setPreviousApplications(data?.previous_applications && data.previous_applications + "" || "false");
      setPreviousApplicationDetails(data?.previous_application_details || "");
      setInterested_in_part_time_jobs(data?.interested_in_part_time_jobs && data.interested_in_part_time_jobs + "" || "false");
      setInterested_in_language_courses(data?.interested_in_language_courses && data.interested_in_language_courses + "" || "false");
      setApplication_documents(data?.application_documents === "0" ? "true" : "false");
    }
    setIsLoading(false)
  }

  const [activeKey, setActiveKey] = useState('academic');
  const renderContent = () => {
    switch (activeKey) {
      case 'academic':
        return (
          <div className="p-6 space-y-6 bg-white rounded-lg shadow-md border border-gray-300">
            <h3 className="text-xl font-semibold text-gray-800">Academic and Career Aspirations</h3>
            <p className="text-sm text-gray-500">Please provide information regarding your academic goals and career aspirations.</p>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Are you planning to study abroad?</label>
              <SelectPicker
                data={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setStudyAbroadIntentions}
                value={study_abroad_intentions}
                className="border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Why do you want to study abroad?</label>
              <Input
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setStudyAbroadReasons}
                value={study_abroad_reasons} // Set value from state
                className="border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">What is your field of study?</label>
              <Input
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setFieldOfStudy}
                value={field_of_study} // Set value from state
                className="border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">What degree level are you aiming for?</label>
              <SelectPicker
                data={[
                  { label: "Arts", value: "Arts" },
                  { label: "Business, Management and Economics", value: "Business, Management and Economics" },
                  { label: 'Elementary and High School', value: 'Elementary and High School' },
                  { label: 'Engineering and Technology', value: 'Engineering and Technology' },
                  { label: 'English for Academic Studies', value: 'English for Academic Studies' },
                  { label: 'Health Sciences, Medicine, Nursing, Paramedic and Kinesiology', value: 'Health Sciences, Medicine, Nursing, Paramedic and Kinesiology' },
                  { label: 'Law, Politics, Social, Community Service and Teaching', value: 'Law, Politics, Social, Community Service and Teaching' },
                ]}
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setDegreeLevel}
                value={degree_level} // Set value from state
                className="border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">What are your long-term career goals?</label>
              <Input
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setCareerGoals}
                value={career_goals} // Set value from state
                className="border border-gray-300 rounded-md"
              />
            </div>

            <div className='flex flex-row items-center justify-start gap-2'>
              <Button appearance="primary" onClick={(e) => { setActiveKey('course'); handleSubmit(e) }} className="w-fit">Update & Next</Button>
            </div>
          </div>
        );

      case 'course':
        return (
          <div className="p-6 bg-white shadow-md rounded-lg border border-gray-300 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Course Preferences</h3>
            <p className="text-sm text-gray-600">Please share your preferences regarding courses and program durations.</p>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">What courses are you interested in pursuing?</label>
              <Input
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setCourseSelection}
                value={course_selection} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Preferred program duration:</label>
              <Input
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setProgramDuration}
                value={program_duration} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <Button appearance="primary" onClick={(e) => {setActiveKey('location'); handleSubmit(e)}} className="w-fit">Update & Next</Button>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-300 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Location Preferences</h3>
            <p className="text-sm text-gray-500">Please indicate your preferred locations for studying.</p>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Preferred countries for your studies:</label>
              <Input
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setPreferredCountry}
                value={preferred_country} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Preferred University for your studies:</label>
              <Input
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setUniversityPreferences}
                value={university_preferences} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <Button appearance="primary" onClick={(e) => {setActiveKey('financial'); handleSubmit(e)}} className="w-fit">Update & Next</Button>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="p-6 bg-white shadow-md rounded-lg border border-gray-300 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Financial and Scholarship Information</h3>
            <p className="text-sm text-gray-500">Please provide details about your financial situation and scholarship needs.</p>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Are you looking for scholarship opportunities?</label>
              <SelectPicker
                data={[{ label: 'Yes', value: "true" }, { label: 'No', value: "false" }]}
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setScholarshipRequirements}
                value={scholarship_requirements} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">What is your estimated budget for your studies?</label>
              <Input
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setBudget}
                value={budget} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <Button appearance="primary" onClick={(e) => {setActiveKey('performance'); handleSubmit(e)}} className="w-fit">Update & Next</Button>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-300 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Academic Performance and Language Proficiency</h3>
            <p className="text-sm text-gray-500">Please provide your academic performance and language proficiency details below.</p>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Your academic performance (GPA/Grades):</label>
              <Input
                as="textarea"
                rows={3}
                placeholder='Enter your course name with GPA/Grades and passing year'
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setAcademicPerformance}
                value={academic_performance} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Language proficiency test scores (e.g., IELTS, TOEFL):</label>
              <Input
                as="textarea"
                placeholder='Enter your score and validity period'
                rows={3}
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setLanguageProficiencyScores}
                value={language_proficiency_scores} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <Button appearance="primary" onClick={(e) => {setActiveKey('work_experience'); handleSubmit(e)}} className="w-fit">Update & Next</Button>
            </div>
          </div>
        );

      case 'work_experience':
        return (
          <div className="p-6 bg-white shadow-md rounded-lg border border-gray-300 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Work and Internship Experience</h3>
            <p className="text-sm text-gray-500">Please provide details of any work or internship experience you have.</p>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Describe your work experience:</label>
              <Input
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setWorkExperience}
                value={work_experience} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Preferred roles for internships:</label>
              <Input
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setPreferredInternshipRoles}
                value={preferred_internship_roles} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <Button appearance="primary" onClick={(e) => {setActiveKey('visa_accommodation'); handleSubmit(e)}} className="w-fit">Update & Next</Button>
            </div>
          </div>
        );

      case 'visa_accommodation':
        return (
          <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-300 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Visa and Accommodation Needs</h3>
            <p className="text-sm text-gray-500">Please provide details about your visa requirements and accommodation preferences.</p>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">What type of visa do you plan to apply for?</label>
              <SelectPicker
                data={[{ label: 'Student Visa', value: 'Student Visa' }, { label: 'Work Visa', value: 'Work Visa' }]}
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setVisaType}
                value={visa_type} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Do you need help with accommodation?</label>
              <SelectPicker
                data={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setAccommodationNeeds}
                value={accommodation_needs} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Accommodation preferences (e.g., dorm, apartment):</label>
              <Input
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setAccommodationPreferences}
                value={accommodation_preferences} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Do you require health insurance assistance?</label>
              <SelectPicker
                data={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setHealthInsuranceNeeds}
                value={health_insurance_needs} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <Button appearance="primary" onClick={(e) => {setActiveKey('additional_preferences'); handleSubmit(e)}} className="w-fit">Update & Next</Button>
            </div>
          </div>
        );

      case 'additional_preferences':
        return (
          <div className="p-6 bg-white shadow-md rounded-lg border border-gray-300 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Additional Preferences</h3>
            <p className="text-sm text-gray-600">Specify any other preferences or requirements you have.</p>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Do you have any extracurricular interests or hobbies?</label>
              <Input
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setExtracurricularInterests}
                value={extracurricular_interests} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Have you previously applied to universities or for a visa?</label>
              <SelectPicker
                data={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setPreviousApplications}
                value={previous_applications} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Are you interested in part-time job opportunities during your studies?</label>
              <SelectPicker
                data={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setInterested_in_part_time_jobs}
                value={interested_in_part_time_jobs} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Are you looking for language courses (e.g. English Proficiency)?</label>
              <SelectPicker
                data={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setInterested_in_language_courses}
                value={interested_in_language_courses} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Do you have application documents ready (e.g. SOP, Cover Letters)?</label>
              <SelectPicker
                data={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
                style={{ width: '100%', marginBottom: '1rem' }}
                onChange={setApplication_documents}
                value={application_documents} // Set value from state
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button appearance="primary" onClick={handleSubmit} className="w-fit">Update Profile</Button>
          </div>
        );

      default:
        return null;
    }
  };

  const [profileCompletionProgress, setProfileCompletionProgress] = useState<any>();

  const fetchProfileCompletionProgress = async () => {
    try {
      const { data, success } = await commonPostAPICall({}, "student/profile_completion_progress");
      if (success && success == true) {
        setProfileCompletionProgress(data);
      }
    } catch (error) {
      console.error("Error fetching profile completion progress:", error);
    }
  };

  const renderNavItems = () => {
    const sections = [
      { key: 'academic', label: 'Academic', fields: ['study_abroad_intentions', 'study_abroad_reasons', 'field_of_study', 'degree_level', 'career_goals'] },
      { key: 'course', label: 'Course', fields: ['course_selection', 'program_duration'] },
      { key: 'location', label: 'Location', fields: ['preferred_country', 'university_preferences'] },
      { key: 'financial', label: 'Financial', fields: ['scholarship_requirements', 'budget'] },
      { key: 'performance', label: 'Performance', fields: ['academic_performance', 'language_proficiency_scores'] },
      { key: 'work_experience', label: 'Experience', fields: ['work_experience', 'preferred_internship_roles'] },
      { key: 'visa_accommodation', label: 'Visa & Accommodation', fields: ['visa_type', 'accommodation_needs', 'accommodation_preferences', 'health_insurance_needs'] },
      { key: 'additional_preferences', label: 'Additional', fields: ['extracurricular_interests', 'previous_applications', 'interested_in_part_time_jobs', 'interested_in_language_courses', 'application_documents'] },
    ];

    const hasMissingFields = profileCompletionProgress?.missingFields?.length > 0;

    return sections.map(section => (
      <Nav.Item key={section.key} eventKey={section.key}>
        {section.label}
        {(!hasMissingFields || section.fields.some(field => profileCompletionProgress?.missingFields?.includes(field))) && (
          <span className="text-red-500 text-xs ml-1">•</span> // Dot for incomplete fields
        )}
      </Nav.Item>
    ));
  };

  return (
    <div className="text-gray-800 dark:bg-gray-900 dark:text-white">
      {isLoading ? (
        <div className='flex items-center justify-center my-5'>
          <Spinner />
        </div>
      ) : (
        <form className="container mx-auto ">
          <div className="mb-4 p-4 bg-white shadow-md rounded-lg border border-gray-300">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">Profile Completion Status</h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600">{(profileCompletionProgress?.completionPercentage)?.toFixed(2)}%</span>
              <span className="text-sm font-medium text-gray-500">of your profile is complete</span>
            </div>
            <div className="relative pt-1 mt-2">
              <div className="flex h-2 bg-gray-200 rounded">
                <div
                  className="bg-blue-600 h-full rounded"
                  style={{ width: `${profileCompletionProgress?.completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <Nav
            appearance="subtle"
            activeKey={activeKey}
            onSelect={setActiveKey}
            className='text-tiny w-[90vw] sm:w-full overflow-x-scroll md:overflow-hidden'
            pullRight={true}
          >
            {renderNavItems()}
          </Nav>
          <div className="mt-4">{renderContent()}</div>
        </form>
      )}
    </div>
  );
};

export default StudentProfile
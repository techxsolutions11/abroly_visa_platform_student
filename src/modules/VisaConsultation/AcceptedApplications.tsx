import { commonGetAPICalls } from "@/utils/ApiCallUtils";
import { Button, Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { MapPin, Calendar, School, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { countries } from 'country-data'
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

  return (
    <div className="w-full flex flex-wrap gap-6 justify-center">
      {isFetching ? (
        <Spinner className="mx-auto" />
      ) : (
        data?.map((item: any) => {
          const details = JSON.parse(item.selected_suggestion);

          return (
            <Card key={item.id} className="w-full md:w-[350px] lg:w-[400px] shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {details.university}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Agent Name : {item.lead_of.username}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{details.state}, {countries[details?.country]?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <School className="w-4 h-4 text-primary" />
                  <span>{details.programLevel} in {details.fieldOfStudy}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Intake: {details.intakeMonth} {details.intakeYear}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span>Tuition Fees: {details.tuitionFees}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 items-start">
                <div className="flex justify-between gap-2">
                  <Button
                    onClick={() => {
                      window.open(`/agent_profile/${item?.id}`, "_blank")
                    }}
                    size="sm" variant="bordered" color="success">View Agent Profile</Button>
                  <Button
                    onClick={() => {
                      navigate("/accepted_applications/" + item.id)
                    }}
                    size="sm" variant="flat" color="success">View Application Progress</Button>
                </div>
                {(item?.status == "withdrawn" || item?.status == "withdrawn_by_student" )&& (
                  <p className="text-red-500 text-sm">Application Withdrawn</p>
                )}
              </CardFooter>
            </Card>
          );
        })
      )}

      {data?.length === 0 && (
        <p className="text-center text-gray-500">No accepted applications found.</p>
      )}
    </div>
  );
};

export default AcceptedApplications;

import { useQuery, useMutation } from '@tanstack/react-query';
import { Button, Checkbox, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import { useSelector } from 'react-redux';
import CommonLocationSelector from '@/components/CommonLocationSelector';
import { Separator } from '@/components/ui/separator';
import { IconButton } from 'rsuite';
import { MapPin } from 'lucide-react';
import { SuccessToast } from '@/utils/Toaster';
import fetchQueriesHook from '@/hooks/fetchQueriesHook';

const OfflinePrep = () => {
    const { commonGetAPICalls, commonPostAPICall } = useApiCallUtils();

    const { isOpen, onOpenChange } = useDisclosure()

    const invalidate = fetchQueriesHook()

    const { latitude, longitude, area } = useSelector((state: any) => state.user_location);

    const navigate = useNavigate();

    const [selectedLanguages, setSelectedLanguages] = useState([]);

    // Fetch available offline languages
    const { data: languages, isFetching: langLoading } = useQuery({
        queryKey: ['offlineLanguages'],
        queryFn: async () => {
            const { success, data } = await commonGetAPICalls('/offline-language-prep/list');
            return success ? data : [];
        },
        enabled: true,
    });

    // Fetch nearby agents
    const { data: agents, isFetching } = useQuery({
        queryKey: ['nearbyAgents', selectedLanguages,latitude, longitude],
        queryFn: async () => {
            const queryParams = new URLSearchParams({
                latitude: latitude, // Example value
                longitude: longitude, // Example value
                radiusInKm: '10'
            });
            if (selectedLanguages.length) {
                queryParams.append('selected_language_id', selectedLanguages.join(','));
            }
            const { success, data } = await commonGetAPICalls(`/offline-language-prep/get_nearby_agents?${queryParams}`);
            return success ? data.agents : [];
        },
        enabled:true
    });

    // Handle interest API call
    const interestMutation = useMutation({
        mutationFn: async ({ agentId }: any) => {
            const {success,data,message} =  await commonGetAPICalls(`/offline-language-prep/interested?agent_id=${agentId}`);
            if(success && success == true) {
                return data
            }
            throw new Error(message);
        },
        onSuccess: (response) => {
            // SuccessToast(response.message || 'Interest recorded!');
            invalidate(['nearbyAgents',selectedLanguages])
        },
    });

    return (
        <div className='container mx-auto p-4'>
            <div className="col-span-full flex flex-col gap-4 items-center bg-accent/10  rounded-lg">
                <p className="text-md font-medium">Selected Location: {area}</p>

                <div className='flex flex-row items-center justify-center gap-4 col-span-2'>
                    <Separator orientation="horizontal" className="my-2 mx-auto" />
                    OR
                    <Separator orientation="horizontal" className="my-2 mx-auto" />
                </div>
                <IconButton onClick={() => { onOpenChange() }} icon={<MapPin className='p-1' />}>Select Other Location</IconButton>

            </div>
            <h2 className='text-xl font-bold my-4'>Offline Language Preparation</h2>
            <p>Please Select the languages that you want to filter out</p>
            {/* Language Filters */}
            {langLoading ? (
                <Spinner />
            ) : (
                <div className='my-4 flex flex-row flex-wrap gap-4'>
                    {languages?.map((lang) => (
                        <Checkbox
                            key={lang.id}
                            isSelected={selectedLanguages.includes(lang.id)}
                            onChange={() => {
                                setSelectedLanguages((prev) =>
                                    prev.includes(lang.id) ? prev.filter((id) => id !== lang.id) : [...prev, lang.id]
                                );
                            }}
                        >
                            {lang.title}
                        </Checkbox>
                    ))}
                </div>
            )}

            {/* Agents Table */}
            {isFetching ? (
                <Spinner />
            ) : (
                <Table>
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Languages</TableColumn>
                        <TableColumn>Distance</TableColumn>
                        <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        emptyContent={'No agents found'}
                    >
                        {agents?.map((agent) => (
                            <TableRow key={agent.id}>
                                <TableCell>{agent.name}</TableCell>
                                <TableCell>
                                    {agent?.languages?.map(lang => languages.find(l => l.id === lang)?.title || 'Unknown')?.join(', ')}
                                </TableCell>

                                <TableCell>{agent.distance.toFixed(2)} km</TableCell>
                                <TableCell>
                                    <Button
                                        color='primary'
                                        onClick={() => interestMutation.mutate({ agentId: agent?.id })}
                                        isLoading={interestMutation.isPending}
                                    >
                                        Interested
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <CommonLocationSelector
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />

        </div>
    );
};

export default OfflinePrep;

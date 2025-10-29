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

    // const { latitude, longitude, area } = useSelector((state: any) => state.user_location);

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
        // queryKey: ['nearbyAgents', selectedLanguages,latitude, longitude],
        queryKey: ['nearbyAgents', selectedLanguages],
        queryFn: async () => {
            const queryParams = new URLSearchParams({
                // latitude: latitude, // Example value
                // longitude: longitude, // Example value
                // radiusInKm: '10',
                agent_uuid: import.meta.env.VITE_AGENT_UUID
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

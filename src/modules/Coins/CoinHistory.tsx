import { useQuery } from '@tanstack/react-query'
import useApiCallUtils from '@/hooks/useApiCallUtils'
import { Button, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CoinHistory = () => {
    const { commonGetAPICalls } = useApiCallUtils()
    const navigate = useNavigate()

    const limit = 10;
    const [pageValue, setPageValue] = useState(1)

    // Fetch coin history using React Query
    const { data:coins, isLoading } = useQuery({
        queryKey: ['coinHistory', pageValue],  // Unique cache key
        queryFn: async () => {
            const {success,data,message} = await commonGetAPICalls(`/coins/student/history?page=${pageValue}&limit=${limit}`);
            if(success && success === true) {
                return data;
            }
            // return response?.success ? response.data : { totalRecords: 0, data: [] };
            throw new Error(message);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    console.log(coins);
    

    return (
        <div className='container mx-auto'>
            <Table
                aria-label="Coin Spending History"
                style={{
                    height: "auto",
                    minWidth: "100%",
                }}
                topContent={
                    <section className='flex flex-row justify-between items-center'>
                        <h1>Coin Spending History</h1>
                    </section>
                }
                bottomContent={
                    <section className='mx-auto'>
                        <Pagination
                            isCompact
                            showControls
                            page={pageValue}
                            total={coins?.totalPages}
                            onChange={(value) => setPageValue(value)}
                        />
                    </section>
                }
            >
                <TableHeader>
                    <TableColumn>Transaction ID</TableColumn>
                    <TableColumn>Use</TableColumn>
                    <TableColumn>Used</TableColumn>
                    <TableColumn>Balance</TableColumn>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Date</TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={<p>No Coin History Available</p>}
                    loadingContent={<Spinner />}
                    isLoading={isLoading}
                >
                    {coins?.data?.map((item) => (
                        <TableRow key={item?.id}>
                            <TableCell>{item?.id}</TableCell>
                            <TableCell>{item?.comment}</TableCell>
                            <TableCell>{item?.used_coins}</TableCell>
                            <TableCell>{item?.coin_balance}</TableCell>
                            <TableCell>{item?.transection_type}</TableCell>
                            <TableCell>{new Date(item?.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CoinHistory;

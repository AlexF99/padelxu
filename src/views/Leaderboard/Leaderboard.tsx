import Box from '@mui/material/Box';

import { usePadelStore } from '../../zustand/padelStore';
import { CircularProgress, Typography } from '@mui/material';
import StatsTable from '../../components/organisms/StatsTable/StatsTable';
import { useNavigate } from 'react-router-dom';
import { Route } from '../../router';
import { fetchLeaderboard } from '../../api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DateLimits } from '../../components/molecules/DateLimits/DateLimits';
import { useFilter } from '../../hooks/useFilter';

export default function Leaderboard() {
    const { group } = usePadelStore();
    const { filterData, setFilterData } = useFilter();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const updateLeaderboard = async () => {
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
    }

    const onItemClick = (id: string) => {
        navigate(`${Route.PLAYERS}/${id}`)
    }

    const { data: leaderboard, isFetching } = useQuery({
        queryKey: ['leaderboard', filterData],
        queryFn: () => fetchLeaderboard(group.id, filterData),
    })

    return (
        <Box className="PageContainer">
            <Typography variant='h3'>Leaderboard</Typography>
            <DateLimits
                setFilterData={setFilterData}
                filterData={filterData} />
            {isFetching
                ? <CircularProgress color="success" />
                : <StatsTable onItemClick={(id) => onItemClick(id)} items={leaderboard} reloadItems={updateLeaderboard}></StatsTable>
            }
        </Box>
    );
}
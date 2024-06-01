import Box from '@mui/material/Box';

import { usePadelStore } from '../../zustand/padelStore';
import { CircularProgress, Typography } from '@mui/material';
import StatsTable from '../../components/organisms/StatsTable/StatsTable';
import { fetchTeams } from '../../api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Teams() {
    const queryClient = useQueryClient()
    const { group } = usePadelStore()

    const { data: teams, isFetching } = useQuery({
        queryKey: ['teams', { groupId: group.id }],
        queryFn: () => fetchTeams(group.id),
    })

    const updateLeaderboard = async () => {
        queryClient.invalidateQueries({ queryKey: ['teams'] })
    }

    const onItemClick = (id: string) => { }

    return (
        <Box className="PageContainer">
            <Typography variant='h3'>Duplas</Typography>
            {isFetching
                ? <CircularProgress color="success" />
                : <StatsTable onItemClick={(id) => onItemClick(id)} items={teams} reloadItems={updateLeaderboard}></StatsTable>
            }
        </Box>
    );
}
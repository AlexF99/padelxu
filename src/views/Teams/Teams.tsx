import Box from '@mui/material/Box';

import { useEffect } from 'react';
import { usePadelStore } from '../../zustand/padelStore';
import { CircularProgress, Typography } from '@mui/material';
import StatsTable from '../../components/organisms/StatsTable/StatsTable';

export default function Teams() {
    const { teams, fetchTeams, isLoading, setIsLoading } = usePadelStore();

    const updateLeaderboard = async () => {
        setIsLoading(true)
        await fetchTeams()
        setIsLoading(false)
    }

    useEffect(() => {
        if (teams.length < 1) {
            updateLeaderboard()
        }
    }, [])

    return (
        <Box className="PageContainer">
            <Typography variant='h3'>Duplas</Typography>
            {isLoading
                ? <CircularProgress color="success" />
                : <StatsTable items={teams} reloadItems={updateLeaderboard}></StatsTable>
            }
        </Box>
    );
}
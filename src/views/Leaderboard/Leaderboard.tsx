import Box from '@mui/material/Box';

import { useEffect } from 'react';
import { usePadelStore } from '../../zustand/padelStore';
import { CircularProgress, Typography } from '@mui/material';
import StatsTable from '../../components/organisms/StatsTable/StatsTable';

export default function Leaderboard() {
    const { leaderboard, fetchLeaderboard, isLoading, setIsLoading } = usePadelStore();

    const updateLeaderboard = async () => {
        setIsLoading(true)
        await fetchLeaderboard()
        setIsLoading(false)
    }

    useEffect(() => {
        if (leaderboard.length < 1) {
            updateLeaderboard()
        }
    }, [])


    return (
        <Box className="PageContainer">
            <Typography variant='h3'>Leaderboard</Typography>
            {isLoading
                ? <CircularProgress color="success" />
                : <StatsTable items={leaderboard} reloadItems={updateLeaderboard}></StatsTable>
            }
        </Box>
    );
}
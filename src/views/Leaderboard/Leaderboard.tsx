import Box from '@mui/material/Box';

import { useEffect } from 'react';
import { usePadelStore } from '../../zustand/padelStore';
import { CircularProgress, Typography } from '@mui/material';
import StatsTable from '../../components/organisms/StatsTable/StatsTable';
import { useNavigate } from 'react-router-dom';
import { Route } from '../../router';

export default function Leaderboard() {
    const { leaderboard, fetchLeaderboard, isLoading, setIsLoading } = usePadelStore();
    const navigate = useNavigate();

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

    const onItemClick = (id: string) => {
        navigate(`${Route.PLAYERS}/${id}`)
    }

    return (
        <Box className="PageContainer">
            <Typography variant='h3'>Leaderboard</Typography>
            {isLoading
                ? <CircularProgress color="success" />
                : <StatsTable onItemClick={(id) => onItemClick(id)} items={leaderboard} reloadItems={updateLeaderboard}></StatsTable>
            }
        </Box>
    );
}
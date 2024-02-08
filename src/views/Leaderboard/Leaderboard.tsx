import { Box, Button, Grid, MenuItem, Select, Typography } from "@mui/material";
import { useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { usePadelStore } from "../../zustand/padelStore";
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Leaderboard() {
    const { criteria, leaderboard, leaderboardKeys, fetchLeaderboard, setCriteria, isLoading, setIsLoading } = usePadelStore();

    const updateLeaderboard = async () => {
        setIsLoading(true)
        await fetchLeaderboard()
        setIsLoading(false)
    }

    const handleCriteriaChange = async (e: any) => {
        if (Object.keys(leaderboard).length < 1) {
            await updateLeaderboard()
        }
        setCriteria(e.target.value);
    }

    useEffect(() => {
        if (Object.keys(leaderboard).length < 1) {
            updateLeaderboard()
        }
    }, [])

    return (
        <Box className="PageContainer">
            <div style={{ display: "flex" }}>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={criteria}
                    label="Age"
                    onChange={handleCriteriaChange}
                >
                    <MenuItem value="wins">wins</MenuItem>
                    <MenuItem value="sets">sets</MenuItem>
                    <MenuItem value="ratio">ratio</MenuItem>
                </Select>
                <Button type="button" color='success' onClick={() => updateLeaderboard()}><RefreshIcon /></Button>
            </div>
            {isLoading
                ? <CircularProgress color="success" />
                : leaderboardKeys.length && leaderboardKeys.map((playerid: string) => (
                    <Box key={playerid} className="ArrayContainer">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4" fontWeight="bold">
                                    {leaderboard[playerid]?.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" fontWeight="bold">
                                    wins: {leaderboard[playerid]?.wins}
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    matches: {leaderboard[playerid]?.matches}
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    sets: {leaderboard[playerid]?.sets}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" fontWeight="bold">
                                    win ratio: {leaderboard[playerid]?.matches > 0 ? (leaderboard[playerid]?.wins / leaderboard[playerid]?.matches * 100).toFixed(0) : 0}%
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    sets ratio: {leaderboard[playerid]?.setsPlayed > 0 ? (leaderboard[playerid]?.sets / leaderboard[playerid]?.setsPlayed * 100).toFixed(0) : 0}%
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                ))
            }
        </Box>
    )
}
import { Box, Button, Grid, MenuItem, Select, Typography } from "@mui/material"
import { useEffect } from "react";
import { usePadelStore } from "../../zustand/padelStore";
import RefreshIcon from '@mui/icons-material/Refresh';

const Teams = () => {
    const { teams, teamKeys, teamsCriteria, fetchTeams, setIsLoading, setTeamKeys } = usePadelStore();

    const updateTeams = async () => {
        setIsLoading(true);
        await fetchTeams();
        setIsLoading(false);
    }

    const handleCriteriaChange = async (e: any) => {
        if (Object.keys(teams).length < 1) {
            await updateTeams();
        }
        setTeamKeys(e.target.value);
    }

    useEffect(() => {
        if (Object.keys(teams).length < 1) {
            updateTeams();
        }
    }, [])

    return (
        <Box className="PageContainer">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1 style={{ margin: "0px 10px" }}>Duplas</h1>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={teamsCriteria}
                    label="Age"
                    onChange={handleCriteriaChange}
                >
                    <MenuItem value="wins">wins</MenuItem>
                    <MenuItem value="sets">sets</MenuItem>
                    <MenuItem value="matches">matches</MenuItem>
                </Select>
                <Button type="button" color='success' onClick={() => updateTeams()}><RefreshIcon /></Button>
            </div>
            {teamKeys && teamKeys.map((k: string) => (
                <Box key={k} className="ArrayContainer">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4" fontWeight="bold">
                                {teams[k]?.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                wins: {teams[k]?.wins}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                matches: {teams[k]?.matches}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                sets: {teams[k]?.sets}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                win ratio: {teams[k]?.matches > 0 ? (teams[k]?.wins / teams[k]?.matches * 100).toFixed(0) : 0}%
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                sets ratio: {teams[k]?.setsPlayed > 0 ? (teams[k]?.sets / teams[k]?.setsPlayed * 100).toFixed(0) : 0}%
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

            ))}
        </Box>
    )
}

export default Teams;
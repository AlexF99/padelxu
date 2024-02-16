import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Stats, usePadelStore } from "../../zustand/padelStore";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import RefreshIcon from '@mui/icons-material/Refresh';

type Data = {
    id: string,
    name: string
}


export default function PlayerInfo() {
    const { id } = useParams();
    const [player, setPlayer] = useState<Stats>()
    const [data, setData] = useState<Data[]>()
    const { matches, leaderboard, fetchLeaderboard, fetchMatches, isLoading, setIsLoading, group } = usePadelStore();

    const refresh = async () => {
        setIsLoading(true)
        await fetchMatches()
        await fetchLeaderboard()
        setIsLoading(false)
    }

    useEffect(() => {
        if (!group.id.length) return;
        if (leaderboard.length < 1 || Object.keys(matches).length < 1) refresh();
        const foundPlayer = leaderboard.find((p: Stats) => p.id === id)
        setPlayer(foundPlayer)
        let newData: any = [];
        Object.keys(matches).reverse().forEach(day => {
            const d = matches[day].reduce((acc: any, match: any) => {
                let won = false;
                let played = true;
                let setsPlayed = 0;
                let setsWon = 0;
                if (match.teamOne.players.find((p: any) => p.id === id)) {
                    won = match.teamOne.points > match.teamTwo.points
                    setsWon += match.teamOne.points;
                } else if (match.teamTwo.players.find((p: any) => p.id === id)) {
                    won = match.teamTwo.points > match.teamOne.points;
                    setsWon += match.teamTwo.points;
                } else played = false;

                if (played) setsPlayed += match.teamOne.points + match.teamTwo.points;
                return {
                    ...acc,
                    m: acc.m + (played ? 1 : 0),
                    wins: acc.wins + (won ? 1 : 0),
                    sets: acc.sets + setsWon,
                    setsPlayed: acc.setsPlayed + setsPlayed,
                    ratio: (acc.wins + (won ? 1 : 0)) / (acc.m + (played ? 1 : 0)),
                    setsRatio: (acc.sets + setsWon) / (acc.setsPlayed + setsPlayed)
                }
            }, { m: 0, wins: 0, sets: 0, setsPlayed: 0, ratio: 0, setsRatio: 0, accRatio: 0, date: day })

            const accData = newData.reduce((acc: any, dayData: any) => ({ wins: acc.wins + dayData.wins, m: acc.m + dayData.m, sets: acc.sets + dayData.sets, setsPlayed: acc.setsPlayed + dayData.setsPlayed }),
                { wins: d.wins, m: d.m, sets: d.sets, setsPlayed: d.setsPlayed })

            newData.push({ ...d, accRatio: accData.wins / accData.m, accSetsRatio: accData.sets / accData.setsPlayed })
        })

        setData(newData)
    }, [matches])

    return (
        <Box className="PageContainer">
            {group.id.length ? isLoading
                ? <CircularProgress color="success" />
                : <>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography variant="h3">{player?.name}</Typography>
                        <Button type="button" color='success' onClick={refresh}><RefreshIcon /></Button>
                    </Box>
                    <Box className="ArrayContainer">
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1">Partidas: {player?.matches}</Typography>
                                <Typography variant="body1">Vitórias: {player?.wins}</Typography>
                                <Typography variant="body1">Sets ganhos: {player?.sets}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">Aproveitamento: {player?.ratio}</Typography>
                                <Typography variant="body1">Aprov. sets: {player?.setsRatio}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Typography variant="h6">Vitórias</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <ResponsiveContainer aspect={1.2} maxHeight={300}>
                                <LineChart data={data}>
                                    <Line type="monotone" dataKey="accRatio" stroke="#8884d8" />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey={"date"} />
                                    <YAxis domain={[0, 1]} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ResponsiveContainer aspect={1.2} maxHeight={300}>
                                <BarChart data={data}>
                                    <Bar type="monotone" dataKey="ratio" stroke="#8884d8" />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey={"date"} />
                                    <YAxis domain={[0, 1]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Grid>
                    </Grid>

                    <Typography variant="h6">Sets</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <ResponsiveContainer aspect={1.2} maxHeight={300}>
                                <LineChart data={data}>
                                    <Line type="monotone" dataKey="accSetsRatio" stroke="#8884d8" />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey={"date"} />
                                    <YAxis domain={[0, 1]} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ResponsiveContainer aspect={1.2} maxHeight={300}>
                                <BarChart data={data}>
                                    <Bar type="monotone" dataKey="setsRatio" stroke="#8884d8" />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey={"date"} />
                                    <YAxis domain={[0, 1]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Grid>
                    </Grid>
                </>
                : <Box>Selecione um grupo</Box>
            }
        </Box>
    )
}
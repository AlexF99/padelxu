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
        refresh();
        const foundPlayer = leaderboard.find((p: Stats) => p.id === id)
        setPlayer(foundPlayer)
        let newData: any = [];
        Object.keys(matches).reverse().forEach(day => {
            const d = matches[day].reduce((acc: any, match: any) => {
                let won = false;
                let played = true;
                let gamesPlayed = 0;
                let gamesWon = 0;
                if (match.teamOne.players.find((p: any) => p.id === id)) {
                    won = match.teamOne.points > match.teamTwo.points
                    gamesWon += match.teamOne.points;
                } else if (match.teamTwo.players.find((p: any) => p.id === id)) {
                    won = match.teamTwo.points > match.teamOne.points;
                    gamesWon += match.teamTwo.points;
                } else played = false;

                if (played) gamesPlayed += match.teamOne.points + match.teamTwo.points;
                return {
                    ...acc,
                    m: acc.m + (played ? 1 : 0),
                    wins: acc.wins + (won ? 1 : 0),
                    gamesWon: acc.gamesWon + gamesWon,
                    gamesPlayed: acc.gamesPlayed + gamesPlayed,
                    ratio: (acc.wins + (won ? 1 : 0)) / (acc.m + (played ? 1 : 0)),
                    gamesRatio: (acc.gamesWon + gamesWon) / (acc.gamesPlayed + gamesPlayed)
                }
            }, { m: 0, wins: 0, gamesWon: 0, gamesPlayed: 0, ratio: 0, gamesRatio: 0, accWinRatio: 0, date: day })

            const accData = newData.reduce((acc: any, dayData: any) => ({ wins: acc.wins + dayData.wins, m: acc.m + dayData.m, gamesWon: acc.gamesWon + dayData.gamesWon, gamesPlayed: acc.gamesPlayed + dayData.gamesPlayed }),
                { wins: d.wins, m: d.m, gamesWon: d.gamesWon, gamesPlayed: d.gamesPlayed })

            newData.push({ ...d, accWinRatio: accData.wins / accData.m, accGamesRatio: accData.gamesWon / accData.gamesPlayed })
        })

        setData(newData)
    }, [])

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
                                <Typography variant="body1">games ganhos: {player?.gamesWon}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">Aproveitamento: {player?.ratio}</Typography>
                                <Typography variant="body1">Aprov. games: {player?.gamesRatio}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Typography variant="h6">Vitórias</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <ResponsiveContainer aspect={1.2} maxHeight={300}>
                                <LineChart data={data}>
                                    <Line type="monotone" dataKey="accWinRatio" stroke="#8884d8" />
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

                    <Typography variant="h6">Games</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <ResponsiveContainer aspect={1.2} maxHeight={300}>
                                <LineChart data={data}>
                                    <Line type="monotone" dataKey="accGamesRatio" stroke="#8884d8" />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey={"date"} />
                                    <YAxis domain={[0, 1]} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ResponsiveContainer aspect={1.2} maxHeight={300}>
                                <BarChart data={data}>
                                    <Bar type="monotone" dataKey="gamesRatio" stroke="#8884d8" />
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
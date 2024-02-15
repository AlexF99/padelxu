import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Stats, usePadelStore } from "../../zustand/padelStore";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type Data = {
    id: string,
    name: string
}


export default function PlayerInfo() {
    const { id } = useParams();
    const [player, setPlayer] = useState<Stats>()
    const [data, setData] = useState<Data[]>()
    const { matches, leaderboard, fetchPlayers, fetchMatches, isLoading, setIsLoading, group } = usePadelStore();

    const refresh = async () => {
        setIsLoading(true)
        await fetchMatches()
        await fetchPlayers()
        setIsLoading(false)
    }

    useEffect(() => {
        if (!group.id.length) return;
        if (leaderboard.length < 1) refresh();
        const foundPlayer = leaderboard.find((p: Stats) => p.id === id)
        setPlayer(foundPlayer)
        let newData: any = [];
        Object.keys(matches).reverse().forEach(day => {
            const d = matches[day].reduce((acc: any, match: any) => {
                let won = false;
                let played = true
                if (match.teamOne.players.find((p: any) => p.id === id)) {
                    won = match.teamOne.points > match.teamTwo.points
                } else if (match.teamTwo.players.find((p: any) => p.id === id)) {
                    won = match.teamTwo.points > match.teamOne.points
                } else played = false;
                return {
                    ...acc,
                    m: acc.m + (played ? 1 : 0),
                    wins: acc.wins + (won ? 1 : 0),
                    ratio: (acc.wins + (won ? 1 : 0)) / (acc.m + (played ? 1 : 0))
                }
            }, { m: 0, wins: 0, ratio: 0, accRatio: 0, date: day })
            newData.push({ ...d, accRatio: newData.reduce((acc: any, dayData: any) => { return acc + dayData.wins }, d.wins) / newData.reduce((acc: any, dayData: any) => { return acc + dayData.m }, d.m) })
        })

        setData(newData)
    }, [group, matches, leaderboard])

    return (
        <Box className="PageContainer">
            {group.id.length ? isLoading
                ? <CircularProgress color="success" />
                : <>
                    <Typography variant="h3">{player?.name}</Typography>
                    <Box className="ArrayContainer">
                        <Typography variant="body1">Matches: {player?.matches}</Typography>
                        <Typography variant="body1">Wins: {player?.wins}</Typography>
                        <Typography variant="body1">Ratio: {player?.ratio}</Typography>
                    </Box>
                    <LineChart width={350} height={200} data={data}>
                        <Line type="monotone" dataKey="accRatio" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey={"date"} />
                        <YAxis domain={[0, 1]} />
                    </LineChart>
                    <BarChart width={350} height={200} data={data}>
                        <Bar type="monotone" dataKey="ratio" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey={"date"} />
                        <YAxis domain={[0, 1]} />
                    </BarChart>
                </>
                : <Box>Selecione um grupo</Box>
            }
        </Box>
    )
}
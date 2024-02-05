import { Box, MenuItem, Select, Typography } from "@mui/material";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

enum Criteria {
    WINS = 'wins',
    SETS = 'sets',
    RATIO = 'ratio',
}

export default function Leaderboard() {
    const [criteria, setCriteria] = useState<Criteria>(Criteria.WINS)
    const [players, setPlayers] = useState<any>({})
    const [sortedIds, setSortedIds] = useState<string[]>([])

    const handleChange = (e: any) => {
        setCriteria(e.target.value)
    }

    const getPlayers = async (criteria: Criteria) => {
        const playerq = query(collection(db, "players"));
        const playerQuerySnapshot = await getDocs(playerq);
        const updatedplayers: any = {};
        playerQuerySnapshot.forEach((doc) => {
            updatedplayers[doc.id] = { name: doc.data().name, wins: 0, sets: 0, matches: 0 }
        });

        const matchq = query(collection(db, "matches"));
        const matchQuerySnapshot = await getDocs(matchq);
        matchQuerySnapshot.forEach((doc) => {
            const match = doc.data();
            match.teamOne.players.forEach((player: any) => {
                if (updatedplayers[player.id]) {
                    updatedplayers[player.id] = {
                        ...updatedplayers[player.id],
                        sets: updatedplayers[player.id].sets + match.teamOne.points,
                        wins: updatedplayers[player.id].wins + (match.teamOne.points > match.teamTwo.points ? 1 : 0),
                        matches: updatedplayers[player.id].matches + 1
                    }
                }
            });
            match.teamTwo.players.forEach((player: any) => {
                if (updatedplayers[player.id]) {
                    updatedplayers[player.id] = {
                        ...updatedplayers[player.id],
                        sets: updatedplayers[player.id].sets + match.teamTwo.points,
                        wins: updatedplayers[player.id].wins + (match.teamTwo.points > match.teamOne.points ? 1 : 0),
                        matches: updatedplayers[player.id].matches + 1
                    }
                }
            });
        });

        Object.keys(updatedplayers).forEach(key => updatedplayers[key] = {
            ...updatedplayers[key],
            ratio: updatedplayers[key].matches > 0 ? (updatedplayers[key].wins / updatedplayers[key].matches).toFixed(2) : 0
        })

        const keysSorted = Object.keys(updatedplayers).sort(function (a, b) { return updatedplayers[b][criteria] - updatedplayers[a][criteria] })
        setSortedIds(keysSorted)
        setPlayers(updatedplayers)
    }

    useEffect(() => {
        getPlayers(criteria);
    }, [criteria])


    return (
        <Box className="PageContainer">
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={criteria}
                label="Age"
                onChange={handleChange}
            >
                <MenuItem value="wins">wins</MenuItem>
                <MenuItem value="sets">sets</MenuItem>
                <MenuItem value="ratio">ratio</MenuItem>
            </Select>
            {players && sortedIds.map((playerid) => (
                <Box key={playerid} className="ArrayContainer">
                    <Typography variant="subtitle1" fontWeight="bold">
                        {players[playerid]?.name}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                        wins: {players[playerid]?.wins}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                        matches: {players[playerid]?.matches}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                        sets: {players[playerid]?.sets}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                        ratio: {players[playerid]?.ratio}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}
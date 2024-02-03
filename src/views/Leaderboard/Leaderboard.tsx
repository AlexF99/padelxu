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

    const getPlayers = async () => {
        const playerq = query(collection(db, "players"));
        const playerQuerySnapshot = await getDocs(playerq);
        const updatedplayers: any = {};
        playerQuerySnapshot.forEach((doc) => {
            updatedplayers[doc.id] = { name: doc.data().name, points: 0 }
        });

        const matchq = query(collection(db, "matches"));
        const matchQuerySnapshot = await getDocs(matchq);
        const pointsMap: any = {};
        matchQuerySnapshot.forEach((doc) => {
            const match = doc.data();
            if (match.teamOne.points > match.teamTwo.points) {

                pointsMap[match.teamOne.players[0].id] = (pointsMap[match.teamOne.players[0].id] ?? 0) + 1
                pointsMap[match.teamOne.players[1].id] = (pointsMap[match.teamOne.players[1].id] ?? 0) + 1
            } else {
                pointsMap[match.teamTwo.players[0].id] = (pointsMap[match.teamTwo.players[0].id] ?? 0) + 1
                pointsMap[match.teamTwo.players[1].id] = (pointsMap[match.teamTwo.players[1].id] ?? 0) + 1
            }

        });
        Object.keys(pointsMap).forEach(playerid => {
            if (updatedplayers[playerid]) {
                updatedplayers[playerid] = { ...updatedplayers[playerid], points: pointsMap[playerid] }
            }
        })

        const keysSorted = Object.keys(updatedplayers).sort(function (a, b) { return updatedplayers[b].points - updatedplayers[a].points })
        setSortedIds(keysSorted)
        setPlayers(updatedplayers)
    }

    useEffect(() => {
        getPlayers();
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
                        {players[playerid]?.points}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}
import { Box, Button, CircularProgress, Fab, Grid, Typography } from "@mui/material";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link, useNavigate } from "react-router-dom";
import { usePadelStore } from "../../../zustand/padelStore";
import { Route } from "../../../router";

export default function MatchForm() {
    const [allPlayers, setAllPlayers] = useState<any[]>([])
    const [teamOne, setTeamOne] = useState<any>([])
    const [teamTwo, setTeamTwo] = useState<any>([])
    const [points, setPoints] = useState<{ 0: number, 1: number }>({ 0: 0, 1: 0 })
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const { fetchMatches, fetchLeaderboard, group, isLoggedIn } = usePadelStore();

    const navigate = useNavigate();

    const getPlayers = async () => {
        setIsLoading(true);
        const q = query(collection(db, "players"), where("group", "==", group.id));
        const querySnapshot = await getDocs(q);
        const updatedplayers: any = []
        querySnapshot.forEach((doc) => {
            updatedplayers.push({ id: doc.id, name: doc.data().name })
        });
        setAllPlayers(updatedplayers);
        setIsLoading(false);
    }

    const addToTeam = (teamNumber: number, player: any) => {
        if (teamNumber === 0) {
            if (!teamOne.includes(player)) {
                setTeamOne([...teamOne, player])
            }
        } else {
            if (!teamTwo.includes(player)) {
                setTeamTwo([...teamTwo, player])
            }
        }
        setAllPlayers(allPlayers.filter(p => p.id !== player.id))
    }

    const removeFromTeam = (team: number, player: any) => {
        setAllPlayers([...allPlayers, player])
        if (team === 0) {
            setTeamOne(teamOne.filter((p: any) => p.id !== player.id))
        } else {
            setTeamTwo(teamTwo.filter((p: any) => p.id !== player.id))
        }
    }

    useEffect(() => {
        getPlayers();
    }, [])


    const saveMatch = async () => {
        if (teamOne.length < 2 || teamTwo.length < 2 || (points[0] === points[1]) || group.id.length < 1) return;
        const match = {
            group: group.id,
            teamOne: { points: points[0], players: teamOne },
            teamTwo: { points: points[1], players: teamTwo },
            date: new Date()
        }

        await addDoc(collection(db, "groups", group.id, "matches"), { ...match });
        fetchMatches();
        fetchLeaderboard();
        navigate(Route.MATCHES)
    }

    return (
        <Box>
            {!isLoggedIn
                ? <div>
                    <Button variant='contained' style={{ marginRight: "5px" }}>
                        <Link style={{ color: "#fff", textDecoration: "none" }} to={Route.LOGIN}>Login</Link>
                    </Button>
                    para adicionar partidas
                </div>
                : isLoading
                    ? <CircularProgress color="success" />
                    : <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <h3>Time 1</h3>
                        </Grid>
                        <Grid item xs={6}>
                            {teamOne.length < 2 ? allPlayers.map((player) => (
                                <Box onClick={() => addToTeam(0, player)} key={player.id} className="ArrayContainer">
                                    <span>
                                        {player.name}
                                    </span>
                                </Box>
                            )) :
                                <Box>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Fab size="small" color="secondary" aria-label="minus"
                                            onClick={() => { points[0] > 0 ? setPoints({ ...points, 0: points[0] - 1 }) : setPoints(points) }}>
                                            <RemoveIcon />
                                        </Fab>
                                        <Typography variant="subtitle1">{points[0]}</Typography>
                                        <Fab size="small" color="secondary" aria-label="add"
                                            onClick={() => { setPoints({ ...points, 0: points[0] + 1 }) }}>
                                            <AddIcon />
                                        </Fab>
                                    </div>
                                </Box>
                            }
                        </Grid>
                        <Grid item xs={6}>
                            {!!teamOne && teamOne.map((player: any) => (
                                <Box onClick={() => removeFromTeam(0, player)} key={player.id} className="ArrayContainer">
                                    <span>
                                        {player.name}
                                    </span>
                                </Box>
                            ))}
                        </Grid>
                        <Grid item xs={12}>
                            <h3>Time 2</h3>
                        </Grid>
                        <Grid item xs={6}>
                            {teamTwo.length < 2 ? allPlayers.map((player) => (
                                <Box onClick={() => addToTeam(1, player)} key={player.id} className="ArrayContainer">
                                    <span>
                                        {player.name}
                                    </span>
                                </Box>
                            )) :
                                <Box>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Fab size="small" color="secondary" aria-label="minus"
                                            onClick={() => { points[1] > 0 ? setPoints({ ...points, 1: points[1] - 1 }) : setPoints(points) }}>
                                            <RemoveIcon />
                                        </Fab>
                                        <Typography variant="subtitle1">{points[1]}</Typography>
                                        <Fab size="small" color="secondary" aria-label="add"
                                            onClick={() => { setPoints({ ...points, 1: points[1] + 1 }) }}>
                                            <AddIcon />
                                        </Fab>
                                    </div>
                                </Box>
                            }
                        </Grid>
                        <Grid item xs={6}>
                            {!!teamTwo && teamTwo.map((player: any) => (
                                <Box onClick={() => removeFromTeam(1, player)} key={player.id} className="ArrayContainer">
                                    <span>
                                        {player.name}
                                    </span>
                                </Box>
                            ))}
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={saveMatch}>Save</Button>
                        </Grid>
                    </Grid>
            }
        </Box>
    )
}
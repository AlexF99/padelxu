import { Box, Button, Fab, Grid, Typography } from '@mui/material'
import { collection, query, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from '../../firebase';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const Home = () => {
    const [matches, setMatches] = useState<any[]>([]);

    const getMatches = async () => {
        const q = query(collection(db, "matches"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const updatedMatches: any = []
        querySnapshot.forEach((doc) => {
            updatedMatches.push({ id: doc.id, ...doc.data() })
        });
        setMatches(updatedMatches)
    }

    useEffect(() => {
        getMatches();
    }, [])

    const removeMatch = async (matchId: string) => {
        await deleteDoc(doc(db, "matches", matchId));
        await getMatches();
    }

    return (
        <Box className="PageContainer">
            <Button variant='contained'>
                <Link to={"/newmatch"}>Nova Partida</Link>
            </Button>
            {matches.map((item) => (
                <Box key={item.id} className="ArrayContainer">
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <h3>time 1</h3>
                            <Typography variant="subtitle1" fontWeight="bold">{item.teamOne.players[0].name}</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">{item.teamOne.players[1].name}</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">{item.teamOne.points}</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <h3>time 2</h3>
                            <Typography variant="subtitle1" fontWeight="bold">{item.teamTwo.players[0].name}</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">{item.teamTwo.players[1].name}</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">{item.teamTwo.points}</Typography>
                        </Grid>
                        <Grid item xs={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Fab onClick={() => removeMatch(item.id)} size="small" color="error" aria-label="remove">
                                <CloseIcon />
                            </Fab>
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </Box>
    )
}

export default Home

import { Box, Button, Grid, Typography } from '@mui/material'
import { collection, query, getDocs } from "firebase/firestore";
import { db } from '../../firebase';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [matches, setMatches] = useState<any[]>([]);

    const getMatches = async () => {
        const q = query(collection(db, "matches"));
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

    return (
        <Box className="PageContainer">
            <Button variant='contained'>
                <Link to={"/newmatch"}>Nova Partida</Link>
            </Button>
            {matches.map((item) => (
                <Box key={item.id} className="ArrayContainer">
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <h3>time 1</h3>
                            <Typography variant="subtitle1" fontWeight="bold">{item.teamOne.players[0].name}</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">{item.teamOne.players[1].name}</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">{item.teamOne.points}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <h3>time 2</h3>
                            <Typography variant="subtitle1" fontWeight="bold">{item.teamTwo.players[0].name}</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">{item.teamTwo.players[1].name}</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">{item.teamTwo.points}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </Box>
    )
}

export default Home

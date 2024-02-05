import { Box, Fab, Grid, Typography } from "@mui/material";
import PlayerForm from "../../components/molecules/PlayerForm/PlayerForm";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import CloseIcon from '@mui/icons-material/Close';


const Players = () => {
    const [players, setPlayers] = useState<any[]>([]);

    const getPlayers = async () => {
        const q = query(collection(db, "players"));
        const querySnapshot = await getDocs(q);
        const updatedplayers: any = []
        querySnapshot.forEach((doc) => {
            updatedplayers.push({ id: doc.id, name: doc.data().name })
        });
        setPlayers(updatedplayers)
    }

    useEffect(() => {
        getPlayers();
    }, [])


    const removePlayer = async (playerId: string) => {
        await deleteDoc(doc(db, "players", playerId));
        await getPlayers();
    }

    return (
        <Box className="PageContainer">
            <PlayerForm updatePlayers={getPlayers} />
            {(players && players.length) && players.map((item) => (
                <Box key={item.id} className="ArrayContainer">
                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {item.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Fab onClick={() => removePlayer(item.id)} size="small" color="error" aria-label="remove">
                                <CloseIcon />
                            </Fab>
                        </Grid>
                    </Grid>

                </Box>
            ))}
        </Box>
    )
}

export default Players;
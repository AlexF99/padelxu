import { Box, Button, Dialog, DialogActions, DialogTitle, Fab, Grid, Typography } from "@mui/material";
import PlayerForm from "../../components/molecules/PlayerForm/PlayerForm";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import CloseIcon from '@mui/icons-material/Close';


const Players = () => {
    const [players, setPlayers] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [playerDelete, setPlayerDelete] = useState("");

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

    const handleClickOpen = (matchId: string) => {
        setOpen(true);
        setPlayerDelete(matchId);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAgree = async () => {
        await deleteDoc(doc(db, "players", playerDelete));
        await getPlayers();
        handleClose();
    }

    return (
        <Box className="PageContainer">
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Tem certeza que quer remover jogador?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Não</Button>
                    <Button onClick={handleAgree} autoFocus>
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
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
                            <Fab onClick={() => handleClickOpen(item.id)} size="small" color="error" aria-label="remove">
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
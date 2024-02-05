import { Box, Button, CircularProgress, Dialog, DialogActions, DialogTitle, Fab, Grid, Typography } from "@mui/material";
import PlayerForm from "../../components/molecules/PlayerForm/PlayerForm";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import CloseIcon from '@mui/icons-material/Close';
import { useStore } from "../../zustand/store";


const Players = () => {
    const [open, setOpen] = useState(false);
    const [playerDelete, setPlayerDelete] = useState("");
    const { players, fetchPlayers, isLoading, setIsLoading, fetchLeaderboard } = useStore();

    const updatePlayers = async () => {
        setIsLoading(true);
        await fetchPlayers();
        setIsLoading(false);
    }

    useEffect(() => {
        if (players.length < 1)
            updatePlayers();
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
        await updatePlayers();
        fetchLeaderboard();
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
            <PlayerForm />
            {isLoading
                ? <CircularProgress color="success" />
                : players && players.map((item: any) => (
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
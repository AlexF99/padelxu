import { Box, Button, CircularProgress, Dialog, DialogActions, DialogTitle, Fab, Grid, Typography } from '@mui/material'
import { deleteDoc, doc } from "firebase/firestore";
import { db } from '../../firebase';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { usePadelStore } from '../../zustand/padelStore';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuthStore } from '../../zustand/authStore';

const Home = () => {
    const [open, setOpen] = useState(false);
    const [matchDelete, setMatchDelete] = useState("");

    const { matches, fetchMatches, isLoading, setIsLoading, fetchLeaderboard } = usePadelStore();
    const { isLoggedIn } = useAuthStore();

    const handleClickOpen = (matchId: string) => {
        setOpen(true);
        setMatchDelete(matchId);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getMatches = async () => {
        setIsLoading(true);
        await fetchMatches();
        setIsLoading(false);
    }

    useEffect(() => {
        if (matches.length < 1)
            getMatches();
    }, [])

    const handleAgree = async () => {
        await deleteDoc(doc(db, "matches", matchDelete));
        await getMatches();
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
                    {"Tem certeza que quer apagar partida?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Não</Button>
                    <Button onClick={handleAgree} autoFocus>
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
            <div>
                {isLoggedIn &&
                    <Button variant='contained'>
                        <Link style={{ color: "#fff", textDecoration: "none" }} to={"/newmatch"}>Nova Partida</Link>
                    </Button>
                }
                <Button type="button" color='success' onClick={getMatches}><RefreshIcon /></Button>
            </div>
            {isLoading
                ? <CircularProgress color="success" />
                : matches.map((item: any) => (
                    <Box key={item.id} className="ArrayContainer">
                        <Grid container spacing={2}>
                            <Grid item xs={isLoggedIn ? 5 : 6}>
                                <h3>Time 1</h3>
                                <Typography variant="subtitle1" fontWeight="bold">{item.teamOne.players[0].name}</Typography>
                                <Typography variant="subtitle1" fontWeight="bold">{item.teamOne.players[1].name}</Typography>
                                <Typography variant="subtitle1" fontWeight="bold">{item.teamOne.points}</Typography>
                            </Grid>
                            <Grid item xs={isLoggedIn ? 5 : 6}>
                                <h3>Time 2</h3>
                                <Typography variant="subtitle1" fontWeight="bold">{item.teamTwo.players[0].name}</Typography>
                                <Typography variant="subtitle1" fontWeight="bold">{item.teamTwo.players[1].name}</Typography>
                                <Typography variant="subtitle1" fontWeight="bold">{item.teamTwo.points}</Typography>
                            </Grid>
                            <Grid item xs={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {isLoggedIn &&
                                    <Fab onClick={() => handleClickOpen(item.id)} size="small" color="error" aria-label="remove">
                                        <CloseIcon />
                                    </Fab>
                                }
                            </Grid>
                        </Grid>
                    </Box>
                ))}
        </Box>
    )
}

export default Home

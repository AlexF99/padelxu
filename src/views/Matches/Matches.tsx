import { Box, Button, CircularProgress, Dialog, DialogActions, DialogTitle, Fab, Grid, Typography } from '@mui/material'
import { deleteDoc, doc } from "firebase/firestore";
import { db } from '../../firebase';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { usePadelStore } from '../../zustand/padelStore';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuthStore } from '../../zustand/authStore';
import { Route } from '../../router';

const Matches = () => {
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
        if (Object.keys(matches).length < 1)
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
                        <Link style={{ color: "#fff", textDecoration: "none" }} to={Route.NEW_MATCH}>Nova Partida</Link>
                    </Button>
                }
                <Button type="button" color='success' onClick={getMatches}><RefreshIcon /></Button>
            </div>
            {isLoading
                ? <CircularProgress color="success" />
                : Object.keys(matches).map((date: any) => (
                    <Fragment key={date}>
                        <Typography variant="subtitle1" fontWeight="bold">{date} ({matches[date].length} partidas)</Typography>
                        {matches[date].map((item: any) => (
                            <Box key={item.id} className="ArrayContainer">
                                <Grid container spacing={2}>
                                    <Grid item xs={isLoggedIn ? 5 : 6} sx={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                        <Typography variant="subtitle1" fontWeight="bold">{item.teamOne.players[0].name + " e " + item.teamOne.players[1].name}</Typography>
                                        <Typography variant="subtitle1" fontWeight="bold">{item.teamOne.points}</Typography>
                                    </Grid>
                                    <Grid item xs={isLoggedIn ? 5 : 6} sx={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                        <Typography variant="subtitle1" fontWeight="bold">{item.teamTwo.players[0].name + " e " + item.teamTwo.players[1].name}</Typography>
                                        <Typography variant="subtitle1" fontWeight="bold">{item.teamTwo.points}</Typography>
                                    </Grid>
                                    {isLoggedIn &&
                                        <Grid item xs={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Fab onClick={() => handleClickOpen(item.id)} size="small" color="error" aria-label="remove">
                                                <CloseIcon />
                                            </Fab>
                                        </Grid>
                                    }
                                </Grid>
                            </Box>
                        ))}
                    </Fragment>
                ))}
        </Box>
    )
}

export default Matches

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogTitle, Grid, IconButton, Typography, useTheme } from '@mui/material'
import { deleteDoc, doc } from "firebase/firestore";
import { db } from '../../firebase';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { usePadelStore } from '../../zustand/padelStore';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Route } from '../../router';

const Matches = () => {
    const [open, setOpen] = useState(false);
    const [matchDelete, setMatchDelete] = useState("");
    const theme = useTheme();

    const { isLoggedIn, isManager, matches, fetchMatches, isLoading, setIsLoading, fetchLeaderboard, group } = usePadelStore();

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
        if (!isManager) return;
        await deleteDoc(doc(db, "groups", group.id, "matches", matchDelete));
        await getMatches();
        fetchLeaderboard();
        handleClose();
    }

    const gridItemStyle = { display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center" }

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
                            <Box key={item.id} className="ArrayContainer" sx={{ position: "relative" }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={5} sx={gridItemStyle}>
                                        {item.teamOne.points > item.teamTwo.points && <EmojiEventsIcon fontSize='small' color='success' />}
                                        <Typography variant="subtitle1" fontWeight="bold" fontSize="small">{item.teamOne.players[0].name + " e " + item.teamOne.players[1].name}</Typography>
                                    </Grid>
                                    <Grid item xs={2} sx={gridItemStyle}>
                                        <Typography variant="subtitle1" fontWeight="bold">{item.teamOne.points + " x " + item.teamTwo.points}</Typography>
                                    </Grid>
                                    <Grid item xs={5} sx={gridItemStyle}>
                                        {item.teamOne.points < item.teamTwo.points && <EmojiEventsIcon fontSize='small' color='success' />}
                                        <Typography variant="subtitle1" fontWeight="bold" fontSize="small">{item.teamTwo.players[0].name + " e " + item.teamTwo.players[1].name}</Typography>
                                    </Grid>
                                    {isLoggedIn && isManager &&
                                        <IconButton sx={{ position: "absolute", top: "-4px", right: "-7px", backgroundColor: `${theme.palette.error.main}`, padding: "1px" }}
                                            onClick={() => handleClickOpen(item.id)} size="small" color={"primary"} aria-label="remove">
                                            <CloseIcon fontSize='small' />
                                        </IconButton>
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

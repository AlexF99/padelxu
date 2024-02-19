import { Box, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import GroupIcon from '@mui/icons-material/Group';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import GroupsIcon from '@mui/icons-material/Groups';
import { Route } from '../../router';
import GlobalAddAction from '../../components/molecules/GlobalAddAction/GlobalAddAction';
import { usePadelStore } from '../../zustand/padelStore';

const Home = () => {
    const { isLoggedIn } = usePadelStore()

    const links = isLoggedIn ?
        [
            { label: "Partidas", route: Route.MATCHES, icon: <SportsTennisIcon /> },
            { label: "Jogadores", route: Route.PLAYERS, icon: <PersonAddIcon /> },
            { label: "Duplas", route: Route.TEAMS, icon: <GroupIcon /> },
            { label: "Leaderboard", route: Route.LEADERBOARD, icon: <LeaderboardIcon /> },
            { label: "Meus Grupos", route: Route.GROUPS, icon: <GroupsIcon /> },
        ] :
        [
            { label: "Partidas", route: Route.MATCHES, icon: <SportsTennisIcon /> },
            { label: "Duplas", route: Route.TEAMS, icon: <GroupIcon /> },
            { label: "Leaderboard", route: Route.LEADERBOARD, icon: <LeaderboardIcon /> },
        ]

    return (
        <Box className="PageContainer">
            <Grid container spacing={2}>
                {links.map(link => (
                    <Grid item xs={6} key={link.route}>
                        <Link className='ArrayContainer' style={{ color: "#fff", textDecoration: "none", display: "flex" }} to={link.route}>
                            {link.icon}
                            <Typography variant="body1" fontWeight="bold">{link.label}</Typography>
                        </Link>
                    </Grid>
                ))}
            </Grid>
            <GlobalAddAction />
        </Box>
    )
}

export default Home;

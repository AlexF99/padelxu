import { Box, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import GroupIcon from '@mui/icons-material/Group';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Home = () => {

    const links = [
        { label: "Partidas", route: "/matches", icon: <SportsTennisIcon /> },
        { label: "Jogadores", route: "/players", icon: <PersonAddIcon /> },
        { label: "Duplas", route: "/teams", icon: <GroupIcon /> },
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

        </Box>
    )
}

export default Home

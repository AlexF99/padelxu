import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'


const Home = () => {

    const links = [
        { label: "Partidas", route: "/matches" },
        { label: "Jogadores", route: "/players" },
        { label: "Duplas", route: "/teams" },
    ]

    return (
        <Box className="PageContainer">
            {links.map(link => (
                <Link className='ArrayContainer' key={link.route} style={{ color: "#fff", textDecoration: "none" }} to={link.route}>
                    <Typography variant="subtitle1" fontWeight="bold">{link.label}</Typography>
                </Link>
            ))}
        </Box>
    )
}

export default Home

import { Avatar, Box, Button, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom';
import { Route } from '../../router';
import { usePadelStore } from '../../zustand/padelStore';
import GroupsIcon from '@mui/icons-material/Groups';

const Profile = () => {

    const { isLoggedIn, loggedUser } = usePadelStore();
    const links = [
        { label: "Meus Grupos", route: Route.GROUPS, icon: <GroupsIcon /> },
    ]

    return (
        <Box className="PageContainer">
            {isLoggedIn
                ? <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Avatar
                            alt="photo"
                            src={loggedUser.photoURL || ""}
                            sx={{ width: 100, height: 100, objectFit: 'cover' }}
                        />
                    </Grid>
                    <Grid item xs={8} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="subtitle1" fontWeight="bold">{loggedUser.email}</Typography>
                    </Grid>
                    {links.map(link => (
                        <Grid key={link.route} item xs={12} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Link className='ArrayContainer' style={{ color: "#fff", textDecoration: "none", display: "flex" }} to={link.route}>
                                {link.icon}
                                <Typography variant="body1" fontWeight="bold">{link.label}</Typography>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
                : <Box>
                    <Button variant='contained' style={{ marginRight: "5px" }}>
                        <Link style={{ color: "#fff", textDecoration: "none" }} to={Route.LOGIN}>Login</Link>
                    </Button>
                    para ver perfil
                </Box>}
        </Box>
    )
}

export default Profile;

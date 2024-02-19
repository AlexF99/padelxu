import { Box, Button, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom';
import { Route } from '../../router';
import { usePadelStore } from '../../zustand/padelStore';

const Profile = () => {

    const { isLoggedIn, loggedUser } = usePadelStore();

    return (
        <Box className="PageContainer">
            {isLoggedIn
                ? <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body1" fontWeight="normal">{loggedUser.email}</Typography>
                    </Grid>
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

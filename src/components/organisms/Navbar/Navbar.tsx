import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'

import { Route } from '../../../router'

import styles from './Navbar.module.css'
import { useState } from 'react'
import UserAvatar from '../../molecules/UserAvatar/UserAvatar'
import { getAuth, signOut } from "firebase/auth";
import { useAuthStore } from '../../../zustand/authStore'

const Navbar = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
    const navigate = useNavigate()
    const { signUserOut } = useAuthStore();


    const handleSignOut = () => {
        setAnchorElUser(null)
        const auth = getAuth();
        signOut(auth).then(() => {
            signUserOut();
            navigate(Route.LOGIN)
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    return (
        <AppBar position="static" color="primary" className={styles.Navbar}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    <Box
                        className={styles.FlexCentered}
                        onClick={() => navigate(Route.HOME)}
                    >
                        <RocketLaunchIcon
                            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
                        />
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Xupadel
                        </Typography>
                    </Box>

                    <RocketLaunchIcon
                        sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
                        onClick={() => navigate(Route.HOME)}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        onClick={() => navigate(Route.HOME)}
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Xupadel
                    </Typography>

                    <UserAvatar
                        avatarImageAlt="user-avatar"
                        handleOpenUserMenu={handleOpenUserMenu}
                        handleCloseUserMenu={handleCloseUserMenu}
                        handleSignOut={handleSignOut}
                        anchorElUser={anchorElUser}
                    />
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar

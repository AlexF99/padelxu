import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Route } from '../../../router'
import styles from './Navbar.module.css'
import { useEffect, useState } from 'react'
import UserAvatar from '../../molecules/UserAvatar/UserAvatar'
import { getAuth, signOut } from "firebase/auth";
import { useAuthStore } from '../../../zustand/authStore'
import { Modal } from '@mui/material'
import GroupsModal from '../GroupsModal/GroupsModal'
import { usePadelStore } from '../../../zustand/padelStore'

const Navbar = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
    const navigate = useNavigate()
    const { signUserOut } = useAuthStore();

    const { group } = usePadelStore();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (group.id.length < 1)
            setOpen(true)
    }, [])


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
                        <SportsBaseballIcon
                            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, cursor: 'pointer' }}
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
                                cursor: 'pointer'
                            }}
                        >
                            xp
                        </Typography>
                    </Box>

                    <SportsBaseballIcon
                        sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, cursor: 'pointer' }}
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
                            cursor: 'pointer'
                        }}
                    >
                        xp
                    </Typography>

                    <Typography
                        variant="h5"
                        noWrap
                        onClick={handleOpen}
                        sx={{
                            mr: 2,
                            fontFamily: 'monospace',
                            cursor: "pointer",
                            display: "flex"
                        }}
                    >
                        <ExpandMoreIcon />
                        {group.name}
                    </Typography>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <>
                            <GroupsModal onClose={handleClose} />
                        </>
                    </Modal>

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

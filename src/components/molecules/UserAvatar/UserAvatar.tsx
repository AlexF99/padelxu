import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'

import AvatarProps from '../../../types/AvatarProps'
import { useNavigate } from 'react-router-dom'
import { Route } from '../../../router'
import { usePadelStore } from '../../../zustand/padelStore'

const UserAvatar = (props: AvatarProps) => {
    const {
        handleOpenUserMenu,
        handleCloseUserMenu,
        handleSignOut,
        anchorElUser,
    } = props

    const { isLoggedIn, loggedUser } = usePadelStore();
    const navigate = useNavigate();

    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Log in or out">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                        alt={'photo'}
                        src={loggedUser.photoURL || ''}
                    />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {isLoggedIn
                    ?
                    <Box>
                        <MenuItem>
                            <Typography textAlign="center">{loggedUser.email}</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleSignOut}>
                            <Typography textAlign="center">Logout</Typography>
                        </MenuItem>
                    </Box>
                    : <MenuItem onClick={() => navigate(Route.LOGIN)}>
                        <Typography textAlign="center">Login</Typography>
                    </MenuItem>
                }
            </Menu>
        </Box>
    )
}

export default UserAvatar

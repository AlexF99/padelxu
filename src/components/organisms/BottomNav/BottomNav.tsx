import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Route } from '../../../router'

import styles from './BottomNav.module.css'

const BottomNav = () => {
    const [value, setValue] = useState(0)
    const navigate = useNavigate()

    return (
        <Box className={styles.Container}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue)
                    switch (newValue) {
                        case 0:
                            navigate(Route.HOME)
                            break
                        case 1:
                            navigate(Route.LEADERBOARD)
                            break
                        case 2:
                            navigate(Route.PROFILE)
                            break
                    }
                }}
            >
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Leaderboard" icon={<LeaderboardIcon />} />
                <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
            </BottomNavigation>
        </Box>
    )
}

export default BottomNav

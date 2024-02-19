import { Box, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Group, usePadelStore } from '../../zustand/padelStore';
import { useNavigate } from 'react-router-dom';
import { Route } from '../../router';


const Groups = () => {

    const { loggedUser, groups, fetchGroups } = usePadelStore();
    const navigate = useNavigate();


    useEffect(() => {
        fetchGroups(loggedUser.email)
    }, [])

    return (
        <Box className="PageContainer">
            <Typography variant='h3'>Grupos</Typography>
            {groups && groups.map((g: Group) => (
                <Box key={g.id} className="ArrayContainer" onClick={() => { navigate(Route.GROUPS + "/" + g.id) }}>
                    <Typography id="modal-modal-description">{g.name}</Typography>
                </Box>
            ))}
        </Box>
    )
}

export default Groups;

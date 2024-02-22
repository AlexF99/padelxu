import { Box, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Group, usePadelStore } from '../../zustand/padelStore';
import { useNavigate } from 'react-router-dom';
import { Route } from '../../router';
import GroupForm from '../../components/molecules/GroupForm/GroupForm';


const Groups = () => {

    const { loggedUser, isLoggedIn, groups, fetchGroups } = usePadelStore();
    const navigate = useNavigate();


    useEffect(() => {
        fetchGroups(loggedUser.email)
    }, [])

    return (
        <Box className="PageContainer">
            <Typography variant='h3'>Meus Grupos</Typography>
            {isLoggedIn && <GroupForm />}

            {groups && !!loggedUser.email && groups.filter((g: Group) => g.createdBy === loggedUser.email).map((g: Group) => (
                <Box key={g.id} className="ArrayContainer" onClick={() => { navigate(Route.GROUPS + "/" + g.id) }}>
                    <Typography id="modal-modal-description">{g.name}</Typography>
                </Box>
            ))}
        </Box>
    )
}

export default Groups;

import { Box, Typography } from '@mui/material'
import { Group, usePadelStore } from '../../zustand/padelStore';
import { useNavigate } from 'react-router-dom';
import { Route } from '../../router';
import GroupForm from '../../components/molecules/GroupForm/GroupForm';
import { fetchGroups } from '../../api/api';
import { useQuery } from '@tanstack/react-query';


const Groups = () => {

    const { loggedUser, isLoggedIn } = usePadelStore();
    const navigate = useNavigate();

    const { data: groups } = useQuery({
        queryKey: ['groups'],
        queryFn: () => fetchGroups(loggedUser.email),
    })

    return (
        <Box className="PageContainer">
            <Typography variant='h3'>Meus Grupos</Typography>
            {isLoggedIn && <GroupForm />}

            {groups && !!loggedUser.email && groups.filter((g: Group) => g.createdBy === loggedUser.email).map((g: Group) => (
                <Box key={g.id} className="ArrayContainer" onClick={() => { navigate(Route.GROUPS + "/" + g.id) }}>
                    <Typography id="modal-modal-description">{g.name}</Typography>
                </Box>
            ))}

            <Typography variant='subtitle1'>Grupos que faço parte:</Typography>

            {groups && !!loggedUser.email && groups.filter((g: Group) => g.createdBy !== loggedUser.email).map((g: Group) => (
                <Box key={g.id} className="ArrayContainer" >
                    <Typography id="modal-modal-description">{g.name}</Typography>
                    <Typography id="modal-modal-description">{g.managers.includes(`${loggedUser.email}`) ? 'manager' : 'member'}</Typography>
                </Box>
            ))}
        </Box>
    )
}

export default Groups;

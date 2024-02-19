import { Box, Typography } from "@mui/material"
import { Group, usePadelStore } from "../../../zustand/padelStore";
import GroupForm from "../../molecules/GroupForm/GroupForm";
import { useEffect } from "react";
import { useAuthStore } from "../../../zustand/authStore";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const GroupsModal = (props: any) => {
    const { onClose } = props;
    const { group, groups, fetchGroups, setGroup, fetchLeaderboard, fetchMatches, fetchPlayers, fetchTeams } = usePadelStore();
    const { isLoggedIn, loggedUser } = useAuthStore();

    useEffect(() => {
        fetchGroups(loggedUser.email)
    }, [])

    const onChangeGroup = (group: Group) => {
        setGroup(group);
        fetchLeaderboard();
        fetchMatches();
        fetchPlayers();
        fetchTeams();
        onClose();
    }

    return (
        <Box
            className="PageContainer"
            sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                width: '90vw',
                height: '70vh',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 2,
            }}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
                Grupos
                {isLoggedIn && <GroupForm />}
            </Typography>
            {group.id.length < 1 &&
                <Typography id="modal-modal-title" variant="subtitle2">
                    Selecione um grupo
                </Typography>
            }
            {groups && groups.map((g: Group) => (
                <Box key={g.id} className="ArrayContainer" onClick={() => onChangeGroup(g)} sx={{ bgcolor: group.id === g.id ? '#efefef' : "" }}>
                    <Typography id="modal-modal-description">{g.name}</Typography>
                    {group.id === g.id && <CheckCircleIcon />}
                </Box>
            ))}
        </Box>
    )
}

export default GroupsModal;
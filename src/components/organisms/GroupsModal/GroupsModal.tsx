import { Box, Typography } from "@mui/material"
import { Group, usePadelStore } from "../../../zustand/padelStore";
import GroupForm from "../../molecules/GroupForm/GroupForm";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchGroups } from "../../../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const GroupsModal = (props: any) => {
    const { isLoggedIn, loggedUser, group, setGroup } = usePadelStore();
    const queryClient = useQueryClient();
    const { onClose } = props;
    const emptyGroup: Group = {
        id: "",
        name: "Sem grupo",
        createdBy: "",
        visibility: "",
        members: [],
        managers: [],
    }

    const { data: groups } = useQuery({
        queryKey: ['groups', { user: loggedUser.email }],
        queryFn: () => fetchGroups(loggedUser.email),
    })

    useEffect(() => {
        return () => { queryClient.invalidateQueries(); onClose(); };
    }, [group])

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
            {groups && [emptyGroup, ...groups].map((g: Group) => (
                <Box key={g.id} className="ArrayContainer" onClick={() => setGroup(g)} sx={{ bgcolor: group.id === g.id ? '#efefef' : "" }}>
                    <Typography id="modal-modal-description">{g.name}</Typography>
                    {group.id === g.id && <CheckCircleIcon />}
                </Box>
            ))}
        </Box>
    )
}

export default GroupsModal;
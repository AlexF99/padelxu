import { Box, Typography } from "@mui/material"
import { usePadelStore } from "../../../zustand/padelStore";
import GroupForm from "../../molecules/GroupForm/GroupForm";
import { useEffect } from "react";

const GroupsModal = () => {
    const { group, groups, fetchGroups, setGroup } = usePadelStore();

    useEffect(() => {
        if (groups.length < 1)
            fetchGroups()
    }, [])

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
                <GroupForm />
            </Typography>
            {group.id.length < 1 &&
                <Typography id="modal-modal-title" variant="subtitle2">
                    Selecione um grupo
                </Typography>
            }
            {groups && groups.map(g => (
                <Box key={g.id} className="ArrayContainer" onClick={() => setGroup(g)} sx={{ bgcolor: group.id === g.id ? '#efefef' : "" }}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>{g.name}</Typography>
                </Box>
            ))}
        </Box>
    )
}

export default GroupsModal;
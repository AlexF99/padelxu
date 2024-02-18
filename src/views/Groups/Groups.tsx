import { Box, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Group, usePadelStore } from '../../zustand/padelStore';


const Groups = () => {

    const { groups, fetchGroups } = usePadelStore();


    useEffect(() => {
        fetchGroups()
    }, [])

    return (
        <Box className="PageContainer">
            <Typography variant='h3'>Grupos</Typography>
            {groups && groups.map((g: Group) => (
                <Box key={g.id} className="ArrayContainer" onClick={() => { }}>
                    <Typography id="modal-modal-description">{g.name}</Typography>
                </Box>
            ))}
        </Box>
    )
}

export default Groups;

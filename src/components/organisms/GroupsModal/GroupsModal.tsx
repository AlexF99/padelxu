import { Box, Typography } from "@mui/material"

const GroupsModal = () => {
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
            </Typography>
            <Box key={1} className="ArrayContainer">
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>Grupo1</Typography>
            </Box>
        </Box>
    )
}

export default GroupsModal;
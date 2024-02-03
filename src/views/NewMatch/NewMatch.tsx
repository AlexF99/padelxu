import { Box, Button, Typography } from '@mui/material'
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';
import MatchForm from '../../components/molecules/MatchForm/MatchForm';

const NewMatch = () => {

    return (
        <Box className="PageContainer">
            <h1>Nova Partida</h1>
            <MatchForm />
        </Box>
    )
}

export default NewMatch

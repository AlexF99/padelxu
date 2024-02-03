import { Box } from '@mui/material'
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

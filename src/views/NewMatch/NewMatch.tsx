import { Box, Button } from '@mui/material'
import MatchForm from '../../components/molecules/MatchForm/MatchForm';
import { usePadelStore } from '../../zustand/padelStore';
import { Link } from 'react-router-dom';
import { Route } from '../../router';
import { useEffect } from 'react';

const NewMatch = () => {
    const { isLoggedIn, isMember, group, setGroup } = usePadelStore();

    useEffect(() => {
        setGroup(group)
    }, [])

    return (
        <Box className="PageContainer">
            <h1>Nova Partida</h1>
            {!isLoggedIn
                ? <div>
                    <Button variant='contained' style={{ marginRight: "5px" }}>
                        <Link style={{ color: "#fff", textDecoration: "none" }} to={Route.LOGIN}>Login</Link>
                    </Button>
                    para adicionar partidas
                </div>
                : isMember ? <MatchForm />
                    : <div>
                        Você precisa ser membro do grupo para adicionar partidas
                    </div>
            }
        </Box>
    )
}

export default NewMatch

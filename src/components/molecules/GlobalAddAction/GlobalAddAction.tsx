import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from "react-router-dom";
import { Route } from "../../../router";

const GlobalAddAction = () => {

    const navigate = useNavigate()

    const actions = [
        { icon: <SportsTennisIcon />, name: 'Nova Partida', route: Route.NEW_MATCH },
        { icon: <PersonAddIcon />, name: 'Novo jogador', route: Route.PLAYERS },
    ];

    const onActionClick = (route: Route) => {
        navigate(route, { replace: true })
    }

    return (
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    onClick={() => onActionClick(action.route)}
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                />
            ))}
        </SpeedDial>
    )
}

export default GlobalAddAction;
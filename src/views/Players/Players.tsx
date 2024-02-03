import { Box, Typography } from "@mui/material";
import PlayerForm from "../../components/molecules/PlayerForm/PlayerForm";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query } from "firebase/firestore";

const Players = () => {
    const [players, setPlayers] = useState<any[]>([]);

    const getPlayers = async () => {
        const q = query(collection(db, "players"));
        const querySnapshot = await getDocs(q);
        const updatedplayers: any = []
        querySnapshot.forEach((doc) => {
            updatedplayers.push({ id: doc.id, name: doc.data().name })
        });
        setPlayers(updatedplayers)
    }

    useEffect(() => {
        getPlayers();
    }, [])


    return (
        <Box className="PageContainer">
            <PlayerForm updatePlayers={getPlayers} />
            {players && players.length && players.map((item) => (
                <Box key={item.id} className="ArrayContainer">
                    <Typography variant="subtitle1" fontWeight="bold">
                        {item.name}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}

export default Players;
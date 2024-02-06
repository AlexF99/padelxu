import { Box, Button, TextField, Typography } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { SubmitHandler, useForm } from "react-hook-form";
import RefreshIcon from '@mui/icons-material/Refresh';
import { usePadelStore } from "../../../zustand/padelStore";

type Inputs = {
    name: string
}

export default function PlayerForm() {
    const { fetchLeaderboard, fetchPlayers } = usePadelStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { name } = data;
        if (name.length < 1) return;
        await addDoc(collection(db, "players"), { name });
        fetchPlayers()
        fetchLeaderboard()
        reset();
    }

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <TextField id="outlined-basic" color="primary" label="Nome" variant="filled" sx={{ backgroundColor: "#878787" }} {...register("name", { required: true })} />
                    <Typography>{errors.name && <span>Campo obrigatório</span>}</Typography>
                </div>
                <div style={{ display: "flex" }}>
                    <Button type="submit" variant="contained">add</Button>
                    <Button type="button" onClick={fetchPlayers} color="success"><RefreshIcon /></Button>
                </div>
            </form>
        </Box>
    )
}
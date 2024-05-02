import { Box, Button, TextField, Typography } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { SubmitHandler, useForm } from "react-hook-form";
import RefreshIcon from '@mui/icons-material/Refresh';
import { usePadelStore } from "../../../zustand/padelStore";
import { useQueryClient } from "@tanstack/react-query";

type Inputs = {
    name: string
}

export default function PlayerForm() {
    const { group } = usePadelStore();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

    const reloadPlayers = async () => {
        queryClient.invalidateQueries({ queryKey: ['players'] });
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { name } = data;
        if (name.length < 1 || group.id.length < 1) return;
        await addDoc(collection(db, "players"), { group: group.id, name });
        reloadPlayers();
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
                    <Button type="button" onClick={reloadPlayers} color="success"><RefreshIcon /></Button>
                </div>
            </form>
        </Box>
    )
}
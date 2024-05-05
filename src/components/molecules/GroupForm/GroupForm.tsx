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

export default function GroupForm() {
    const { loggedUser } = usePadelStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

    const queryClient = useQueryClient();

    const reloadGroups = async () => {
        queryClient.invalidateQueries({ queryKey: ['groups'] })
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { name } = data;
        if (name.length < 1 || !loggedUser.email) return;
        const members: any = [];
        const managers: any = [];
        managers.push(loggedUser.email)
        await addDoc(collection(db, "groups"), { name, createdBy: loggedUser.email, visibility: "private", members, managers });
        reloadGroups();
        reset();
    }

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <TextField id="outlined-basic" color="primary" label="Nome" variant="filled" {...register("name", { required: true })} />
                    <Typography>{errors.name && <span>Campo obrigatório</span>}</Typography>
                </div>
                <div style={{ display: "flex" }}>
                    <Button type="submit" variant="contained">add</Button>
                    <Button type="button" onClick={() => reloadGroups()} color="success"><RefreshIcon /></Button>
                </div>
            </form>
        </Box>
    )
}
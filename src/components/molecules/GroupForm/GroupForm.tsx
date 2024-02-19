import { Box, Button, TextField, Typography } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { SubmitHandler, useForm } from "react-hook-form";
import RefreshIcon from '@mui/icons-material/Refresh';
import { usePadelStore } from "../../../zustand/padelStore";
import { useAuthStore } from "../../../zustand/authStore";

type Inputs = {
    name: string
}

export default function GroupForm() {
    const { fetchGroups } = usePadelStore();
    const { loggedUser } = useAuthStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { name } = data;
        if (name.length < 1 || !loggedUser.email) return;
        const members: any = [];
        const managers: any = [];
        managers.push(loggedUser.email)
        await addDoc(collection(db, "groups"), { name, createdBy: loggedUser.email, visibility: "private", members, managers });
        fetchGroups(loggedUser.email);
        reset();
    }

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <TextField id="outlined-basic" color="primary" label="Nome" variant="filled"{...register("name", { required: true })} />
                    <Typography>{errors.name && <span>Campo obrigatório</span>}</Typography>
                </div>
                <div style={{ display: "flex" }}>
                    <Button type="submit" variant="contained">add</Button>
                    <Button type="button" onClick={() => fetchGroups(loggedUser.email)} color="success"><RefreshIcon /></Button>
                </div>
            </form>
        </Box>
    )
}
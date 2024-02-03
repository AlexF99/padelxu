import { Box, Button, TextField } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    name: string
}

export default function PlayerForm(props: any) {
    const { updatePlayers } = props;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { name } = data;
        const docRef = await addDoc(collection(db, "players"), { name });
        updatePlayers();
        reset();
    }

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField id="outlined-basic" label="name" variant="outlined" {...register("name", { required: true })} />
                {errors.name && <span>This field is required</span>}

                <Button type="submit" variant="contained">add</Button>
            </form>
        </Box>
    )
}
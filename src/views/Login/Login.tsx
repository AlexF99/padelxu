import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuthStore } from "../../zustand/authStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import { Route } from "../../router";
import { useNavigate } from "react-router-dom";

type Inputs = {
    email: string
    password: string
}

const Login = () => {
    const auth = getAuth();
    const { setLoggedUser } = useAuthStore();
    const {
        register,
        handleSubmit,
    } = useForm<Inputs>();
    const navigate = useNavigate()

    const signin: SubmitHandler<Inputs> = (data) => {
        const { email, password } = data

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setLoggedUser(user)
                navigate(Route.HOME, { replace: true })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }

    return (
        <Box className="PageContainer">
            <form onSubmit={handleSubmit(signin)} >
                <TextField
                    id="outlined-basic"
                    color="primary"
                    label="e-mail"
                    variant="filled"
                    sx={{ backgroundColor: "#878787" }}
                    {...register("email", { required: true })} />
                <TextField
                type="password"
                    id="outlined-basic"
                    color="primary"
                    label="senha"
                    variant="filled"
                    sx={{ backgroundColor: "#878787" }}
                    {...register("password", { required: true })} />
                <Button type="submit" variant="contained" color="primary">login</Button>
            </form>
        </Box>
    )

};

export default Login;
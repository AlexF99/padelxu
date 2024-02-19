import { User, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import { Route } from "../../router";
import { useNavigate } from "react-router-dom";
import { usePadelStore } from "../../zustand/padelStore";

type Inputs = {
    email: string
    password: string
}

const Login = () => {
    const auth = getAuth();
    const { setLoggedUser } = usePadelStore();
    const {
        register,
        handleSubmit,
    } = useForm<Inputs>();
    const navigate = useNavigate()

    const signin: SubmitHandler<Inputs> = (data) => {
        const { email, password } = data

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user: User = userCredential.user;
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
            <form onSubmit={handleSubmit(signin)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <TextField
                    id="email"
                    color="primary"
                    label="e-mail"
                    variant="filled"
                    sx={{ backgroundColor: "#878787", marginBottom: "10px" }}
                    {...register("email", { required: true })} />
                <TextField
                    type="password"
                    id="password"
                    color="primary"
                    label="senha"
                    variant="filled"
                    sx={{ backgroundColor: "#878787", marginBottom: "10px" }}
                    {...register("password", { required: true })} />
                <Button type="submit" variant="contained" color="primary">login</Button>
            </form>
        </Box>
    )

};

export default Login;
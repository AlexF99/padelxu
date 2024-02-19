import { User, getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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
    const provider = new GoogleAuthProvider();
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

    const googleSignin = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log(user);
                setLoggedUser(user)
                navigate(Route.HOME, { replace: true })
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // // The email of the user's account used.
                // const email = error.customData.email;
                // // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
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

            <Button type="button" variant="contained" color="primary" onClick={() => googleSignin()}>Sign-in with Google</Button>

        </Box>
    )

};

export default Login;
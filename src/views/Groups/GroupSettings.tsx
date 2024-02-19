import { Box, Button, Fab, Grid, Snackbar, Switch, TextField, Typography } from '@mui/material'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Group, usePadelStore } from '../../zustand/padelStore';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';

type Inputs = {
    memberEmail: string,
    managerEmail: string,
}

const GroupSettings = () => {
    const { id } = useParams();
    const [group, setGroup] = useState<Group>();
    const { loggedUser } = usePadelStore();
    const [showSnackbar, setShowSnackbar] = useState(false);
    const {
        register,
        getValues,
    } = useForm<Inputs>();

    const getGroup = async () => {
        if (!id) return;
        const docRef = doc(db, "groups", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap) return;
        setGroup({
            id: docSnap.id,
            name: docSnap.data()?.name ? docSnap.data()?.name : "",
            createdBy: docSnap.data()?.createdBy ? docSnap.data()?.createdBy : "",
            visibility: docSnap.data()?.visibility ? docSnap.data()?.visibility : "",
            members: docSnap.data()?.members ? docSnap.data()?.members : [],
            managers: docSnap.data()?.managers ? docSnap.data()?.managers : [],
        })
    }

    useEffect(() => {
        getGroup();
    }, [])

    const handleVisibilityChange = () => {
        if (!group) return;
        setGroup({ ...group, visibility: group?.visibility === "private" ? "public" : "private" })
    }

    const addPerson = (email: string, permission: "members" | "managers") => {
        if (!group || !email) return;

        setGroup({
            ...group,
            [permission]: group[permission].includes(email) ? group[permission] : [...group[permission], email],
        })
    }

    const removePerson = (email: string, permission: "members" | "managers") => {
        if (!group || !email) return;

        setGroup({
            ...group,
            [permission]: group[permission].filter(m => m !== email),
        })
    }

    const saveChanges = async () => {
        if (!group) return;
        const groupRef = doc(db, "groups", group.id);
        await updateDoc(groupRef, {
            ...group
        });
        await getGroup();
        setShowSnackbar(true);
    }

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        setShowSnackbar(false);
    };

    return (
        <Box className="PageContainer">
            <Snackbar
            sx={{position: "absolute"}}
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message="Group settings saved"
            // action={action}
            />
            <Typography variant='h3'>{group?.name}</Typography>
            {!!group && loggedUser.email === group.createdBy &&
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <Typography variant='body1'>visibility</Typography>
                        <Switch
                            checked={group.visibility === "private"}
                            onChange={handleVisibilityChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <Typography variant='body1' fontSize={"small"}>{group?.visibility}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h4'>Members</Typography>
                        <TextField id="outlined-basic" color="primary" label="Nome do membro" variant="filled"
                            sx={{ backgroundColor: "#878787" }} {...register("memberEmail", { required: true })} />
                        <Button type="button" variant="contained" onClick={() => addPerson(getValues('memberEmail'), 'members')}>add</Button>


                        {group.members?.map((email: string) => (
                            <Box className="ArrayContainer" key={email} mt={2}>
                                <Typography variant='body1'>{email}</Typography>
                                <Fab onClick={() => removePerson(email, 'members')} size="small" color="error" aria-label="remove">
                                    <CloseIcon />
                                </Fab>
                            </Box>
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h4'>Managers</Typography>
                        <TextField id="outlined-basic" color="primary" label="Nome do manager" variant="filled"
                            sx={{ backgroundColor: "#878787" }} {...register("managerEmail", { required: true })} />
                        <Button type="button" variant="contained" onClick={() => addPerson(getValues('managerEmail'), 'managers')}>add</Button>


                        {group.managers?.map((email: string) => (
                            <Box className="ArrayContainer" key={email} mt={2}>
                                <Typography key={email} variant='body1'>{email}</Typography>
                                <Fab onClick={() => removePerson(email, 'managers')} size="small" color="error" aria-label="remove">
                                    <CloseIcon />
                                </Fab>
                            </Box>
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={() => saveChanges()}>Save</Button>
                    </Grid>
                </Grid>
            }
        </Box>
    )
}

export default GroupSettings;

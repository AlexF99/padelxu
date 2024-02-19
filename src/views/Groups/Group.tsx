import { Box, Button, Typography } from '@mui/material'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';


const Group = () => {
    const { id } = useParams();
    const [group, setGroup] = useState<any>();

    const getGroup = async () => {
        if (!id) return;
        const docRef = doc(db, "groups", id);
        const docSnap = await getDoc(docRef);
        setGroup(docSnap.data())
    }

    useEffect(() => {
        getGroup();
    }, [])

    return (
        <Box className="PageContainer">
            {!!group &&
                <>
                    <Typography variant='h3'>{group?.name}</Typography>
                    <Typography variant='body1'>{group?.visibility}</Typography>
                    <Typography variant='h4'>Members</Typography>
                    {group.members?.map((email: string) => (
                        <Typography key={email} variant='body1'>{email}</Typography>
                    ))}
                    <Typography variant='h4'>Managers</Typography>
                    {group.managers?.map((email: string) => (
                        <Typography key={email} variant='body1'>{email}</Typography>
                    ))}
                    <Button variant="contained" onClick={() => { }}>Save</Button>
                </>
            }
        </Box>
    )
}

export default Group;

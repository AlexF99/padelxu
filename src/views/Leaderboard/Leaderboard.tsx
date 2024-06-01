import Box from '@mui/material/Box';

import { usePadelStore } from '../../zustand/padelStore';
import { CircularProgress, Typography } from '@mui/material';
import StatsTable from '../../components/organisms/StatsTable/StatsTable';
import { useNavigate } from 'react-router-dom';
import { Route } from '../../router';
import moment, { Moment } from 'moment';
import { fetchLeaderboard } from '../../api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Form } from '../../components/molecules/Form/Form';
import { useForm } from 'react-hook-form';
import DateLimits from '../../components/molecules/DateLimits/DateLimits';

type Inputs = {
    dateFrom: Moment,
    dateUntil: Moment,
    month: string,
}

export default function Leaderboard() {
    const { group } = usePadelStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const updateLeaderboard = async () => {
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
    }

    const onItemClick = (id: string) => {
        navigate(`${Route.PLAYERS}/${id}`)
    }

    const form = useForm<Inputs>({
        defaultValues: {
            dateFrom: moment("01/01/2024 9:00", "M/D/YYYY H:mm"),
            dateUntil: moment(),
            month: 'tudo'
        },
        shouldUnregister: false
    });

    const { data: leaderboard, isFetching } = useQuery({
        queryKey: ['leaderboard', { df: form.getValues('dateFrom').toDate(), du: form.getValues('dateUntil').toDate(), groupId: group.id }],
        queryFn: () => fetchLeaderboard(group.id, form.getValues('dateFrom').toDate(), form.getValues('dateUntil').toDate()),
    })


    const onSubmit = form.handleSubmit((formData: Inputs) => {
        updateLeaderboard();
    })

    return (
        <Box className="PageContainer">
            <Typography variant='h3'>Leaderboard</Typography>
            <Form form={form}>
                <DateLimits onSubmit={onSubmit} />
            </Form>
            {isFetching
                ? <CircularProgress color="success" />
                : <StatsTable onItemClick={(id) => onItemClick(id)} items={leaderboard} reloadItems={updateLeaderboard}></StatsTable>
            }
        </Box>
    );
}
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { usePadelStore } from "../../zustand/padelStore";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchPlayerInfo } from "../../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import moment, { Moment } from "moment";
import { Form } from "../../components/molecules/Form/Form";
import DateLimits from "../../components/molecules/DateLimits/DateLimits";

type Inputs = {
    dateFrom: Moment,
    dateUntil: Moment,
    month: string,
}

export default function PlayerInfo() {
    const { id } = useParams();
    const { group } = usePadelStore();
    const queryClient = useQueryClient();

    const form = useForm<Inputs>({
        defaultValues: {
            dateFrom: moment("01/01/2024 9:00", "M/D/YYYY H:mm"),
            dateUntil: moment(),
            month: 'tudo'
        },
        shouldUnregister: false
    });

    const { data, isFetching } = useQuery({
        queryKey: ['playerinfo', { df: form.getValues('dateFrom').toDate(), du: form.getValues('dateUntil').toDate(), groupId: group.id }],
        queryFn: () => fetchPlayerInfo(group.id, id ?? '', form.getValues('dateFrom').toDate(), form.getValues('dateUntil').toDate()),
    })

    const refresh = async () => {
        queryClient.invalidateQueries({ queryKey: ['playerinfo'] })
    }
    const onSubmit = form.handleSubmit(() => { refresh(); });

    return (
        <Box className="PageContainer">
            <Form form={form}>
                <DateLimits onSubmit={onSubmit} />
            </Form>
            {group.id.length ? isFetching
                ? <CircularProgress color="success" />
                : <>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography variant="h3">{data?.player?.name}</Typography>
                        <Button type="button" color='success' onClick={refresh}><RefreshIcon /></Button>
                    </Box>
                    <Box className="ArrayContainer">
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1">Partidas: {data?.player?.matches}</Typography>
                                <Typography variant="body1">Vitórias: {data?.player?.wins}</Typography>
                                <Typography variant="body1">games ganhos: {data?.player?.gamesWon}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">Aproveitamento: {data?.player?.ratio}</Typography>
                                <Typography variant="body1">Aprov. games: {data?.player?.gamesRatio}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Typography variant="h6">Vitórias</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <ResponsiveContainer aspect={1.2} maxHeight={300}>
                                <LineChart data={data?.data}>
                                    <Line type="monotone" dataKey="accWinRatio" stroke="#8884d8" />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey={"date"} />
                                    <YAxis domain={[0, 1]} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ResponsiveContainer aspect={1.2} maxHeight={300}>
                                <BarChart data={data?.data}>
                                    <Bar type="monotone" dataKey="ratio" stroke="#8884d8" />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey={"date"} />
                                    <YAxis domain={[0, 1]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Grid>
                    </Grid>

                    <Typography variant="h6">Games</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <ResponsiveContainer aspect={1.2} maxHeight={300}>
                                <LineChart data={data?.data}>
                                    <Line type="monotone" dataKey="accGamesRatio" stroke="#8884d8" />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey={"date"} />
                                    <YAxis domain={[0, 1]} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ResponsiveContainer aspect={1.2} maxHeight={300}>
                                <BarChart data={data?.data}>
                                    <Bar type="monotone" dataKey="gamesRatio" stroke="#8884d8" />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey={"date"} />
                                    <YAxis domain={[0, 1]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Grid>
                    </Grid>
                </>
                : <Box>Selecione um grupo</Box>
            }
        </Box>
    )
}
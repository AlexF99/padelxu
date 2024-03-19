import Box from '@mui/material/Box';

import { useEffect, useState } from 'react';
import { usePadelStore } from '../../zustand/padelStore';
import { CircularProgress, MenuItem, Select, Typography } from '@mui/material';
import StatsTable from '../../components/organisms/StatsTable/StatsTable';
import { useNavigate } from 'react-router-dom';
import { Route } from '../../router';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment, { Moment } from 'moment';

export default function Leaderboard() {
    const { leaderboard, fetchLeaderboard, isLoading, setIsLoading } = usePadelStore();
    const navigate = useNavigate();


    // date vars
    const [dateFrom, setDateFrom] = useState<Moment>(moment("01/01/2024 9:00", "M/D/YYYY H:mm"));
    const [dateUntil, setDateUntil] = useState<Moment>(moment());
    const [month, setMonth] = useState<string>("tudo");
    const [months, setMonths] = useState<any>({});
    const monthsOfYear = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

    useEffect(() => {
        updateLeaderboard();
    }, [dateFrom, dateUntil]);


    const updateLeaderboard = async () => {
        setIsLoading(true)
        if (!!dateFrom && !!dateUntil)
            await fetchLeaderboard(dateFrom?.toDate(), dateUntil?.toDate());
        else await fetchLeaderboard();
        setIsLoading(false)
    }

    useEffect(() => {
        const monthsAdd: any = {
            "tudo": {
                start: moment("01/01/2024 9:00", "M/D/YYYY H:mm"),
                end: moment()
            }
        };
        for (let i = 0; i < 5; i++) {
            const current = moment().year(moment().year()).month(moment().month() - i)
            const currentCopy = moment(current);
            const label = monthsOfYear[current.get('month')] + current.get("year");
            const monthAdd = {
                start: current.date(current.startOf('month').date()),
                end: currentCopy.date(currentCopy.endOf('month').date())
            }
            monthsAdd[label] = monthAdd;
        }
        setMonths(monthsAdd)
        if (leaderboard.length < 1)
            updateLeaderboard()
    }, [])

    const onItemClick = (id: string) => {
        navigate(`${Route.PLAYERS}/${id}`)
    }

    const handleChange = (event: any) => {
        const { value } = event.target;
        setMonth(value);
        setDateFrom(months[value].start)
        setDateUntil(months[value].end)
    }

    return (
        <Box className="PageContainer">
            <Typography variant='h3'>Leaderboard</Typography>
            <Box style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <DatePicker
                    label="De"
                    value={dateFrom}
                    onChange={(newValue: Moment | null) => setDateFrom(newValue ? newValue : moment())}
                />
                <DatePicker
                    label="Ate"
                    value={dateUntil}
                    onChange={(newValue: Moment | null) => setDateUntil(newValue ? newValue : moment())}
                />
                <Select
                    value={month}
                    label="Mês"
                    onChange={handleChange}
                >
                    {Object.keys(months).map(m => (
                        <MenuItem key={m} value={m}>{m}</MenuItem>
                    ))}
                </Select>
            </Box>
            {isLoading
                ? <CircularProgress color="success" />
                : <StatsTable onItemClick={(id) => onItemClick(id)} items={leaderboard} reloadItems={updateLeaderboard}></StatsTable>
            }
        </Box>
    );
}
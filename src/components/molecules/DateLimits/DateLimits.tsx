import { Box, Button, MenuItem, Select } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import moment from "moment";

type DateLimitProps = {
    onSubmit: any
}

export default function DateLimits({ onSubmit }: DateLimitProps) {

    const [months, setMonths] = useState<any>({
        "tudo": {
            start: moment("01/01/2024 9:00", "M/D/YYYY H:mm"),
            end: moment()
        }
    });
    const monthsOfYear = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

    const { control, reset, getValues } = useFormContext();


    useEffect(() => {
        const monthsAdd: any = {};
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
        setMonths({ ...months, ...monthsAdd })
    }, [])

    const handleMonthChange = (event: any) => {
        const { value } = event.target;
        reset({ dateFrom: months[value].start, dateUntil: months[value].end, month: getValues('month') })
    }

    return (
        <Box style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Controller
                control={control}
                name="dateFrom"
                render={({ field }) =>
                (<DatePicker
                    label="De"
                    value={field.value}
                    inputRef={field.ref}
                    onChange={(date) => {
                        field.onChange(date);
                    }}
                />)} />
            <Controller
                control={control}
                name="dateUntil"
                render={({ field }) =>
                (<DatePicker
                    label="Até"
                    value={field.value}
                    inputRef={field.ref}
                    onChange={(date) => {
                        field.onChange(date);
                    }}
                />)} />
            <Controller
                control={control}
                name="month"
                render={({ field }) =>
                (<Select
                    name="month"
                    label="Mês"
                    defaultValue="tudo"
                    onChange={(e) => {
                        e.preventDefault();
                        field.onChange(e);
                        handleMonthChange(e);
                    }}
                >
                    {Object.keys(months).map(m => (
                        <MenuItem key={m} value={m}>{m}</MenuItem>
                    ))}
                </Select>)} />
            <Button type="button" variant="contained" onClick={() => onSubmit()}>
                aplicar
            </Button>

        </Box>
    )
}
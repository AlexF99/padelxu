import { Box, Button, MenuItem, Select } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import { FC, useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { Filter, FilterForm } from "../../../types/types";

type FilterDrawerProps = {
    filterData: Filter
    setFilterData: (filter: Filter) => void,
}

const DateLimits: FC<FilterDrawerProps> = ({ setFilterData, filterData }) => {
    const form = useForm<FilterForm>({
        defaultValues: {
            month: "tudo",
            dateFrom: moment("01/01/2024 9:00", "M/D/YYYY H:mm"),
            dateUntil: moment()
        }, shouldUnregister: false
    });

    const [months, setMonths] = useState<Record<string, Record<string, Moment>>>({
        "tudo": {
            start: moment("01/01/2024 9:00", "M/D/YYYY H:mm"),
            end: moment()
        }
    });

    const { control } = form;

    useEffect(() => {
        const monthsOfYear = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
        const monthsAdd: any = {};
        for (let i = 0; i < 5; i++) {
            const current = moment().year(moment().year()).month(moment().month() - i)
            const currentCopy = moment(current);
            const label = monthsOfYear[current.get('month')] + current.get("year");
            const monthAdd: { start: Moment, end: Moment } = {
                start: current.date(current.startOf('month').date()),
                end: currentCopy.date(currentCopy.endOf('month').date())
            }
            monthsAdd[label] = monthAdd;
        }
        setMonths({ ...months, ...monthsAdd })
    }, [])

    const onSubmit = form.handleSubmit((formData: FilterForm) => {
        const m = formData.month;
        const filterData: Filter = {
            ...formData,
            dateFrom: formData.dateFrom?.toDate(),
            dateUntil: formData.dateUntil?.toDate()
        };
        if (form.getFieldState('month').isDirty) {
            filterData.dateFrom = m ? months[m]?.start.toDate() : undefined;
            filterData.dateUntil = m ? months[m]?.end.toDate() : undefined;
        }
        form.reset(formData);
        setFilterData(filterData);
    });

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
                    }}
                >
                    {Object.keys(months).map(m => (
                        <MenuItem key={m} value={m}>{m}</MenuItem>
                    ))}
                </Select>)} />
            <Button variant="contained" onClick={onSubmit}>
                aplicar
            </Button>

        </Box >
    )
}

export { DateLimits };
import { Moment } from "moment";

type FilterForm = {
    month?: string,
    dateFrom?: Moment,
    dateUntil?: Moment,
}
type Filter = {
    month?: string,
    dateFrom?: Date,
    dateUntil?: Date,
}

export type { FilterForm, Filter };
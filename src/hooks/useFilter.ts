import { useMemo, useState } from "react";
import { Filter } from "../types/types";
import moment from "moment";

const useFilter = () => {

    const [filterData, setFilterData] = useState<Filter>({
        month: "tudo",
        dateFrom: moment("01/01/2024 9:00", "M/D/YYYY H:mm").toDate(),
        dateUntil: moment().toDate()
    });
    const isFilterActive = useMemo(() => Object.keys(filterData).length > 0, [filterData]);

    return { filterData, setFilterData, isFilterActive };
}

export { useFilter };
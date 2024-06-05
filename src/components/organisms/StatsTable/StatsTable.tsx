import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import RefreshIcon from '@mui/icons-material/Refresh';

import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import { Button } from '@mui/material';
import { Stats } from '../../../zustand/padelStore';
import ClickTooltip from '../../atoms/ClickTooltip/ClickTooltip';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    id: keyof Stats;
    label: string;
    shortLabel: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        label: 'Nome',
        shortLabel: 'Nome',
    },
    {
        id: 'matches',
        numeric: true,
        label: 'Partidas',
        shortLabel: 'p',
    },
    {
        id: 'wins',
        numeric: true,
        label: 'Vitórias',
        shortLabel: 'w',
    },
    {
        id: 'gamesWon',
        numeric: true,
        label: 'Games Ganhos',
        shortLabel: 'gg',
    },
    {
        id: 'gamesPlayed',
        numeric: true,
        label: 'Games Jogados',
        shortLabel: 'gj',
    },
    {
        id: 'ratio',
        numeric: true,
        label: 'Aprov. Partidas',
        shortLabel: 'r',
    },
    {
        id: 'gamesRatio',
        numeric: true,
        label: 'Aprov. Games',
        shortLabel: 'gr',
    },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Stats) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof Stats) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            <ClickTooltip label={headCell.label} shortLabel={headCell.shortLabel} />
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface TableProps {
    reloadItems: () => Promise<void>,
    onItemClick: (id: string) => void,
    items: Stats[] | undefined
}

export default function StatsTable(props: TableProps) {
    const { items, reloadItems, onItemClick } = props;

    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<keyof Stats>('ratio');

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Stats,
    ) => {
        const isAsc = orderBy === property && order === 'desc';
        setOrder(isAsc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const visibleRows = items?.length ? stableSort(items, getComparator(order, orderBy)) : [];

    return (
        <Paper sx={{ width: '100%', mb: 2 }}>
            <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                <Button type="button" onClick={reloadItems} color="success"><RefreshIcon /></Button>
            </Toolbar>
            <TableContainer sx={{ paddingBottom: "2rem" }}>
                <Table
                    aria-labelledby="tableTitle"
                    size={'small'}
                >
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={items?.length ?? 0}
                    />
                    <TableBody>
                        {visibleRows.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    aria-checked={false}
                                    tabIndex={-1}
                                    key={index}
                                    selected={false}
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => onItemClick(row.id)}
                                >
                                    <TableCell
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                    >
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.matches}</TableCell>
                                    <TableCell align="right">{row.wins}</TableCell>
                                    <TableCell align="right">{row.gamesWon}</TableCell>
                                    <TableCell align="right">{row.gamesPlayed}</TableCell>
                                    <TableCell align="right">{row.ratio}</TableCell>
                                    <TableCell align="right">{row.gamesRatio}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
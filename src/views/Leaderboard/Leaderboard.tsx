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
import { useEffect, useState } from 'react';
import { usePadelStore } from '../../zustand/padelStore';
import { Button, CircularProgress, Typography } from '@mui/material';
import ClickTooltip from '../../components/atoms/ClickTooltip/ClickTooltip';

interface Data {
    name: string;
    wins: number;
    sets: number;
    setsPlayed: number;
    ratio: number;
    setsRatio: number;
}

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
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    id: keyof Data;
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
        id: 'wins',
        numeric: true,
        label: 'wins',
        shortLabel: 'w',
    },
    {
        id: 'sets',
        numeric: true,
        label: 'sets (ganhos)',
        shortLabel: 'sg',
    },
    {
        id: 'setsPlayed',
        numeric: true,
        label: 'sets (jogados)',
        shortLabel: 'sj',
    },
    {
        id: 'ratio',
        numeric: true,
        label: 'ratio',
        shortLabel: 'r',
    },
    {
        id: 'setsRatio',
        numeric: true,
        label: 'sets ratio',
        shortLabel: 'sr',
    },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
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

export default function Leaderboard() {
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<keyof Data>('wins');
    const { leaderboard, fetchLeaderboard, isLoading, setIsLoading } = usePadelStore();

    const updateLeaderboard = async () => {
        setIsLoading(true)
        await fetchLeaderboard()
        setIsLoading(false)
    }

    useEffect(() => {
        if (leaderboard.length < 1) {
            updateLeaderboard()
        }
    }, [])

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'desc';
        setOrder(isAsc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const visibleRows = leaderboard.length ? stableSort(leaderboard, getComparator(order, orderBy)) : [];

    return (
        <Box className="PageContainer">
            <Typography variant='h3'>Leaderboard</Typography>
            {isLoading
                ? <CircularProgress color="success" />
                : <Paper sx={{ width: '100%', mb: 2 }}>
                    <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                        {/* <Tooltip title="Filter list">
                            <IconButton>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip> */}
                        <Button type="button" onClick={updateLeaderboard} color="success"><RefreshIcon /></Button>
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
                                rowCount={leaderboard.length}
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
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.wins}</TableCell>
                                            <TableCell align="right">{row.sets}</TableCell>
                                            <TableCell align="right">{row.setsPlayed}</TableCell>
                                            <TableCell align="right">{row.ratio}</TableCell>
                                            <TableCell align="right">{row.setsRatio}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            }
        </Box>
    );
}
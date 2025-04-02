import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';

const statusMap = {
  pending: { label: 'Pending', color: 'warning' },
  delivered: { label: 'Delivered', color: 'success' },
  refunded: { label: 'Refunded', color: 'error' },
} as const;

export interface Order {
  time: string;
  predictedDataToday: number;
}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
  selectedStation: number;
  stations: string[];
  timestampLatest: Date;
}

export function LatestOrders({ orders = [], sx, selectedStation, stations, timestampLatest}: LatestOrdersProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader  align="center" title={stations[selectedStation] +" - "+timestampLatest} />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Peak Hour</TableCell>
              {/*<TableCell>Predicted Count</TableCell>
              <TableCell sortDirection="desc">Date</TableCell>*/}
              <TableCell  align="center">Predicted Passenger Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              //const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={order.id}>
                  <TableCell>{order.time}</TableCell>
                  <TableCell align="center">{order.predictedDataToday}</TableCell>
                  {/*<TableCell>{dayjs(order.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>*/}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      {/*<CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>*/}
    </Card>
  );
}

import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { formatCurrency } from '../../utils';

export function OrderDetailsView({ orderId }) {
    const [orderData, setOrderData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const jwt = localStorage.getItem('jwt');

                if (!jwt) {
                    console.error('JWT token is missing');
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/detail/${orderId}`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + jwt,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }
                const data = await response.json();
                console.log(data);
                setOrderData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchOrderData();
    }, [orderId]);

    if (!orderData && !error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6">Đang tải dữ liệu...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6" color="error">
                    Lỗi: {error}
                </Typography>
            </Box>
        );
    }

    const { Ticket_Seat_Room, popcorn, order } = orderData;

    return (
        <Box sx={{ p: 4 }}>
            {/* Thông tin đơn hàng */}
            <Typography variant="h3" gutterBottom>
                Chi tiết đơn hàng
            </Typography>
            <Box sx={{ mb: 3 }}>
                <Typography variant="body1"><strong>Mã đơn hàng:</strong> {order[0].order_id}</Typography>
                <Typography variant="body1"><strong>Người đặt:</strong> {order[0].username}</Typography>
                <Typography variant="body1"><strong>Phim:</strong> {order[0].film_name}</Typography>
                <Typography variant="body1"><strong>Ngày chiếu:</strong> {new Date(order[0].show_date).toLocaleDateString()}</Typography>
                <Typography variant="body1"><strong>Tổng giá:</strong> {formatCurrency(order[0].total_price)}</Typography>
                <Typography variant="body1"><strong>Ngày đặt:</strong> {new Date(order[0].order_date).toLocaleDateString()}</Typography>
            </Box>

            {/* Chi tiết đơn hàng */}
            <Typography variant="h3" gutterBottom>
                Thông tin vé
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Rạp</strong></TableCell>
                            <TableCell><strong>Phòng</strong></TableCell>
                            <TableCell><strong>Hàng ghế</strong></TableCell>
                            <TableCell><strong>Số ghế</strong></TableCell>
                            <TableCell><strong>Giá vé</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Ticket_Seat_Room.map((ticket, index) => (
                            <TableRow key={index}>
                                <TableCell>{ticket.cinema_name}</TableCell>
                                <TableCell>{ticket.room_name}</TableCell>
                                <TableCell>{ticket.seat_row}</TableCell>
                                <TableCell>{ticket.seat_number}</TableCell>
                                <TableCell>{formatCurrency(ticket.ticket_price)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Chi tiết gọi kèm */}
            <Typography variant="h3" gutterBottom>
                Thông tin bắp nước
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Combo</strong></TableCell>
                            <TableCell><strong>Giá</strong></TableCell>
                            <TableCell><strong>Số lượng</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {popcorn.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.combo_name}</TableCell>
                                <TableCell>{formatCurrency(item.combo_price)}</TableCell>
                                <TableCell>{item.combo_quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

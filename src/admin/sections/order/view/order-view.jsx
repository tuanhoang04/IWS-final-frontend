import { useState, useEffect, useMemo } from "react";
import { hook } from "../hook";
import { applyFilter, getComparator } from "../../utils";
import { DashboardContent } from "../../../layouts/dashboard";
import { Card, Box, Table, TableBody, TableContainer, TablePagination, Typography, TableRow, TableCell, CircularProgress } from "@mui/material";
import { OrderTableToolbar } from "../order-table-toolbar";
import { Scrollbar } from "../../../components/scrollbar";
import { OrderTableHead } from "../order-table-head";
import { OrderTableRow } from "../order-table-row";
import { TableNoData } from "../../table-no-data";

export function OrderView() {
    const table = hook();
    const [filterName, setFilterName] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('username');
    const [dataFiltered, setDataFiltered] = useState([]);

    const handleFilterName = (event) => {
        setFilterName(event.target.value);
        table.onResetPage();
    }

    const handleFilterChange = (newFilter) => {
        setSelectedFilter(newFilter);
    };

    const handleDeleteSelected = async () => {
        if (table.selected.length === 0) return;

        try {
            const jwt = localStorage.getItem('jwt');

            if (!jwt) {
                console.error('JWT token is missing');
                return;
            }

            for (const orderId of table.selected) {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/delete/${orderId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + jwt,
                    },
                    // credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete order with ID: ${orderId}`);
                }
            }

            setOrders((prevOrders) => prevOrders.filter((order) => !table.selected.includes(order.order_id)));
            table.setSelected([]);
            console.log('Selected orders deleted successfully.');
        } catch (error) {
            console.error('Error deleting selected orders:', error);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const jwt = localStorage.getItem('jwt');

                if (!jwt) {
                    console.error('JWT token is missing');
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + jwt,
                    },
                    // credentials: 'include',
                });

                if (!response.ok) throw new Error("Failed to fetch orders");

                const data = await response.json();
                // console.log(data);
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    const filteredData = useMemo(() => {
        return applyFilter({
            inputData: orders,
            comparator: getComparator(table.order, table.orderBy),
            filterName,
            attribute: selectedFilter
        });
    }, [orders, table.order, table.orderBy, filterName, selectedFilter])

    useEffect(() => {
        setDataFiltered(filteredData);
    }, [filteredData]);

    const notFound = !dataFiltered.length && filterName;

    return (
        <DashboardContent>
            <Box display='flex' alignItems="center" mb={5}>
                <Typography variant="h2">
                    Quản lý đơn hàng
                </Typography>
            </Box>

            <Card>
                <OrderTableToolbar
                    numSelected={table.selected.length}
                    filterName={filterName}
                    selectedFilter={selectedFilter}
                    onFilterName={handleFilterName}
                    onFilterChange={handleFilterChange}
                    onDeleteSelected={handleDeleteSelected}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <OrderTableHead
                                order={table.order}
                                orderBy={table.orderBy}
                                rowCount={dataFiltered.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(checked, dataFiltered.map((order) => order.order_id))
                                }
                                headLabel={[
                                    { id: 'order_id', label: 'Mã đơn hàng' },
                                    { id: 'username', label: 'Người dùng' },
                                    { id: 'film_name', label: 'Tên phim' },
                                    { id: 'cinema_name', label: 'Tên rạp chiếu' },
                                    { id: 'room_name', label: 'Tên phòng chiếu' },
                                    { id: 'show_date', label: 'Ngày chiếu' },
                                    { id: 'total_price', label: 'Giá trị đơn hàng' },
                                    { id: 'order_date', label: 'Ngày đặt hàng' },
                                    { id: '' }
                                ]}
                            />

                            <TableBody>
                                {loading && (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Box display="flex" justifyContent="center" alignItems="center" height="150px">
                                                <CircularProgress />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!loading &&
                                    dataFiltered.slice(
                                        table.page * table.rowsPerPage,
                                        table.page * table.rowsPerPage + table.rowsPerPage
                                    ).map((row) => (
                                        <OrderTableRow
                                            key={row.order_id}
                                            row={row}
                                            selected={table.selected.includes(row.order_id)}
                                            onSelectRow={() => table.onSelectRow(row.order_id)}
                                            onDelete={(id) => {
                                                setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== id));
                                                table.setSelected((prevSelected) => prevSelected.filter((selectedId) => selectedId !== id));
                                            }}
                                        />
                                    ))}

                                {notFound && <TableNoData searchQuery={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                {dataFiltered.length > 0 && (
                    <TablePagination
                        component="div"
                        page={table.page}
                        count={dataFiltered.length}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                        labelRowsPerPage="Số dòng mỗi trang:"
                    />
                )}
            </Card>
        </DashboardContent>
    )

}
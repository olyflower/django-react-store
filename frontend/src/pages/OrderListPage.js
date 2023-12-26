import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listOrders } from "../actions/orderActions";

function OrderListPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const orderList = useSelector((state) => state.orderList);
	const { loading, error, orders } = orderList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (userInfo && userInfo.is_admin) {
			dispatch(listOrders());
		} else {
			navigate("/login");
		}
	}, [dispatch, navigate, userInfo]);

	return (
		<div>
			<h1>Orders</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<Table striped bordered hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>User</th>
							<th>Date</th>
							<th>Total</th>
							<th>Paid</th>
							<th>Delivered</th>
							<th></th>
						</tr>
					</thead>

					<tbody>
						{orders.map((order) => (
							<tr key={order.id}>
								<td>{order.id}</td>
								<td>{order.user && order.user.name}</td>
								<td>{order.createdAt}</td>
								<td>{order.totalPrice}$</td>
								<td>
									{order.isPaid ? (
										order.paidAt
									) : (
										<i
											className="fas fa-check"
											style={{ color: "red" }}
										></i>
									)}
								</td>
								<td>
									{order.isDelivered ? (
										order.deliveredAt
									) : (
										<i
											className="fas fa-check"
											style={{ color: "red" }}
										></i>
									)}
								</td>
								<td>
									<LinkContainer to={`/order/${order.id}/`}>
										<Button
											variant="light"
											className="btn-sm"
										>
											Details
										</Button>
									</LinkContainer>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</div>
	);
}

export default OrderListPage;

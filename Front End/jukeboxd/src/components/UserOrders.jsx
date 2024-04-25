import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../redux/actions/ordersActions";
import { Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";

function UserOrders() {
	const userData = useSelector((state) => state.storeUser.userData);
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			const ordersData = await getOrders(userData.token);

			setOrders(ordersData);
		};

		const root = document.querySelector("#root");
		root.style.backgroundColor = "rgba(230, 230, 230, 0.7)";
		root.style.backgroundImage = "none";

		if (!userData || !userData.token) {
			navigate("/store/login");
		}

		fetchOrders();
	}, [navigate, userData]);

	return (
		<div className="jukeContainer text-dark">
			<h1 className="display-3 text-center">My Orders</h1>
			<div className="d-flex flex-column align-items-center">
				{orders.length > 0 ? (
					<Row xs={1} lg={2}>
						{orders.map((order) => (
							<Col key={order.id} className="flex-grow-1">
								<div className="border border-2 rounded p-3 my-3">
									<h3>Order: {new Date(order.orderDate).toLocaleString()}</h3>
									<div className="d-flex">
										<p className="me-3">City: {order.city},</p>
										<p>Address: {order.address}</p>
									</div>
									<p>Products:</p>
									<ListGroup>
										{order.orderDetails &&
											order.orderDetails.map((od) => (
												<ListGroupItem key={od.productId} className="d-flex justify-content-between">
													<span>
														{od.product.name} x{od.quantity}
													</span>
													<span className="font-monospace">${od.price.toFixed(2)}</span>
												</ListGroupItem>
											))}
									</ListGroup>
									<p className="font-monospace text-end mb-0">Total: ${order.total.toFixed(2)}</p>
								</div>
							</Col>
						))}
					</Row>
				) : (
					<h2>No orders yet</h2>
				)}
			</div>
		</div>
	);
}

export default UserOrders;

import { useSelector } from "react-redux";
import OrderSummaryItem from "./OrderSummaryItem";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { sendOrder } from "../redux/actions/purchaseActions";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { stripePk } from "../functions/config";

function Cart() {
	const cart = useSelector((state) => state.storeUser.cart);
	const [total, setTotal] = useState(0);
	const stripePromise = loadStripe(stripePk);
	const userData = useSelector((state) => state.storeUser.userData);

	useEffect(() => {
		const root = document.querySelector("#root");
		root.style.backgroundColor = "white";
		root.style.backgroundImage = "none";

		return () => {
			root.style.backgroundColor = "";
			root.style.backgroundImage = "";
		};
	}, []);

	useEffect(() => {
		setTotal(0);
		cart.length > 0 &&
			cart.forEach((item) => {
				setTotal((prev) => prev + item.product.price * item.quantity);
			});
	}, [cart]);

	const handleSubmitOrder = async (e) => {
		e.preventDefault();
		if (!userData || !userData.token) {
			toast.info("Sign in to complete the purchase");
		} else {
			const address = e.target[0].value;
			const city = e.target[1].value;

			const order = {
				Total: total,
				Address: address,
				City: city,
				CartProducts: cart.map((item) => ({
					ProductId: item.product.id,
					Quantity: item.quantity,
					Price: item.product.price,
				})),
			};

			const orderData = await sendOrder(order);
			const stripe = await stripePromise;

			const result = await stripe.redirectToCheckout({
				sessionId: orderData.sessionId,
			});

			if (result.error) {
				// If redirectToCheckout fails due to a browser or network
				// error, display the localized error message to your customer.
				console.log(result.error.message);
			}
		}
	};

	return (
		<div className="jukeContainer text-dark mb-5">
			{cart.length > 0 ? (
				<>
					<div className="mb-4">
						<span className="">My Cart</span>
					</div>
					<div className="d-flex flex-column flex-md-row">
						<div className="w-100 px-2 rounded mb-4" style={{ maxHeight: "calc(100vh - 180px)", overflow: "auto" }}>
							<div className="flex flex-wrap">
								{cart.length > 0 && cart.map((item) => <ProductCard key={item.product.id} item={item} />)}
							</div>
						</div>
						<div className="px-2">
							<div
								className="text-dark rounded p-2 mb-4"
								style={{ backgroundColor: "rgba(230, 229, 229, 0.7)", backdropFilter: "blur(5px)" }}
							>
								<h3 className="text-xl font-semibold mb-4">Order Summary</h3>
								{cart.length > 0 &&
									cart.map((item) => (
										<OrderSummaryItem
											key={"sum" + item.product.id}
											item={"x" + item.quantity + " " + item.product.name}
											price={item.product.price * item.quantity}
										/>
									))}
								<div className="d-flex justify-content-between mt-5 text-dark fw-bold">
									<span>Order Total</span>
									{total && <span>${total.toFixed(2)}</span>}
								</div>
							</div>
							<Form onSubmit={(e) => handleSubmitOrder(e)} className="mb-5">
								<Form.Group className="mb-3">
									<Form.Label className="text-dark">City</Form.Label>
									<Form.Control type="text" placeholder="City" required />
									<Form.Label className="text-dark">Shipping Address</Form.Label>
									<Form.Control type="text" placeholder="Your address" required />
								</Form.Group>
								<Button variant="outline-dark" type="submit" className="py-2 rounded-lg font-semibold">
									Checkout
								</Button>
							</Form>
						</div>
					</div>
				</>
			) : (
				<h2 className="display-3 text-center">No products in cart</h2>
			)}
		</div>
	);
}

export default Cart;

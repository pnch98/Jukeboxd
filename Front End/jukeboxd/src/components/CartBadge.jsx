import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { useSelector } from "react-redux";

function CartBadge() {
	const cart = useSelector((state) => state.storeUser.cart);
	const [cartCount, setCartCount] = useState(0);

	useEffect(() => {
		let count = 0;
		cart.forEach((item) => {
			count += item.quantity;
		});
		setCartCount(count);
	}, [cart]);

	return (
		<>
			<i className="bi bi-bag"></i>
			<Badge id="cartBadge" bg="danger" className="rounded-circle">
				{cartCount}
			</Badge>
		</>
	);
}

export default CartBadge;

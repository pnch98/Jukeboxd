import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { updateQuantity } from "../redux/reducers/storeUserReducer";

function ProductCard({ item }) {
	const dispatch = useDispatch();
	const [quantity, setQuantity] = useState(item.quantity);

	const handleAdd = () => {
		dispatch(updateQuantity({ productId: item.product.id, quant: +1 }));
		setQuantity(quantity + 1);
	};

	const handleRemove = () => {
		if (quantity > 0) {
			dispatch(updateQuantity({ productId: item.product.id, quant: -1 }));
			setQuantity(quantity - 1);
		}
	};

	return (
		<div
			className="d-flex mb-2 rounded p-1"
			style={{ backgroundColor: " rgba(230, 229, 229, 0.7)", backdropFilter: "blur(5px)" }}
		>
			<div className="cartProdImgDiv me-2">
				<img src={"/public/store/products/" + item.product.image} alt="product image" className="cartProdImg" />
			</div>
			<div className="d-flex justify-content-between flex-md-column flex-grow-1">
				<div className="cartProdInfo d-flex flex-column justify-content-between">
					<div className="basicFs">
						<h4 className="basicFs">{item.product.name.split("-")[0]}</h4>
						<p className="mb-2">{item.product.name.split("-")[1]}</p>
						<p className="mb-0">{item.product.description}</p>
					</div>
					<div>
						<p className="font-monospace basicFs mb-0">Price: ${item.product.price}</p>
					</div>
				</div>
				<div className="d-flex flex-column flex-md-row-reverse align-items-md-end justify-content-md-end">
					<Button variant="light" className="btnPlus" onClick={handleAdd}>
						<i className="bi bi-plus-lg basicFs"></i>
					</Button>
					<input
						readOnly
						type="number"
						min="1"
						max={item.product.quantity}
						value={quantity}
						className="inputQuant basicFs px-1 flex-grow-1 flex-md-grow-0 text-center"
					/>
					<Button variant="light" className="btnMinus" onClick={handleRemove}>
						<i className="bi bi-dash-lg basicFs"></i>
					</Button>
				</div>
			</div>
		</div>
	);
}

ProductCard.propTypes = {
	item: PropTypes.shape({
		product: PropTypes.shape({
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
			description: PropTypes.string.isRequired,
			image: PropTypes.string.isRequired,
			quantity: PropTypes.number.isRequired,
			price: PropTypes.number.isRequired,
		}).isRequired,
		quantity: PropTypes.number.isRequired,
	}).isRequired,
};

export default ProductCard;

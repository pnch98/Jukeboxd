import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { addToCart } from "../redux/reducers/storeUserReducer";
import { useRef, useState } from "react";

function ProductStoreCard({ product, isMobile, active, onCardClick }) {
	const dispatch = useDispatch();
	const [quantity, setQuantity] = useState(1);
	const cardRef = useRef();

	const showInfo = () => {
		if (isMobile) {
			onCardClick(product.id);
		} else {
			const productInfo = cardRef.current.querySelector(".productInfo");
			productInfo.style.transform = "translate(-50%, 10%)";
		}
	};

	const hideInfo = (e) => {
		if (!isMobile) {
			const productInfo = e.currentTarget.querySelector(".productInfo");
			productInfo.style.transform = "translate(-50%, 81%)";
		}
	};

	const handleAddToCart = (e, product) => {
		e.stopPropagation();
		const quantityInput = e.target.parentElement.querySelector("input");
		const quantity = parseInt(quantityInput.value);
		dispatch(addToCart({ product, quantity }));
		toast.success("Product added to cart");
		// Reset the input value to 1
		quantityInput.value = 1;
	};

	const addOne = (e) => {
		e.stopPropagation();
		if (quantity < product.quantity) {
			setQuantity(quantity + 1);
		}
	};

	const removeOne = (e) => {
		e.stopPropagation();
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	return (
		<div
			ref={cardRef}
			style={{
				backgroundImage: `url("/public/store/products/${product.image}")`,
			}}
			className="productStoreCard"
			onClick={showInfo}
			onMouseOver={!isMobile ? showInfo : undefined}
			onMouseOut={!isMobile ? hideInfo : undefined}
		>
			<div className={`productInfo d-flex flex-column justify-content-between ${active ? "show-info" : ""}`}>
				<div>
					<h5 className="text-center">{product.name.split("-")[0]}</h5>
					{product.name.split("-")[1] && <p className="text-center">{product.name.split("-")[1]}</p>}
					<p>{product.description}</p>
				</div>
				<div>
					<p className="font-monospace mb-0">Price: €{product.price}</p>
					<div className="d-flex align-items-center ">
						<div className="d-flex align-items-center">
							<Button variant="outline-dark" className="btnMinusStandard" onClick={removeOne}>
								<i className="bi bi-dash-lg basicFs"></i>
							</Button>
							<input
								readOnly
								type="number"
								min="1"
								max={product.quantity}
								value={quantity}
								className="px-2"
								style={{ width: "50px" }}
							/>
							<Button variant="outline-dark" className="btnPlusStandard me-2" onClick={addOne}>
								<i className="bi bi-plus-lg basicFs"></i>
							</Button>
						</div>
						<Button variant="outline-dark" className="py-1 px-2" onClick={(e) => handleAddToCart(e, product)}>
							Add
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

ProductStoreCard.propTypes = {
	product: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		price: PropTypes.number.isRequired,
		quantity: PropTypes.number.isRequired,
		image: PropTypes.string.isRequired,
	}).isRequired,
	isMobile: PropTypes.bool.isRequired,
	active: PropTypes.bool.isRequired,
	onCardClick: PropTypes.func.isRequired,
};

export default ProductStoreCard;

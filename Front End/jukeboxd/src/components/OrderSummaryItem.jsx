import PropTypes from "prop-types";

const OrderSummaryItem = ({ item, price }) => (
	<div className="d-flex justify-content-between text-dark-50 basicFs mb-2">
		<span className="me-2">{item}</span>
		<span>${price.toFixed(2)}</span>
	</div>
);

OrderSummaryItem.propTypes = {
	item: PropTypes.string.isRequired,
	price: PropTypes.number.isRequired,
};

export default OrderSummaryItem;

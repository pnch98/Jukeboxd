import { Button, Col, Form, Modal, ModalBody, ModalFooter } from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { deleteProduct, editProduct } from "../redux/actions/adminActions";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

function ProductEditCard({ product }) {
	const [prod, setProd] = useState(product);
	const [showEdit, setShowEdit] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [formName, setFormName] = useState(product.name);
	const [formImage, setFormImage] = useState(product.image);
	const [formQuantity, setFormQuantity] = useState(product.quantity);
	const [formDescription, setFormDescription] = useState(product.description);
	const [formPrice, setFormPrice] = useState(product.price);
	const dispatch = useDispatch();

	const handleEditClose = () => setShowEdit(false);
	const handleEditShow = () => setShowEdit(true);

	const handleDeleteClose = () => setShowDelete(false);
	const handleDeleteShow = () => setShowDelete(true);

	useEffect(() => {
		setProd(product);
	}, [product]);

	const handleEditSubmit = (e) => {
		e.preventDefault();

		const productObj = {
			Id: product.id,
			Name: formName,
			Description: formDescription,
			Price: formPrice,
			Quantity: formQuantity,
			Image: formImage,
		};

		// Dispatch the editProduct action
		dispatch(editProduct(productObj)).then((response) => {
			if (response) {
				handleEditClose();
				toast.success("Product edited successfully!");
			} else {
				toast.error("Something went wrong!");
			}
		});
	};

	const handleDeleteSubmit = (e) => {
		e.preventDefault();

		// Dispatch the deleteProduct action
		dispatch(deleteProduct(product.id)).then((response) => {
			if (response) {
				handleDeleteClose();
				toast.success("Product deleted successfully!");
			} else {
				toast.error("Something went wrong!");
			}
		});
	};

	return (
		<>
			<Col xs={4} sm={3} className="ps-0">
				<div className="p-1">
					<img src={"/public/store/products/" + prod.image} alt={prod.name} className="img-fluid" />
				</div>
			</Col>
			<Col className="ps-0">
				<div className="d-flex flex-column justify-content-between position-relative h-100 p-1">
					<div>
						<h3 className="basicTitleFs">{prod.name}</h3>
						<p className="basicFs font-monospace mb-0">${prod.price}</p>
					</div>
					<p className="basicFs mb-0">Quantity: {prod.quantity}</p>
					<div className="position-absolute end-0 bottom-0 me-2 mb-2">
						<Button variant="outline-success" className="rounded-circle py-1 px-2 me-2" onClick={handleEditShow}>
							<i className="bi bi-pencil-fill basicTitleFs"></i>
						</Button>
						<Button variant="outline-danger" className="rounded-circle py-1 px-2" onClick={handleDeleteShow}>
							<i className="bi bi-trash-fill basicTitleFs"></i>
						</Button>
					</div>
				</div>
			</Col>
			<Modal className="z-max mt-5" show={showEdit} onHide={handleEditClose}>
				<ModalBody>
					<div className="d-flex flex-column justify-content-center align-items-center">
						<div style={{ width: "200px" }}>
							<img src={"/public/store/products/" + prod.image} alt={prod.name} className="img-fluid" />
						</div>
					</div>
					<div>
						<Form>
							<Form.Group controlId="formName">
								<Form.Label>Name:</Form.Label>
								<Form.Control required value={formName} onChange={(e) => setFormName(e.target.value)} />
							</Form.Group>
							<Form.Group controlId="formDescription">
								<Form.Label>Description:</Form.Label>
								<Form.Control required value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
							</Form.Group>
							<div className="d-flex">
								<Form.Group controlId="formPrice" className="me-2">
									<Form.Label>Price:</Form.Label>
									<Form.Control required value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
								</Form.Group>
								<Form.Group controlId="formQuantity">
									<Form.Label>Quantity:</Form.Label>
									<Form.Control required value={formQuantity} onChange={(e) => setFormQuantity(e.target.value)} />
								</Form.Group>
							</div>
							<Form.Group controlId="formImage">
								<Form.Label>Image:</Form.Label>
								<Form.Control required value={formImage} onChange={(e) => setFormImage(e.target.value)} />
							</Form.Group>
						</Form>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button variant="secondary" onClick={handleEditClose}>
						Close
					</Button>
					<Button type="submit" variant="success" onClick={handleEditSubmit}>
						Edit
					</Button>
				</ModalFooter>
			</Modal>
			<Modal className="z-max mt-5" show={showDelete} onHide={handleDeleteClose}>
				<ModalBody>
					<h3 className="display-5 text-center">Delete Product</h3>
					<div className="d-flex flex-column justify-content-center align-items-center">
						<div style={{ width: "200px" }}>
							<img src={"/public/store/products/" + prod.image} alt={prod.name} className="img-fluid" />
						</div>
					</div>
					<div>
						<Form>
							<Form.Group controlId="formName">
								<Form.Label>Name:</Form.Label>
								<Form.Control disabled value={formName} />
							</Form.Group>
							<Form.Group controlId="formDescription">
								<Form.Label>Description:</Form.Label>
								<Form.Control disabled value={formDescription} />
							</Form.Group>
							<Form.Group controlId="formPrice">
								<Form.Label>Price:</Form.Label>
								<Form.Control disabled value={formPrice} />
							</Form.Group>
							<Form.Group controlId="formQuantity">
								<Form.Label>Quantity:</Form.Label>
								<Form.Control disabled value={formQuantity} />
							</Form.Group>
							<Form.Group controlId="formImage">
								<Form.Label>Image:</Form.Label>
								<Form.Control disabled value={formImage} />
							</Form.Group>
						</Form>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button variant="secondary" onClick={handleDeleteClose}>
						Close
					</Button>
					<Button type="submit" variant="danger" onClick={handleDeleteSubmit}>
						Delete
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
}

ProductEditCard.propTypes = {
	product: PropTypes.shape({
		id: PropTypes.number.isRequired,
		image: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		quantity: PropTypes.number.isRequired,
		price: PropTypes.number.isRequired,
		description: PropTypes.string.isRequired,
	}),
};

export default ProductEditCard;

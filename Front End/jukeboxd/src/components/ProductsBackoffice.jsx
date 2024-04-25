import { useEffect, useState } from "react";
import { Button, Form, FormControl, Modal, ModalBody, ModalFooter, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ProductEditCard from "./ProductEditCard";
import { addProduct } from "../redux/actions/adminActions";
import { toast } from "react-toastify";
import { fetchAllProducts } from "../redux/actions/productActions";

function ProductsBackoffice() {
	const products = useSelector((state) => state.store.products);
	const [prods, setProds] = useState(products);
	const [showAdd, setShowAdd] = useState(false);
	const [form, setForm] = useState({
		Name: "",
		Description: "",
		Price: "",
		Quantity: "",
		Image: "",
	});
	const dispatch = useDispatch();

	const handleAddClose = () => setShowAdd(false);
	const handleAddShow = () => setShowAdd(true);

	useEffect(() => {
		dispatch(fetchAllProducts());
	}, [dispatch]);

	useEffect(() => {
		setProds(products);
	}, [products]);

	const handleInputChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleAddSubmit = (e) => {
		e.preventDefault();

		dispatch(addProduct(form))
			.then((response) => {
				if (response) {
					handleAddClose();
					toast.success("Product added successfully!");
				}
			})
			.catch((error) => {
				toast.error("Something went wrong!");
				toast.error(error);
			});
	};

	const handleSearch = (e) => {
		const searchValue = e.target.value;
		const filteredProducts = products.filter(
			(product) =>
				product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
				product.description.toLowerCase().includes(searchValue.toLowerCase())
		);
		setProds(filteredProducts);
	};

	return (
		<div>
			<div className="position-relative d-flex align-items-center justify-content-center mb-4">
				<Button variant="outline-primary" className="rounded-circle py-1 px-2 me-3" onClick={handleAddShow}>
					<i className="bi bi-plus-lg basicTitleFs"></i>
				</Button>
				<FormControl
					id="searchStore"
					type="search"
					placeholder="Search product"
					className="rounded-pill"
					onChange={handleSearch}
				/>
			</div>
			{prods.map((product) => (
				<Row key={product.id}>
					<ProductEditCard product={product} />
				</Row>
			))}
			<Modal className="z-max mt-5" show={showAdd} onHide={handleAddClose}>
				<ModalBody>
					<h3 className="display-5 text-center">Add Product</h3>
					<Form>
						<Form.Group controlId="formName">
							<Form.Label>Name:</Form.Label>
							<Form.Control required name="Name" value={form.Name} onChange={handleInputChange} />
						</Form.Group>
						<Form.Group controlId="formDescription">
							<Form.Label>Description:</Form.Label>
							<Form.Control required name="Description" value={form.Description} onChange={handleInputChange} />
						</Form.Group>
						<div className="d-flex">
							<Form.Group controlId="formPrice" className="me-2">
								<Form.Label>Price:</Form.Label>
								<Form.Control required name="Price" value={form.Price} onChange={handleInputChange} />
							</Form.Group>
							<Form.Group controlId="formQuantity">
								<Form.Label>Quantity:</Form.Label>
								<Form.Control required name="Quantity" value={form.Quantity} onChange={handleInputChange} />
							</Form.Group>
						</div>
						<Form.Group controlId="formImage">
							<Form.Label>Image:</Form.Label>
							<Form.Control required name="Image" value={form.Image} onChange={handleInputChange} />
						</Form.Group>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button variant="secondary" onClick={handleAddClose}>
						Close
					</Button>
					<Button type="submit" variant="primary" onClick={handleAddSubmit}>
						Add
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}

export default ProductsBackoffice;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../redux/actions/productActions";
import { Col, FormControl, Row } from "react-bootstrap";
import ProductStoreCard from "./ProductStoreCard";

function Store() {
	const dispatch = useDispatch();
	const products = useSelector((state) => state.store.products);
	const [productList, setProductList] = useState(products);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const [activeProduct, setActiveProduct] = useState(null);

	const handleCardClick = (productId) => {
		setActiveProduct(activeProduct === productId ? null : productId);
	};

	useEffect(() => {
		const root = document.querySelector("#root");
		root.style.backgroundColor = "white";
		root.style.backgroundImage = "none";

		dispatch(fetchAllProducts());

		return () => {
			root.style.backgroundColor = "";
			root.style.backgroundImage = "";
		};
	}, [dispatch]);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const handleSearch = (e) => {
		const searchValue = e.target.value;
		const filteredProducts = products.filter(
			(product) =>
				product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
				product.description.toLowerCase().includes(searchValue.toLowerCase())
		);
		setProductList(filteredProducts);
	};

	return (
		<>
			<div className="jukeHomeContainer">
				<div className="mb-3">
					<img src="/public/store/products/storeBgAlt.png" alt="store" className="img-fluid" />
				</div>
			</div>
			<div className="jukeContainer text-black">
				<div className="d-flex justify-content-between align-items-center">
					<h1 className="display-2 mb-0">Products</h1>
					<FormControl
						id="searchStore"
						type="search"
						placeholder="Search product"
						className="rounded-pill"
						onChange={handleSearch}
					/>
				</div>
				<Row xs={1} sm={2} md={3} lg={4} className="gy-4" style={{ minHeight: "500px" }}>
					{productList.length > 0 ? (
						productList.map((product) => (
							<Col key={product.id}>
								<ProductStoreCard
									product={product}
									isMobile={isMobile}
									active={activeProduct === product.id}
									onCardClick={handleCardClick}
								/>
							</Col>
						))
					) : (
						<div className="mt-5">
							<p className="fs-3 fw-light">No products found</p>
						</div>
					)}
				</Row>
			</div>
		</>
	);
}

export default Store;

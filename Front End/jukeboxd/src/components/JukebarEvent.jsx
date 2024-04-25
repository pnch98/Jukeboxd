import { Button, Col, Nav, NavDropdown, Navbar, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { setUserData, clearCart } from "../redux/reducers/storeUserReducer";
import { toast } from "react-toastify";
import { useCallback, useEffect, useRef, useState } from "react";

function JukebarEvent() {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.storeUser.userData);
	const [userRole, setUserRole] = useState("");
	const [isCanvasOpen, setIsCanvasOpen] = useState(false);
	const canvasRef = useRef(null);
	const buttonRef = useRef(null);
	const [isGlobeCanvasOpen, setIsGlobeCanvasOpen] = useState(false);
	const globeCanvasRef = useRef(null);
	const globeButtonRef = useRef(null);
	const [navbarColor, setNavbarColor] = useState("");
	const location = useLocation();

	useEffect(() => {
		if (location.pathname === "/events") {
			setNavbarColor("transparent");
		} else {
			setNavbarColor("");
		}
	}, [location.pathname]);

	const toggleCanvas = () => {
		setIsCanvasOpen((prevIsCanvasOpen) => !prevIsCanvasOpen);
	};

	const handleClickOutside = useCallback(
		(event) => {
			if (isCanvasOpen && !canvasRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
				setIsCanvasOpen(false);
			}
		},
		[isCanvasOpen, canvasRef, buttonRef]
	);

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [handleClickOutside]);

	const toggleGlobeCanvas = () => {
		setIsGlobeCanvasOpen((prevIsGlobeCanvasOpen) => !prevIsGlobeCanvasOpen);
	};

	const handleGlobeClickOutside = useCallback(
		(event) => {
			if (
				isGlobeCanvasOpen &&
				!globeCanvasRef.current.contains(event.target) &&
				!globeButtonRef.current.contains(event.target)
			) {
				setIsGlobeCanvasOpen(false);
			}
		},
		[isGlobeCanvasOpen, globeCanvasRef, globeButtonRef]
	);

	useEffect(() => {
		document.addEventListener("click", handleGlobeClickOutside);
		return () => {
			document.removeEventListener("click", handleGlobeClickOutside);
		};
	}, [handleGlobeClickOutside]);

	const logOut = () => {
		dispatch(setUserData({}));
		dispatch(clearCart());
		toast.success("Logged out successfully");
	};

	useEffect(() => {
		userData && setUserRole(userData.role);
	}, [userData]);

	return (
		<div id="navbarEvent" className="jukeContainer py-0 storeJukeBg" style={{ backgroundColor: navbarColor }}>
			<Navbar
				expand="lg"
				className="text-white-50 align-items-center justify-content-center justify-content-md-between py-3"
			>
				<div className="d-flex align-items-center py-2">
					<Navbar.Brand href="/" className="d-flex align-items-center py-0 mx-0">
						<img src="/public/imgs/jukeWhite.png" alt="logo" width={200} />
					</Navbar.Brand>
					<div className="d-none d-md-block ms-4">
						<NavLink to="/store" className="jukeLink me-md-3">
							Store
						</NavLink>
						<NavLink to="/events" className="jukeLink me-md-3">
							Events
						</NavLink>
					</div>
				</div>
				<div className="d-none d-md-flex">
					<Nav className="align-items-center">
						<NavDropdown
							title={
								<span className="text-white-50 fs-5">
									<i className="bi bi-person-circle"></i>
								</span>
							}
							id="basic-nav-dropdown"
							className="text-white-50 no-arrow JukeEventDropdown"
						>
							<NavDropdown.Item href="/store/profile">Profile</NavDropdown.Item>
							<NavDropdown.Item href="/store/my-orders">My orders</NavDropdown.Item>
							<NavDropdown.Divider />

							{userData && userData.token ? (
								<NavDropdown.Item onClick={() => logOut()}>Logout</NavDropdown.Item>
							) : (
								<NavDropdown.Item href="/store/login">Login</NavDropdown.Item>
							)}
						</NavDropdown>
					</Nav>
				</div>
			</Navbar>
			<>
				<div id="jukeEventBottomBar" className="jukeContainer py-3">
					<Row className="align-items-center">
						<Col>
							<div className="d-flex align-items-center justify-content-center">
								<Button
									variant="transparent"
									className="rounded-circle"
									onClick={toggleGlobeCanvas}
									ref={globeButtonRef}
								>
									<span className="text-white-50 fs-2">
										<i className="bi bi-globe"></i>
									</span>
								</Button>
							</div>
						</Col>
						<Col className="border border-light border-top-0 border-bottom-0">
							<Link to="/events" className="text-white-50">
								<div className="d-flex align-items-center justify-content-center">
									<img src="/public/imgs/jukeLogoWhite.png" alt="logo" width={40} />
								</div>
							</Link>
						</Col>
						<Col>
							<div className="d-flex align-items-center justify-content-center">
								<Button variant="transparent" className="rounded-circle" onClick={toggleCanvas} ref={buttonRef}>
									<span className="text-white-50 fs-2">
										<i className="bi bi-person-circle"></i>
									</span>
								</Button>
							</div>
						</Col>
					</Row>
				</div>
				{isCanvasOpen && (
					<div id="profileEventCanvas" className="canvas" ref={canvasRef}>
						<div className="h-100">
							<Nav className="flex-column justify-content-between text-center h-100 py-3">
								<div className="">
									<Nav.Link href="/store/profile" className="text-white-50">
										Profile
									</Nav.Link>
									<Nav.Link href="/store/my-orders" className="text-white-50">
										My orders
									</Nav.Link>
								</div>
								{userRole && userRole === "ADMIN" && (
									<div>
										<Nav.Link href="/store/admin/backoffice" className="text-white-50">
											Backoffice
										</Nav.Link>
									</div>
								)}
								{userData && userData.token ? (
									<Nav.Link onClick={() => logOut()} className="text-white-50">
										Logout
									</Nav.Link>
								) : (
									<Nav.Link href="/store/login" className="text-white-50">
										Login
									</Nav.Link>
								)}
							</Nav>
						</div>
					</div>
				)}
				{isGlobeCanvasOpen && (
					<div id="globeEventCanvas" className="canvas" ref={globeCanvasRef}>
						<div className="h-100">
							<Nav className="flex-column text-center h-100 py-3">
								<Nav.Link href="/" className="text-white-50 mb-3">
									Jukeboxd
								</Nav.Link>
								<Nav.Link href="/store" className="text-white-50">
									Store
								</Nav.Link>
							</Nav>
						</div>
					</div>
				)}
			</>
		</div>
	);
}

export default JukebarEvent;

import { Button, Col, FormControl, Nav, NavDropdown, Navbar, Row } from "react-bootstrap";
import { searchFetch } from "../redux/actions/searchActions";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { setExpireAt, setLoggedProfile, setRefreshToken, setToken } from "../redux/reducers/profileReducer";
import { setDiscoveries } from "../redux/reducers/discoveriesReducer";
import { setJukebox } from "../redux/reducers/jukeboxReducer";
import { setSaved } from "../redux/reducers/savedReducer";
import { setSearchResults } from "../redux/reducers/searchReducer";
import { useCallback, useEffect, useRef, useState } from "react";

function Jukebar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = useSelector((state) => state.profile.token);
	const location = useLocation();
	const [navbarColor, setNavbarColor] = useState("");
	const [isSearchMobileOpen, setIsSearchMobileOpen] = useState(false);
	const [isCanvasOpen, setIsCanvasOpen] = useState(false);
	const canvasRef = useRef(null);
	const buttonRef = useRef(null);
	const [isGlobeCanvasOpen, setIsGlobeCanvasOpen] = useState(false);
	const globeCanvasRef = useRef(null);
	const globeButtonRef = useRef(null);

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

	const showSearch = () => {
		const search = document.querySelector("#search");
		search.style.opacity = search.style.opacity === "1" ? "0" : "1";
		search.style.width = search.style.width === "200px" ? "0" : "200px";
		search.style.padding = search.style.padding === "8px 16px" ? "0px" : "8px 16px";
	};

	const showSearchMobile = () => {
		const search = document.querySelector("#searchBarMobile");
		search.style.opacity = search.style.opacity === "1" ? "0" : "1";
		search.style.width = search.style.width === "250px" ? "0" : "250px";
		search.style.padding = search.style.padding === "8px 16px" ? "0px" : "8px 16px";
		search.style["margin-left"] = search.style["margin-left"] === "10px" ? "0" : "10px";
		setIsSearchMobileOpen(!isSearchMobileOpen);
	};

	const handleSubmit = (id) => {
		const search = document.querySelector("#" + id);

		dispatch(searchFetch(search.value));

		search.value = "";
		showSearch();
		navigate("/search");
	};

	const logOut = () => {
		dispatch(setToken(null));
		dispatch(setRefreshToken(null));
		dispatch(setExpireAt(null));
		dispatch(
			setLoggedProfile({
				id: null,
				displayName: null,
				email: null,
			})
		);
		dispatch(setDiscoveries([]));
		dispatch(setJukebox([]));
		dispatch(setSaved([]));
		dispatch(setSearchResults([]));
		navigate("/login");
	};

	useEffect(() => {
		if (location.pathname.includes("/album") || location.pathname.includes("/artist")) {
			setNavbarColor("transparent");
			window.addEventListener("scroll", handleScroll);
		} else {
			setNavbarColor("");
		}

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [location.pathname]);

	const handleScroll = () => {
		const navbar = document.querySelector("#navbar");
		if (window.scrollY > 200) {
			navbar.style.transition = "background-color 1s ease";
			navbar.style.backgroundColor = "#0c1222";
		} else {
			navbar.style.background = "transparent";
		}
	};

	return (
		<div id="navbar" className="jukeContainer py-0" style={{ backgroundColor: navbarColor }}>
			<Navbar
				expand="lg"
				className="text-white-50 align-items-center justify-content-center justify-content-md-between py-3"
			>
				<div className="d-flex align-items-center py-2">
					<Navbar.Brand href="/" className="d-flex align-items-center py-0 mx-0">
						<img src="/public/imgs/jukeWhite.png" alt="logo" width={200} />
					</Navbar.Brand>
					<div id="otherLinks" className="d-none d-md-block ms-4">
						<NavLink to="/store" className="jukeLink me-md-3">
							Store
						</NavLink>
						<NavLink to="/events" className="jukeLink me-md-3">
							Events
						</NavLink>
					</div>
				</div>
				{location.pathname != "/login" && (
					<div className="d-none d-md-flex">
						<Nav className="align-items-center">
							<Nav.Link className="me-md-3" onClick={(e) => showSearch(e)}>
								<i className="bi bi-search text-white-50"></i>
							</Nav.Link>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleSubmit("search");
								}}
							>
								<FormControl id="search" type="text" placeholder="Search" className="rounded-pill " />
							</form>

							<NavDropdown
								title={
									<span className="text-white-50 fs-5">
										<i className="bi bi-person-circle"></i>
									</span>
								}
								id="basic-nav-dropdown"
								className="text-white-50 no-arrow JukeDropdown"
							>
								<NavDropdown.Item href="/jukebox">My Jukebox</NavDropdown.Item>
								<NavDropdown.Item href="/discoveries">Discoveries</NavDropdown.Item>
								<NavDropdown.Divider />
								{token ? (
									<NavDropdown.Item onClick={() => logOut()}>Logout</NavDropdown.Item>
								) : (
									<NavDropdown.Item href="/login">Login</NavDropdown.Item>
								)}
							</NavDropdown>
						</Nav>
					</div>
				)}
			</Navbar>
			{location.pathname != "/login" && (
				<>
					<div id="jukeBottomBar" className="jukeContainer py-3">
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
								<Link to="/" className="text-white-50">
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
					<div
						id="mobileSearch"
						className={
							isSearchMobileOpen ? "rounded-pill d-flex align-items-center" : "rounded-pill d-flex align-items-center"
						}
					>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSubmit("searchBarMobile");
							}}
						>
							<FormControl id="searchBarMobile" type="text" placeholder="Search" className="rounded-pill" />
						</form>
						<div>
							<Button variant="transparent" onClick={showSearchMobile} className="rounded-circle">
								<i className="bi bi-search text-white-50 fs-5"></i>
							</Button>
						</div>
					</div>

					{isCanvasOpen && (
						<div id="profileCanvas" className="canvas" ref={canvasRef}>
							<div className="h-100">
								<Nav className="flex-column justify-content-between text-center h-100 py-3">
									<div>
										<Nav.Link href="/jukebox" className="text-white-50 mb-3">
											My Jukebox
										</Nav.Link>
										<Nav.Link href="/discoveries" className="text-white-50">
											Discoveries
										</Nav.Link>
									</div>
									<Nav.Link onClick={() => logOut()} className="text-white-50">
										Logout
									</Nav.Link>
								</Nav>
							</div>
						</div>
					)}
					{isGlobeCanvasOpen && (
						<div id="globeCanvas" className="canvas" ref={globeCanvasRef}>
							<div className="h-100">
								<Nav className="flex-column text-center h-100 py-3">
									<Nav.Link href="/store" className="text-white-50 mb-3">
										Store
									</Nav.Link>
									<Nav.Link href="/events" className="text-white-50">
										Events
									</Nav.Link>
								</Nav>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default Jukebar;

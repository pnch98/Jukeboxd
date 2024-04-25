import "./App.css";
import Callback from "./components/Callback";
import Home from "./components/Home";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AlbumPage from "./components/AlbumPage";
import ArtistPage from "./components/ArtistPage";
import Jukebar from "./components/Jukebar";
import SearchPage from "./components/SearchPage";
import TrackPage from "./components/TrackPage";
import BackDrop from "./components/BackDrop";
import Discoveries from "./components/Discoveries";
import JukeboxPage from "./components/JukeboxPage";
import Store from "./components/Store";
import Cart from "./components/Cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JukebarStore from "./components/JukebarStore";
import StoreRegister from "./components/StoreRegister";
import StoreLogin from "./components/StoreLogin";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import UserOrders from "./components/UserOrders";
import PurchaseSuccess from "./components/PurchaseSuccess";
import Backoffice from "./components/Backoffice";
import EventPage from "./components/EventPage";
import JukebarEvent from "./components/JukebarEvent";
import EventSearchPage from "./components/EventSearchPage";
import EventDetailsPage from "./components/EventDetailsPage";
import TicketPurchaseComplete from "./components/TicketPurchaseComplete";

function NavigationBar() {
	const location = useLocation();

	if (location.pathname.includes("/events")) {
		return <JukebarEvent />;
	} else if (location.pathname.includes("/store")) {
		return <JukebarStore />;
	} else {
		return <Jukebar />;
	}
}

function App() {
	return (
		<>
			<BrowserRouter>
				<div id="backDropContainer">
					<BackDrop />
				</div>
				<div id="eventBackdrop"></div>

				<NavigationBar />

				<ToastContainer position="bottom-right" autoClose={1500} style={{ bottom: "85px" }} />

				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/callback" element={<Callback />} />
					<Route path="/" element={<Home />} />
					<Route path="/album/:albumId" element={<AlbumPage />} />
					<Route path="/artist/:artistId" element={<ArtistPage />} />
					<Route path="/track/:trackId" element={<TrackPage />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/discoveries" element={<Discoveries />} />
					<Route path="/jukebox" element={<JukeboxPage />} />
					<Route path="/store" element={<Store />} />
					<Route path="/store/cart" element={<Cart />} />
					<Route path="/store/register" element={<StoreRegister />} />
					<Route path="/store/login" element={<StoreLogin />} />
					<Route path="/store/admin/backoffice" element={<Backoffice />} />
					<Route path="/store/profile" element={<Profile />} />
					<Route path="/store/my-orders" element={<UserOrders />} />
					<Route path="/store/purchase/success/" element={<PurchaseSuccess />} />
					<Route path="/events" element={<EventPage />} />
					<Route path="/events/search" element={<EventSearchPage />} />
					<Route path="/events/event/:eventId" element={<EventDetailsPage />} />
					<Route path="/events/tickets/purchase_completed" element={<TicketPurchaseComplete />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;

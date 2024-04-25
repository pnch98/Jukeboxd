import { PropTypes } from "prop-types";
import { useState } from "react";
import { Button, Col, Modal, ModalBody, ModalFooter, Row } from "react-bootstrap";
import { makeAdmin, removeAdmin } from "../redux/actions/adminActions";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function AdminEditCard({ user, method, triggerFetch, setTriggerFetch }) {
	const [showRemove, setShowRemove] = useState(false);
	const adminId = useSelector((state) => state.storeUser.userData.id);

	const handleRemoveShow = () => setShowRemove(true);
	const handleRemoveClose = () => setShowRemove(false);

	const handleRemoveSubmit = () => {
		removeAdmin(user.id).then((response) => {
			if (response) {
				handleRemoveClose();
				setTriggerFetch(!triggerFetch);
				toast.success("Admin removed successfully!");
			} else {
				toast.error("Something went wrong!");
			}
		});
	};

	const handleAddSubmit = () => {
		makeAdmin(user.id).then((response) => {
			if (response) {
				setTriggerFetch(!triggerFetch);
				toast.success("Admin added successfully!");
			} else {
				toast.error("Something went wrong!");
			}
		});
	};

	return (
		<div className="d-flex justify-content-between border border-dark border-top-0 border-end-0 border-start-0 pb-3 mt-2">
			<div className="flex-grow-1">
				<Row xs={4}>
					{method == "remove" && (
						<Col>
							<p className="basicFs mb-0">Id</p>
							<p className="basicFs mb-0">{user.id}</p>
						</Col>
					)}
					<Col>
						<p className="basicFs mb-0">Name</p>
						<p className="basicFs mb-0">{user.name}</p>
					</Col>
					<Col>
						<p className="basicFs mb-0">Last Name</p>
						<p className="basicFs mb-0">{user.lastName}</p>
					</Col>
					<Col>
						<p className="basicFs mb-0">Email</p>
						<p className="basicFs mb-0">{user.email}</p>
					</Col>
				</Row>
			</div>
			<div className="d-flex justify-content-center align-items-center">
				{method == "remove" && user.id != adminId && (
					<Button variant="outline-danger" className="rounded-circle py-1 px-2" onClick={handleRemoveShow}>
						<i className="bi bi-trash-fill basicTitleFs"></i>
					</Button>
				)}
				{method == "add" && (
					<Button variant="outline-primary" className="rounded-circle py-1 px-2" onClick={handleAddSubmit}>
						<i className="bi bi-plus-lg basicTitleFs"></i>
					</Button>
				)}
			</div>
			<Modal className="mt-5" show={showRemove} onHide={handleRemoveClose}>
				<ModalBody>
					<h3 className="display-5 text-center">Remove admin</h3>
					<p>Are you sure you want to remove {user.email} from admin role?</p>
				</ModalBody>
				<ModalFooter>
					<Button variant="secondary" onClick={handleRemoveClose}>
						Cancel
					</Button>
					<Button type="submit" variant="danger" onClick={handleRemoveSubmit}>
						Remove
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}

AdminEditCard.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
	}),
	method: PropTypes.string.isRequired,
	triggerFetch: PropTypes.bool.isRequired,
	setTriggerFetch: PropTypes.func.isRequired,
};

export default AdminEditCard;

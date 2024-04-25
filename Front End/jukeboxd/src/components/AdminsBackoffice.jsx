import { useEffect, useState } from "react";
import { Button, Col, FormControl, Modal, ModalBody, ModalFooter, Row } from "react-bootstrap";
import { getAllAdmins, getUsersByEmail } from "../redux/actions/adminActions";
import AdminEditCard from "./AdminEditCard";

function AdminsBackoffice() {
	const [admins, setAdmins] = useState([]);
	const [showAdd, setShowAdd] = useState(false);
	const [text, setText] = useState("");
	const [timer, setTimer] = useState(null);
	const [usersFound, setUsersFound] = useState([]);
	const [triggerFetch, setTriggerFetch] = useState(false);

	const handleAddShow = () => setShowAdd(true);
	const handleAddClose = () => {
		setShowAdd(false);
		setUsersFound([]);
		setText("");
	};

	useEffect(() => {}, [usersFound]);

	useEffect(() => {
		getAllAdmins().then((response) => {
			if (response) {
				setAdmins(response);
			}
		});
	}, [triggerFetch]);

	const handleChange = (e) => {
		clearTimeout(timer);
		setText(e.target.value);
	};

	useEffect(() => {
		if (text !== "") {
			setTimer(
				setTimeout(() => {
					getUsersByEmail(text).then((data) => {
						setUsersFound(data);
					});
				}, 1500)
			);
		}
	}, [text]);

	return (
		<Col>
			<div className="position-relative d-flex align-items-center justify-content-center mb-4">
				<Button variant="outline-primary" className="rounded-circle py-1 px-2" onClick={handleAddShow}>
					<i className="bi bi-plus-lg basicTitleFs"></i>
				</Button>
			</div>
			<Row xs={1}>
				{admins.length > 0 ? (
					admins.map((admin) => (
						<Col key={admin.id}>
							<AdminEditCard
								user={admin}
								method={"remove"}
								triggerFetch={triggerFetch}
								setTriggerFetch={setTriggerFetch}
							/>
						</Col>
					))
				) : (
					<h1 className="display-5 text-center">No admin found</h1>
				)}
			</Row>
			<Modal className="mt-5" show={showAdd} onHide={handleAddClose}>
				<ModalBody>
					<h3 className="display-5 text-center">Search user</h3>
					<FormControl onChange={handleChange} className="mb-4" />
					{usersFound && usersFound.length > 0 && (
						<div>
							{usersFound &&
								usersFound.map((user) => (
									<div key={user.id}>
										<AdminEditCard
											user={user}
											method={"add"}
											triggerFetch={triggerFetch}
											setTriggerFetch={setTriggerFetch}
										/>
									</div>
								))}
						</div>
					)}
				</ModalBody>
				<ModalFooter>
					<Button variant="secondary" onClick={handleAddClose}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		</Col>
	);
}

export default AdminsBackoffice;

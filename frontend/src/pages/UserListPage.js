import React, { useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listUsers, deleteUser } from "../actions/userActions";

function UserListPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userList = useSelector((state) => state.userList);
	const { loading, error, users } = userList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDelete = useSelector((state) => state.userDelete);
	const { success: successDelete } = userDelete;

	useEffect(() => {
		if (userInfo && userInfo.is_admin) {
			dispatch(listUsers());
		} else {
			navigate("/login");
		}
	}, [dispatch, navigate, successDelete, userInfo]);

	const deleteHandler = (id) => {
		if (window.confirm('You sure you want to delete this user?')) {
			dispatch(deleteUser(id));
		}
		
	};

	return (
		<div>
			<h1>Users</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<Table striped bordered hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Admin</th>
							<th></th>
						</tr>
					</thead>

					<tbody>
						{users.map((user) => (
							<tr key={user.id}>
								<td>{user.id}</td>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>
									{user.is_admin ? (
										<i
											className="fas fa-check"
											style={{ color: "green" }}
										></i>
									) : (
										<i
											className="fas fa-check"
											style={{ color: "red" }}
										></i>
									)}
								</td>
								<td>
									<LinkContainer
										to={`/user/${user.id}/edit`}
									>
										<Button
											variant="light"
											className="btn-sm"
										>
											<i className="fas fa-edit"></i>
										</Button>
									</LinkContainer>
									<Button
										variant="danger"
										className="btn-sm"
										onClick={() => deleteHandler(user.id)}
									>
										<i className="fas fa-trash"></i>
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</div>
	);
}

export default UserListPage;

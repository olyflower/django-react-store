import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

function UserEditPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [is_admin, setAdmin] = useState(false);

	const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails);
	const { error, loading, user } = userDetails;

	const userUpdate = useSelector((state) => state.userUpdate);
	const {
		error: errorUpdate,
		loading: loadingUpdate,
		success: successUpdate,
	} = userUpdate;

	useEffect(() => {
    if (successUpdate) {
        dispatch({ type: USER_UPDATE_RESET });
        navigate("/users");
    } else {
        if (!user.name || user.id !== Number(id)) {
            dispatch(getUserDetails(id));
        } else {
            setName(user.name);
            setEmail(user.email);
            setAdmin(user.is_admin);
        }
    }
}, [dispatch, user, id, successUpdate, navigate]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(updateUser({ id: user.id, name, email, is_admin }));
	};
	return (
		<div>
			<Link to="/users">Go back</Link>
			<FormContainer>
				<h1>Edit user</h1>
				{loadingUpdate && <Loader/>}
				{errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant="danger">{error}</Message>
				) : (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId="name">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="name"
								placeholder="Enter your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId="email">
							<Form.Label>Email Address</Form.Label>
							<Form.Control
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId="isadmin">
							<Form.Label>Password</Form.Label>
							<Form.Check
								type="checkbox"
								label="Is Admin"
								checked={is_admin}
								onChange={(e) => setAdmin(e.target.checked)}
							></Form.Check>
						</Form.Group>

						<Button type="submit" variant="primary">
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</div>
	);
}

export default UserEditPage;

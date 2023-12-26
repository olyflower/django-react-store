import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SearchBar() {
	const [keyword, setKeyword] = useState("");

	const navigate = useNavigate();

	const submitHandler = (e) => {
		e.preventDefault();
		if (keyword) {
			navigate(`/?keyword=${keyword}&page=1`);
		} else {
			navigate(`${window.location.pathname}`);
		}
	};
	return (
		<Form onSubmit={submitHandler} inline="true">
			<Form.Control
				type="text"
				name="q"
				onChange={(e) => setKeyword(e.target.value)}
				className="my-2"
			></Form.Control>
			<Button type="submit" variant="outline-success" className="p-2">
				Submit
			</Button>
		</Form>
	);
}

export default SearchBar;

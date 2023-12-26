import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Progress from "../components/Progress";
import { savePaymentMethod } from "../actions/cartActions";

function PaymentPage() {
	const cart = useSelector((state) => state.cart);
	const { shippingAddress } = cart;

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [paymentMethod, setPaymentMethod] = useState("PayPal");

	if (!shippingAddress.address) {
		navigate("/shipping");
	}

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(savePaymentMethod(paymentMethod))
		navigate("/placeorder");
	};

	return (
		<FormContainer>
			<Progress step1 step2 step3 />

			<Form onSubmit={submitHandler}>

				<Form.Group>
					<Form.Label as='legend'>Select payment Method</Form.Label>
					<Col>
						<Form.Check
							type='radio'
							label='PayPal or Credit Cart'
							id='paypal'
							name="paymentMethod"
							checked
							onChange={(e) => setPaymentMethod(e.target.value)}
						>

						</Form.Check>
					</Col>
				</Form.Group>

				<Button type='submit' variant="primary">
					Contiue
				</Button>

			</Form>
		</FormContainer>
	);
}

export default PaymentPage;

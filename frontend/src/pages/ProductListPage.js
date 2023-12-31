import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import {
	listProducts,
	deleteProduct,
	createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

function ProductListPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const productList = useSelector((state) => state.productList);
	const { loading, error, products, pages, page } = productList;

	const productDelete = useSelector((state) => state.productDelete);
	const {
		loading: loadingDelete,
		error: errorDelete,
		success: successDelete,
	} = productDelete;

	const productCreate = useSelector((state) => state.productCreate);
	const {
		loading: loadingCreate,
		error: errorCreate,
		success: successCreate,
		product: createdProduct,
	} = productCreate;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const location = useLocation();
	let keyword = location.search;

	useEffect(() => {
		dispatch({ type: PRODUCT_CREATE_RESET });

		if (!userInfo.is_admin) {
			navigate("/login");
		}

		if (successCreate) {
			navigate(`/product/${createdProduct.id}/edit`);
		} else {
			dispatch(listProducts(keyword));
		}
	}, [
		dispatch,
		navigate,
		userInfo,
		successDelete,
		successCreate,
		createdProduct,
		keyword,
	]);

	const deleteHandler = (id) => {
		if (window.confirm("You sure you want to delete this product?")) {
			dispatch(deleteProduct(id));
		}
	};

	const createProductHandler = () => {
		dispatch(createProduct());
	};

	return (
		<div>
			<Row className="align-items-center">
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className="text-right">
					<Button className="my-3" onClick={createProductHandler}>
						<i className="fas fa-plus"></i>Add product
					</Button>
				</Col>
			</Row>

			{loadingDelete && <Loader />}
			{errorDelete && <Message variant="danger">{errorDelete}</Message>}

			{loadingCreate && <Loader />}
			{errorCreate && <Message variant="danger">{errorCreate}</Message>}

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<div>
					<Table
						striped
						bordered
						hover
						responsive
						className="table-sm"
					>
						<thead>
							<tr>
								<th>ID</th>
								<th>Name</th>
								<th>Price</th>
								<th>Category</th>
								<th>Brand</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{products.map((product) => (
								<tr key={product.id}>
									<td>{product.id}</td>
									<td>{product.name}</td>
									<td>{product.price}$</td>
									<td>{product.category}</td>
									<td>{product.brand}</td>

									<td>
										<LinkContainer
											to={`/product/${product.id}/edit`}
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
											onClick={() =>
												deleteHandler(product.id)
											}
										>
											<i className="fas fa-trash"></i>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Paginate page={page} pages={pages} isAdmin={true} />
				</div>
			)}
		</div>
	);
}

export default ProductListPage;

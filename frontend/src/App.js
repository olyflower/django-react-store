import { Container } from "react-bootstrap"
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import ProductPage from "./pages/ProductPage"
import CartPage from "./pages/CartPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import ShippingPage from "./pages/ShippingPage"
import PaymentPage from "./pages/PaymentPage"
import PlaceOrderPage from "./pages/PlaceOrderPage"
import OrderPage from './pages/OrderPage'
import OrderListPage from './pages/OrderListPage'
import UserListPage from './pages/UserListPage'
import UserEditPage from './pages/UserEditPage'
import ProductListPage from './pages/ProductListPage'
import ProductEditPage from './pages/ProductEditPage'


function App() {
	return (
		<Router>
			<Header />
			<main className="py-3">
				<Container>
                    <Routes>
                        <Route path='/' element={<HomePage/>} exact/>
						<Route path='/login' element={<LoginPage/>}/>
						<Route path='/register' element={<RegisterPage/>}/>
						<Route path='/profile' element={<ProfilePage/>}/>
                        <Route path='/product/:id' element={<ProductPage/>}/>
						<Route path='/products' element={<ProductListPage/>}/>
						<Route path='/product/:id/edit' element={<ProductEditPage/>}/>
						<Route path='/cart/:id?' element={<CartPage/>}/>
						<Route path='/shipping' element={<ShippingPage/>}/>
						<Route path='/payment' element={<PaymentPage/>}/>
						<Route path='/placeorder' element={<PlaceOrderPage/>}/>
						<Route path='/order/:id' element={<OrderPage/>}/>
						<Route path='/orders' element={<OrderListPage/>}/>
						<Route path='/users' element={<UserListPage/>}/>
						<Route path='/user/:id/edit' element={<UserEditPage/>}/>
                    </Routes>
				</Container>
			</main>
			<Footer />
		</Router>
	);
}

export default App;

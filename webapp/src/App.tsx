import React, { useState } from 'react';

import { Product } from './shared/shareddtypes';

import Home from './components/Home';
import Shopping from './components/Shopping';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Checkout from './components/Checkout';

import './App.css';

import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';

function App(): JSX.Element {
	const [productsCart, setProductsCart] = useState<Product[]>([]);
	const [unitProducts, setUnits] = useState<Map<string, number>>(new Map()); //String - product code // Number - Products Units

	const handleAddCart = (product: Product) => {
		if (unitProducts.has(product.code))
			unitProducts.set(product.code, unitProducts.get(product.code)! + 1);
		else {
			unitProducts.set(product.code, 1);

			const products = productsCart.slice();
			products.push(product);
			setProductsCart(products);
		}
		
		setUnits(unitProducts);
		render();
	}

	const handleDecrementUnit = (product: Product) => {
		unitProducts.set(product.code, unitProducts.get(product.code)! - 1);

		if (unitProducts.get(product.code) == 0){
			unitProducts.delete(product.code);
			productsCart.forEach((p, index: number) => {
				if (p.code == product.code)
				delete productsCart[index];
			})
		}

    	render();
  	}

	const render = () =>{
		ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		document.getElementById('root')
		);
	}

	return (
		<Router>
			<Routes>
				<Route 
					index 
					element={ <Home
						onAdd={ handleAddCart } /> 
					} 
				/>
				<Route 
					path="cart" 
					element={ <Shopping products={productsCart} 
								units={unitProducts} 
								onDecrementUnit={handleDecrementUnit} 
								onIncrementUnit={handleAddCart}/>
							} 
				/>
				<Route path="checkout" element={ <Checkout /> } />
				<Route path="sign-in" element={ <SignIn /> } />
				<Route path="sign-up" element={ <SignUp />} />
			</Routes>
		</Router>
	);
}

export default App;

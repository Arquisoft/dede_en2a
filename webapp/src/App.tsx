import React, { useState, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home';
import Shopping from './components/Shopping';
import {Product} from './shared/shareddtypes';
import 'bootstrap/dist/css/bootstrap.min.css';

function App(): JSX.Element {

  const [productsCart, setProductsCart] = useState<Product[]>([]);

  const handleAddCart = (product : Product) => {
    const products = productsCart.slice();
    products.push(product);
    setProductsCart(products);
  }

  return (
        <Router>
          <Routes>
              <Route path="/" element={<Home onAdd={handleAddCart} />}/>
              <Route index element={<Home onAdd={handleAddCart}/>} />
              <Route path="cart" element={<Shopping products = {productsCart} />}/>
          </Routes>
        </Router>
  );
}

export default App;

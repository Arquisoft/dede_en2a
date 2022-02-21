import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Welcome from './components/Welcome';
import  {getUsers} from './api/api';
import {User} from './shared/shareddtypes';
import {Product} from './shared/shareddtypes';
import './App.css';
import ProductList from './components/ProductList';
import ShoppingCart from './components/ShoppingCart';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Shopping from './components/Shopping';

function App(): JSX.Element {

  const [users,setUsers] = useState<User[]>([]);
  const [productsCart, setProductsCart] = useState<Product[]>([]);

  const refreshUserList = async () => {
    setUsers(await getUsers());
  }

  useEffect(()=>{
    refreshUserList();
  },[]);

  const handleAddCart = (product : Product) => {
      const products = productsCart.slice();
      products.push(product);
      setProductsCart(products);
  }

  return (
    <>

      <Container maxWidth="sm">
        <Welcome message="DeDe Application"/>
        <ProductList products={[]} OnAddCart={handleAddCart}/>
        <ShoppingCart products={productsCart}/>
      </Container>
    </>
  );
}

export default App;

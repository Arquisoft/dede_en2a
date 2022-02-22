import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Welcome from '../components/Welcome';
import  {getUsers} from '../api/api';
import {User} from '../shared/shareddtypes';
import {Product} from '../shared/shareddtypes';
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart';
import {Link} from "react-router-dom";
import NavBar from './NavBar';

type HomeProps = {
    onAdd: (product : Product) => void;
}
function Home(props: HomeProps) : JSX.Element{
  const [users,setUsers] = useState<User[]>([]);
  

  const refreshUserList = async () => {
    setUsers(await getUsers());
  }

  useEffect(()=>{
    refreshUserList();
  },[]);

  return (
    <>
        <NavBar/>
        <Container maxWidth="sm">
            <Welcome message="DeDe Application"/>
            <ProductList products={[]} OnAddCart={props.onAdd}/>
        </Container>
    </>
  );
};

export default Home;
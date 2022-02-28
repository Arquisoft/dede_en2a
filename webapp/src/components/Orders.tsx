import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import {Link} from 'react-router-dom';
import { Order } from '../shared/shareddtypes';
import Container from '@mui/material/Container';
import { getOrders } from '../api/api';
import OrderItem from './OrderItem';

//type OrdersProps = {
  //  pedidos : Order[];
//}

function Orders():JSX.Element{
    const[pedidos, setOrders] = useState<Order[]>([]);
    const refreshOrderList = async () =>{
      setOrders(await getOrders());
    }

    //useEffect(() =>{
      // refreshOrderList();
    //},[]);

    return(
        <>
        <NavBar/>
        <h2>
            Your orders
        </h2>
        <ul>Orders
            {pedidos.map(pedido => (
                <OrderItem orders = {pedido}/>
            ))}
        </ul>
        </>

    )

    
}
 

export default Orders;
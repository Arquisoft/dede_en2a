import React from 'react';
import { Order } from '../shared/shareddtypes';

type OrderItemProps = {
    orders : Order;
}

function OrderItem(props: OrderItemProps):JSX.Element{
    //const{userId, products, totalPrice, shippingPrice} = props.orders;
    return <li>User: {props.orders.userId} Products: {props.orders.products} Total: {props.orders.totalPrice} Shipping price: {props.orders.shippingPrice} </li>
}
export default OrderItem;
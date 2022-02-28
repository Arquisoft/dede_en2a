import { useEffect, useState } from "react";
import { Order, OrderProduct, Product } from "../shared/shareddtypes";
import * as api from "../api/api";

type OrderItemProps = {
  orders: Order;
};

function OrderItem(props: OrderItemProps): JSX.Element {
  const [producto, setProducto] = useState<Product>();

  const productsHtml: String[] = [];

  return (
    <li>
      User: {props.orders.userId}
      Products:{" "}
      {props.orders.products.map((product: OrderProduct) => {
          // CREAR COMPONENTE Y MANEJAR ALLI LA INFO
        return "Product code:" + product.code + " ";
      })}
      Total: {props.orders.totalPrice}
      Shipping price: {props.orders.shippingPrice}
    </li>
  );
}
export default OrderItem;

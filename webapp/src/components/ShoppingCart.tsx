import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Product} from '../shared/shareddtypes';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { FlowNode } from 'typescript';
import { useEffect, useState } from 'react';

type ShoppingCartProps = {
    products: Product[],
}

function calculateTotal(products : Product[]) : number{
    let total: number = 0;
    products.forEach((product) => {
        total += product.price;
    })
    return total;
    
}
function ShoppingCart(props: ShoppingCartProps) : JSX.Element {

    const [shoppingCart, setShoppingCart] = useState<Product[]>([]);
    const [unitsProduct, setUnitsProducts] = useState<Map<string, number>>(new Map());

    const updateCart = (products: Product[]) =>{
        const cart = shoppingCart.slice();
        products.forEach((product : Product) =>{
            if (unitsProduct.has(product.code)){
                let value = unitsProduct.get(product.code)!;
                unitsProduct.set(product.code, value + 1);
            } else{
                unitsProduct.set(product.code, 1);
                cart.push(product);
                setShoppingCart(cart);
            }
        })

        setUnitsProducts(unitsProduct);
    }

    useEffect(()=>{
        updateCart(props.products);
    },[]);

    return (
        <>
            <h2>Shopping Cart</h2>
            <List>
                {shoppingCart.map((product, i) =>{
                    return (
                        <ListItem key={product.code}>
                            <ListItemIcon>
                                <Inventory2Icon/>
                            </ListItemIcon>
                            <ListItemText primary={product.name} secondary={product.price}/>
                            <ListItemText primary={unitsProduct.get(product.code)}/>
                        </ListItem>
                    )
                })}
            </List>
            <h3>Total Price - {calculateTotal(props.products)} €</h3>
        </>
    )
}

export default ShoppingCart;
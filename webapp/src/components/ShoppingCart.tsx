import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Product} from '../shared/shareddtypes';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import {getProduct} from '../api/api';

type ShoppingCartProps = {
    products: Product[];
    units: Map<string, number>;
    onIncrementUnit: (product: Product) => void;
    onDecrementUnit: (product: Product) => void;
}

function calculateTotal(products : Product[], units : Map<string, number>) : number{
    let total:number = 0;
    products.forEach((product: Product) =>{
        let unit = units.get(product.code)!;
        total += unit * product.price;
    })
    return total;
}
function ShoppingCart(props: ShoppingCartProps) : JSX.Element {

    const [productsCart, setProducts] = useState<Product[]>(props.products);
    const [unitsProduct, setUnitsProducts] = useState<Map<string, number>>(props.units);

    const handleButton = (product: Product) =>{
        if (unitsProduct.get(product.code)! >= product.stock){
            return false;
        } else{
            return true;
        }
    }  

    return (
        <>
            <h2>Shopping Cart</h2>
            <List>
                {productsCart.map((product, i) =>{
                    return (
                        <>
                        <ListItem key={product.code}>
                            <img className="m-2" src={require('../images/'.concat(product.code).concat('.jpg'))} width="100px"></img>
                            <p className="font-weight-bold">{product.name}</p>
                            <div style={{float: "right"}}>
                                <Badge className="m-2" bg="primary">{unitsProduct.get(product.code)}</Badge>
                                <Button onClick={() => props.onIncrementUnit(product)} disabled={!handleButton(product)} className="m-1" variant="success">+</Button>
                                <Button onClick={() => props.onDecrementUnit(product)} className="m-1" variant="danger">-</Button>
                            </div>
                        </ListItem>
                        </>
                    )
                })}
            </List>
            <h3>Total Price - {calculateTotal(productsCart, unitsProduct)} €</h3>
        </>
    )
}

export default ShoppingCart;
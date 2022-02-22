import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Product} from '../shared/shareddtypes';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { FlowNode } from 'typescript';
import { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { handleBreakpoints } from '@mui/system';
import { SettingsInputAntennaTwoTone } from '@mui/icons-material';

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

    return (
        <>
            <h2>Shopping Cart</h2>
            <List>
                {productsCart.map((product, i) =>{
                    return (
                        <ListItem key={product.code}>
                            <ListItemIcon>
                                <Inventory2Icon/>
                            </ListItemIcon>
                            <ListItemText primary={product.name} secondary={product.price}/>
                            <p>{unitsProduct.get(product.code)}</p>
                            <button onClick={() => props.onIncrementUnit(product)}>+</button>
                            <button onClick={() => props.onDecrementUnit(product)}>-</button>
                        </ListItem>
                    )
                })}
            </List>
            <h3>Total Price - {calculateTotal(productsCart, unitsProduct)} €</h3>
        </>
    )
}

export default ShoppingCart;
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Product} from '../shared/shareddtypes';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { FlowNode } from 'typescript';

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

    return (
        <>
            <h2>Shopping Cart</h2>
            <List>
                {props.products.map((product, i) =>{
                    return (
                        <ListItem key={product.code}>
                            <ListItemIcon>
                                <Inventory2Icon/>
                            </ListItemIcon>
                            <ListItemText primary={product.name} secondary={product.price}/>
                        </ListItem>
                    )
                })}
            </List>
            <h3>Total Price - {calculateTotal(props.products)} €</h3>
        </>
    )
}

export default ShoppingCart;
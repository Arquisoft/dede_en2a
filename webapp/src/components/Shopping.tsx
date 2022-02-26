import React from 'react';
import {Link} from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import ShoppingCart from './ShoppingCart';
import NavBar from './NavBar';
import {Product} from '../shared/shareddtypes';

import {updateProduct} from '../api/api';

type ShoppingProps = {
    products : Product[];
    units: Map<string, number>;
    onIncrementUnit: (product: Product) => void;
    onDecrementUnit: (product: Product) => void;
}

function Shopping(props: ShoppingProps) :JSX.Element{
    const handleUpdateStock = () =>{
        props.products.forEach((product) => {
            let productUnits : number = props.units.get(product.code)!;
            product.stock = product.stock - productUnits;
            updateProduct(product);
        })
    }

    return(
        <React.Fragment>
            <NavBar/>
            <Typography variant="h4" className="m-2">Shopping Cart</Typography>
            <ShoppingCart 
                products={props.products}
                units={props.units} 
                onIncrementUnit={props.onIncrementUnit} 
                onDecrementUnit={props.onDecrementUnit}
            />
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems="center"
            >
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="outlined"
                        className="m-1">
                            Continue shopping
                    </Button>
                </Link>

                <Link to="/pay" style={{ textDecoration: 'none' }}>
                    <Button 
                        variant="contained"
                        onClick={ handleUpdateStock }
                        className="m-1">
                            Proceed to checkout
                    </Button>
                </Link>
            </Stack>
        </React.Fragment>
    )
}

export default Shopping;
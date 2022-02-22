import React from 'react';
import ShoppingCart from './ShoppingCart';
import {Product} from '../shared/shareddtypes';
import NavBar from './NavBar';

type ShoppingProps = {
    products : Product[];
}

function Shopping(props: ShoppingProps) :JSX.Element{
    return(
        <>  
            <NavBar/>
            <ShoppingCart products={props.products}/>
        </>
    )
}

export default Shopping;
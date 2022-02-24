import React from 'react';
import ShoppingCart from './ShoppingCart';
import {Product} from '../shared/shareddtypes';
import NavBar from './NavBar';
import {Link} from 'react-router-dom';
import {updateProduct} from '../api/api';
import ProductList from './ProductList';

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
        <>  
            <NavBar/>
            <ShoppingCart products={props.products} units={props.units} onIncrementUnit={props.onIncrementUnit} onDecrementUnit={props.onDecrementUnit}/>
            <Link to="/pay">
                <button onClick={handleUpdateStock}>
                    Comprar
                </button>
            </Link>
        </>
    )
}

export default Shopping;
import React from 'react';
import ShoppingCart from './ShoppingCart';
import {Product} from '../shared/shareddtypes';
import NavBar from './NavBar';
import {Link} from 'react-router-dom';

type ShoppingProps = {
    products : Product[];
    units: Map<string, number>;
    onIncrementUnit: (product: Product) => void;
    onDecrementUnit: (product: Product) => void;
}

function Shopping(props: ShoppingProps) :JSX.Element{;
    return(
        <>  
            <NavBar/>
            <ShoppingCart products={props.products} units={props.units} onIncrementUnit={props.onIncrementUnit} onDecrementUnit={props.onDecrementUnit}/>
            <Link to="/pay">
                <button>
                    Comprar
                </button>
            </Link>
        </>
    )
}

export default Shopping;
import React from 'react';
import ShoppingCart from './ShoppingCart';
import {Product} from '../shared/shareddtypes';
import NavBar from './NavBar';
import {Link} from 'react-router-dom';

type ShoppingProps = {
    products : Product[];
}

function Shopping(props: ShoppingProps) :JSX.Element{;

    const handleBuy = () => {

    }

    return(
        <>  
            <NavBar/>
            <ShoppingCart products={props.products}/>
            <Link to="/pay">
                <button>
                    Comprar
                </button>
            </Link>
        </>
    )
}

export default Shopping;
import {useState} from 'react';
import type { AlertColor } from '@mui/material/Alert';
import {Product} from '../shared/shareddtypes';
import ProductBox from './ProductBox';

type ProductListProps = {
    products: Product[];
    OnAddCart: (product : Product) => void;
}

function ProductList(props: ProductListProps) : JSX.Element{

    let product: Product = {code:"1234", name: "Camiseta Real Madrid Vinisius", description:"Camistea Real Madrid XL Temporada 21/22", price: 75.5, image:"realmadrid.jpg"};
    let product1 : Product = {code:"1236", name: "Camiseta Real Madrid Mbappe", description:"Camistea Real Madrid XL Temporada 22/23 Bastante Fake La verdad", price: 250, image:"realmadrid.jpg"};
    let product2 : Product={code: "1237", name: "Camiseta Real Madrid El Bichooo", description:"SUUUUUUUUUUUUUU", price: 1500, image:'elbicho.jpg'};
    const [products] = useState([product, product1, product2]);
    return (
        <>
            <div>
                {products.map(product => (<ProductBox product={product} onAdd={(productToAdd : Product) => props.OnAddCart(productToAdd)}/>))}
            </div>
        </>
    )
}

export default ProductList;
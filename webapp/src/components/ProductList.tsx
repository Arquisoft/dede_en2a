import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { Product } from '../shared/shareddtypes';
import ProductBox from './ProductBox';
import { getProducts } from '../api/api';


type ProductListProps = {
    products: Product[];
    OnAddCart: (product : Product) => void;
}

function ProductRow(props : any) : JSX.Element {
    return (
        <React.Fragment>
            <Grid item xs={6}>
                <ProductBox 
                    product={props.product1} 
                    onAdd={(productToAdd : Product) => props.OnAddCart(productToAdd)}
                />
            </Grid>

            <Grid item xs={6}>
                <ProductBox 
                    product={props.product2}
                    onAdd={(productToAdd : Product) => props.OnAddCart(productToAdd)}
                />
            </Grid>
        </React.Fragment>
    )
}

function ProductList(props: ProductListProps) : JSX.Element{
    // let product: Product = {code:"1234", name: "Camiseta Real Madrid Vinisius", description:"Camistea Real Madrid XL Temporada 21/22", price: 75.5, stock: 100};
    // let product1 : Product = {code:"1236", name: "Camiseta Real Madrid Mbappe", description:"Camistea Real Madrid XL Temporada 22/23 Bastante Fake La verdad", price: 250, stock: 50};
    // let product2 : Product={code: "1237", name: "Camiseta Real Madrid El Bichooo", description:"SUUUUUUUUUUUUUU", price: 1500, stock: 0};
    // let product3 : Product={code:"1347", name:"Camiseta Real Sporting Jony", description: "Ni de coña chaval", price:10.99, stock: 10};
    // const [products] = useState([product, product1, product2, product3]);
    
    const[products, setProducts] = useState<Product[]>([]);
    
    const refreshProductList = async () =>{
        setProducts(await getProducts());
    }

    //Works like componentDidMount(), it is called when the component is render for the first time.
    useEffect(() =>{
        refreshProductList();
    },
    []);

    return (
        <Grid 
            container 
            rowSpacing={5}
            className="mt-2 mb-2"
        >
            {
                products.map(product => (
                    <Grid 
                        container 
                        item 
                    >
                        <ProductRow 
                            product1={product}
                            product2={product}
                        />
                  </Grid>
                ))
            }
        </Grid>
    )
}

export default ProductList;
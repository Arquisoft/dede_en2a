import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {Product} from '../shared/shareddtypes';

type ProductProps = {
    product: Product;
    onAdd: () => void;
}

function ProductBox(props: any): JSX.Element{
    console.log('../images/'.concat(props.product.code).concat('.jpg'));
    return (
        <>
           <Box component="div">
               <Grid container alignItems="center">
                    <Grid item xs={10}>
                        <h2>{props.product.name} - {props.product.price} €</h2>
                        <p>{props.product.description}</p>
                        <button onClick={() => props.onAdd(props.product)}>Añadir producto</button>
                    </Grid>
                    <Grid item xs={2}>
                        <img src={require('../images/'.concat(props.product.code).concat('.jpg'))} width="300px" alt="image"/>
                    </Grid>
               </Grid>
           </Box>
        </>
    );
}

export default ProductBox;
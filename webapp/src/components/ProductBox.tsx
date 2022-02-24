import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {Product} from '../shared/shareddtypes';
import Badge from 'react-bootstrap/Badge';
import { fontWeight } from '@mui/system';

type ProductProps = {
    product: Product;
    onAdd: () => void;
}

function ProductBox(props: any): JSX.Element{

    const [stockClasses, setStockClasses] = useState<string>("success");
    const [stockText, setStockText] = useState<string>("Stock available!");
    const [stockOption, setStockOption] = useState<boolean>(true);

    const handleStock = (stock:number) => {
        if (stock == 0){
            setStockClasses("danger");
            setStockText("No stock available!");
            setStockOption(false);
        } else if (stock <= 10){
            setStockClasses("warning");
            setStockText("Few units left!");
            setStockOption(true);
        } else{
            setStockClasses("success");
            setStockText("Stock available!");
            setStockOption(true);
        }
    }

    useEffect(() => {
        handleStock(props.product.stock);
    },[])

    return (
        <>
           <Box component="div" className="m-2">
               <Grid container alignItems="center" className="m-5" direction="column" rowSpacing="5">
                    <Grid item xs>
                        <img src={require('../images/'.concat(props.product.code).concat('.jpg'))} width="300px" alt="image"/>
                    </Grid>
                    <Grid item xs><span style={{fontSize: "15px",  fontWeight: "bold"}}>{props.product.name}</span></Grid>
                    <Grid item xs><span>{props.product.price} €</span></Grid>
                    <Grid item xs><Badge style={{fontSize: "13px"}} bg={stockClasses}>{stockText}</Badge></Grid>
                    <Grid item xs><button disabled={!stockOption} onClick={() => props.onAdd(props.product)}>Add product</button></Grid>
               </Grid>
           </Box>
        </>
    );
}

export default ProductBox;
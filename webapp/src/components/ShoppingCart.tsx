import React, { useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import {Product} from '../shared/shareddtypes';

type ShoppingCartProps = {
    products: Product[];
    units: Map<string, number>;
    onIncrementUnit: (product: Product) => void;
    onDecrementUnit: (product: Product) => void;
}

function calculateTotal(products : Product[], units : Map<string, number>) : number{
    let total:number = 0;
    products.forEach((product: Product) =>{
        let unit = units.get(product.code)!;
        total += unit * product.price;
    })
    return total;
}
function ShoppingCart(props: ShoppingCartProps) : JSX.Element {
    const [productsCart, setProducts] = useState<Product[]>(props.products);
    const [unitsProduct, setUnitsProducts] = useState<Map<string, number>>(props.units);

    const handleButton = (product: Product) =>{
        if (unitsProduct.get(product.code)! >= product.stock){
            return false;
        } else{
            return true;
        }
    }

    const Img = styled('img')({
        display: 'block',
        width: '25%',
    });

    if (productsCart.length > 0)
        return (
            <React.Fragment>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell> Product </TableCell>
                                <TableCell> Quantity </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            productsCart.map((product : Product) => {
                                return (
                                    <TableRow key={product.code}>
                                        <TableCell>
                                            <Stack 
                                                direction={{ xs: 'column', sm: 'row' }}
                                                spacing={{ xs: 1, sm: 2, md: 4 }}
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            >
                                                <Img 
                                                    alt="Imagen del producto en el carrito"
                                                    src={ require('../images/'.concat(product.code).concat('.jpg')) } 
                                                /> 
                                                {product.name}
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Stack
                                                direction={{ xs: 'column', sm: 'row' }}
                                                justifyContent="space-evenly"
                                                alignItems="center"
                                            >
                                                <Button 
                                                    onClick={ () => props.onDecrementUnit(product) } 
                                                    className="m-1">
                                                        -
                                                </Button>
                                                <Typography component="div">
                                                    {unitsProduct.get(product.code)}
                                                </Typography>
                                                <Button 
                                                    onClick={ () => props.onIncrementUnit(product) } 
                                                    disabled={!handleButton(product)} 
                                                    className="m-1">
                                                        +
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant="h6" className="m-2">
                    Total Price - {calculateTotal(productsCart, unitsProduct)}€
                </Typography>
            </React.Fragment>
        )
    else
        return (
            <Typography variant="h6" className="m-2">
                Shopping cart is empty :(
            </Typography>
        )                           
}

export default ShoppingCart;
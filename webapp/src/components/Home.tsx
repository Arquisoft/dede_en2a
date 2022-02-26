import React, { useState, useEffect } from 'react';

import CssBaseline from '@mui/material/CssBaseline';

import { getUsers } from '../api/api';
import { User } from '../shared/shareddtypes';
import { Product } from '../shared/shareddtypes';

import ProductList from './ProductList';
import NavBar from './NavBar';

type HomeProps = {
    onAdd: (product : Product) => void;
}

function Home(props: HomeProps) : JSX.Element{
	const [users,setUsers] = useState<User[]>([]);

	const refreshUserList = async () => {
		setUsers(await getUsers());
	}

	useEffect(()=>{
		refreshUserList();
	},
	[]);

	return (
		<React.Fragment>
			<CssBaseline />
			<NavBar />
			<ProductList 
				products={[]} 
				OnAddCart={props.onAdd}
			/>
		</React.Fragment>
	);
};

export default Home;
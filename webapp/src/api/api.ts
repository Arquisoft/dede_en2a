import {Order, User} from '../shared/shareddtypes';
import {Product} from '../shared/shareddtypes';

export async function addUser(user:User):Promise<boolean>{
    const apiEndPoint= process.env.REACT_APP_API_URI || 'http://localhost:5000/api'
    let response = await fetch(apiEndPoint+'/users/add', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({'name':user.name, 'email':user.email})
      });
    if (response.status===200)
      return true;
    else
      return false;
}

export async function getUsers():Promise<User[]>{
    const apiEndPoint= process.env.REACT_APP_API_URI || 'http://localhost:5000/api'
    let response = await fetch(apiEndPoint+'/users/list');
    //The objects returned by the api are directly convertible to User objects
    return response.json()
}

export async function getProducts():Promise<Product[]>{
    const apiEndPoint = process.env.REACT_APP_ARI_URI || 'http://localhost:5000'
    let response = await fetch(apiEndPoint+'/products/list');
    return response.json();
}

export async function getProduct(productCode : string): Promise<Product> {
    const apiEndPoint = process.env.REACT_APP_ARI_URI || 'http://localhost:5000';
    let response = await fetch(apiEndPoint + '/products/findByCode/' + productCode);
    return response.json();
}

export async function updateProduct(product: Product){
    const apiEndPoint = process.env.REACT_APP_ARI_URI || 'http://localhost:5000';
    let response = await fetch(apiEndPoint + '/products/update/' + product.code,{
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({'name':product.name, 'price': product.price, 
      'description': product.description, 'stock':product.stock})
    });
}

export async function getOrders():Promise<Order[]>{
  const apiEndPoint = process.env.REACT_APP_ARI_URI || 'http://localhost:5000'
  let response = await fetch(apiEndPoint+'/orders/list');
  return response.json();
}
import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';



const ProductDetail = ({shoppingCart}) => {
    const {id} = useParams();
    const [product , setProduct] = useState(null);
    const [loading , setLoading] = useState(true);


    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
            setProduct(data);
            setLoading(false);
        });
    },[id])

    if (loading) return <p>Loading...</p>;
    if (!product) return <p>Product not found</p>


    return(
        <div className='Product-detail'>
            <img src={product.image} alt="product.title"/>
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            <h2>${product.price}</h2>
            <button onClick={() => shoppingCart({...product,quantity: 1})}>Add to Cart</button>
        </div>
    )
}

export default ProductDetail;
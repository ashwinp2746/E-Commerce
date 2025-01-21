import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";

export default function ListProduct() {
  const [allproducts,setAllproducts]=useState([]);

  const fetchInfo = async () => {
    await fetch("http://localhost:4000/allproduct")
      .then((res) => res.json())
      .then((data) => {
        setAllproducts(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_Product = async (id) => {
    await fetch("http://localhost:4000/removeproduct",{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({id:id}),
    })
    await fetchInfo();
  }

  return (
    <div className="listproduct">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproduct">
        <hr />
        {allproducts.map((product, index) => {
          return (
              <div key={index}>
                <div className="listproduct-format-main listproduct-format">
                  <img
                    src={product.image}
                    className="listproduct-product-image"
                  />
                  <p>{product.name}</p>
                  <p>${product.old_price}</p>
                  <p>${product.new_price}</p>
                  <p>{product.category}</p>
                  <img onClick={() => {remove_Product(product.id)}} className="listproduct-remove-icon" src={cross_icon} />
                </div>
                <hr />
              </div>
          )
        })}
      </div>
    </div>
  );
}

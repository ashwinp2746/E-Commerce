import React, { useEffect, useState } from 'react'
import './Popular.css'
// import data_product from '../Assets/data'
import Item from '../Item/Item'

export default function Popular() {

  const [data_product , setDataProduct] = useState([])

  useEffect(()=>{
    fetch('http://localhost:4000/popularinwomen')
    .then((res) => res.json())
    .then((data) => setDataProduct(data))
  },[])

  return (
    <div className='popular'>
        <h1>POPULAR FOR WOMEN</h1>
        <hr />
        <div className="popular-item">

            {/* map() --> accepts a callback and applies that function 
            to each element of an array and then return a new array */}

            {/* Here item is parameter , 
            i is index */}

            {data_product.map((item,i)=>{
                return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}

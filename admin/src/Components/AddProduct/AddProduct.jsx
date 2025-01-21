import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

export default function AddProduct() {
  const[image , setImage] = useState(false);

  const [productDetails , setProductDetails] = useState({
    name:"",
    image:"",
    category:"women",
    new_price:"",
    old_price:"",
  })

  const imageHandler = (e) =>{
      // The target property returns the element where the event occured.
      // The target property is read-only.
      setImage(e.target.files[0])
  }

  const changeHandler = (e) =>{
    setProductDetails({...productDetails,[e.target.name]:e.target.value})
  }

  const Add_Product = async () =>{
      console.log(productDetails);
      let resData;
      let product = productDetails;
      
      let formData = new FormData();
      // for appending the image we use append and choose field name product
      formData.append('product',image)


      await fetch('http://localhost:4000/upload',{
        method: 'POST',
        headers:{
          Accept:'application/json',
        },
        body:formData,
      })
      // Promise
      .then((res) => res.json())
      // here data that we got through promise
      // pass data
      .then((data)=>{resData=data})

      if(resData.success)
      {
        product.image = resData.image_url;
        console.log(product);

        // send product to upload endpoint
        await fetch('http://localhost:4000/addproduct' , {
          method:'POST',
          headers:{
            Accept:'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(product),
        })
        .then((res) => res.json())
        .then((data) => {
          data.success?alert("Product added"):alert("failed")
        })
      }
  }
  return (
    <div className='addproduct'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type Here' />
      </div>    
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type Here'/>
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler}  type="text" name='new_price' placeholder='Type Here'/>
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='addproduct-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">

        {/* label tag give on img that we can click on img insted of clicking on input file button */}
        {/* Here htmlFor represent for in react we give same id and htmlFor in label */}
      <label htmlFor='file-input'>

          {/* The createObjectURL() static method of the URL interface creates a string containing a URL representing the object given in the parameter. */}
          {/* A File, Blob, or MediaSource object to create an object URL for. */}
          <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
      </div>
      <button onClick={() => {Add_Product()}} className='addproduct-btn'>ADD</button>
    </div>
  )
}


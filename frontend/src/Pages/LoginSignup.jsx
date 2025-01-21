import { useState } from "react";
import "./css/LoginSignup.css";

export default function LoginSignup() {
  
  const [state, setState] = useState("Login")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const changeHandler =(e) => {
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const login = async () => {
    console.log("Login Function Executed", formData)
    let resData;
    await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{
        Accept:'application/formData',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    })
    .then((res)=> res.json())
    .then((data)=>{
      resData = data
    })

    if(resData.success){
      localStorage.setItem("auth-token" , resData.token)
      window.location.replace("/")
    }
    else{
      alert(resData.errors)
    }
  }

  const signup = async() => {
    console.log("Sign Up Function Executed", formData)
    let resData;
    await fetch("http://localhost:4000/signup", {
      method: 'POST',
      headers: {
        Accept: "application/formData",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then((res) => res.json())
    .then((data) => {
      resData = data;
    });

    if (resData.success) {
      localStorage.setItem("auth-token", resData.token);
      window.location.replace("/");
    }
    else{
      alert(resData.errors)
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? 
            <input
              type="text"
              name='username'
              value={formData.username}
              onChange={changeHandler}
              placeholder="Your name"
            />
           : 
            <></>
          }
          <input
            type="email"
            name='email'
            value={formData.email}
            onChange={changeHandler}
            placeholder="Email Address"
          />
          <input
            type="password"
            name='password'
            value={formData.password}
            onChange={changeHandler}
            placeholder="Password"
          />
        </div>
        <button
          onClick={() => {
            state === "Login" ? login() : signup();
          }}
        >
          Continue
        </button>
        {state === "Sign Up" ? 
          <p className="loginsignup-login">
            Already have an account?
            <span onClick={() => setState("Login")}>Login Here</span>
          </p>
         : 
          <></>
        }
        {state === "Login" ? 
          <p className="loginsignup-login">
            Create an account?
            <span onClick={() => setState("Sign Up")}>Click Here</span>
          </p>
         : 
          <></>
        }
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

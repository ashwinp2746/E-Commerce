const port = 4000;
const express = require("express");
const app = express();
// For Database 
const mongoose = require("mongoose");
// For generate the token and verify the token
const jwt = require("jsonwebtoken");
// For image storage system 
const multer = require("multer");
const path = require("path");
// To provide access to react project
const cors = require("cors");


// Any Req we get it is parse using json method
app.use(express.json());
// Get Access To React Frontend to connect with the backend
app.use(cors());


// Database connection with mongoDb
mongoose.connect("mongodb+srv://ashwinp27:Ashwinp@cluster0.31jsq.mongodb.net/e-commerce")

// API Creation
app.get("/", (req, res) => {
    res.send("Express App is Running")
})

// Image Storage Engine
// We use Multer that handles uploading files in node.js
// File Storage: Provides options for storing uploaded files on the server,
//  such as in-memory storage, disk storage, or using a custom storage engine

const storage = multer.diskStorage({
    destination: './upload/images',

    // Generate the Filename 
    filename: (req, file, cb) => {

        // Template literals are literals delimited with backtick ( ` ) characters, 
        // allowing for multi-line strings, string interpolation with embedded expressions, 
        // and special constructs called tagged templates.


        // With template literals, an expression can be embedded in a placeholder. 
        // A placeholder is represented by ${} , with anything within the curly brackets 
        // treated as JavaScript and anything outside the brackets treated as a string

        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

// Creating Upload Endpoint for Images

const upload = multer({ storage: storage })

app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {

    // JSON stands for JavaScript Object Notation
    // JSON is a lightweight format for storing and transporting data
    // JSON is often used when data is sent from a server to a web page
    // JSON is "self-describing" and easy to understand

    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for creating products

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true
    },
})

// Creating Api For Adding Products
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else {
        id = 1
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    })
})

// Creating Api For Deleting Products
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
})

// Creating API for getting all products
app.get('/allproduct', async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Schema for creating User
const User = mongoose.model('User', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

//  Creating Endpoint for registering the user
app.post('/signup', async (req, res) => {
    
    let check = await User.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false , errors: "existing user found with same email address" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    await user.save();

    // Jwt token authentication

    const data = {
        user:{
            id:user.id
        }
    }

    // in sign we added data object and salt
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

// Creating endpoint for user Login
app.post('/login' , async(req,res) => {
    let user = await User.findOne({email:req.body.email})
    if (user) {
        const passwordCompare = req.body.password === user.password
        if(passwordCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            // here secret_ecom is salt
            const token = jwt.sign(data , 'secret_ecom')
            res.json({success:true,token})
        }
        else{
            res.json({success:false , errors:"wrong Password"})
        }
    }
    else{
        res.json({success:false,errors:"wrong email id"})
    }
})

// Creating Endpoint for newcollection data
app.get('/newcollection',async (req,res) => {
    let product = await Product.find({});
    let newcollection = product.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection)
    
})

// Creating Endpoint For popular in women section
app.get('/popularinwomen' , async (req,res) => {
    let product = await Product.find({category:'women'})
    let popularinwomen = product.slice(0,4)
    console.log("Popular in Women Fetched");
    res.send(popularinwomen)
})

// Creating middleware to fetch user
// We can Convert the auth-token in user id
const fetchUser = async (req,res,next) => {
    const token =  req.header('auth-token')
    if (!token) {
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try {
            const data = jwt.verify(token,'secret_ecom')
            req.user = data.user
            next()
        } catch (error) {
            res.status(401).send({errors:'please authenticate using a valid token'})
        }
    }
}

//Creating Endpoint for adding product in cartdata
app.post('/addtocart',fetchUser,async (req,res) => {
    // console.log(req.body,req.user);
    console.log("added",req.body.itemId)
    
    let userData = await User.findOne({_id:req.user.id})
    userData.cartData[req.body.itemId] += 1 
    
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("added")
})

// creating endpoint to remove product fro cartData
app.post('/removefromcart',fetchUser,async (req,res) => {
    console.log("removed",req.body.itemId)
    
    let userData = await User.findOne({_id:req.user.id})
    
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1
    
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Removed")
})

//creating endpoints to get cartData
app.post('/getcart',fetchUser,async (req,res) => {
    console.log("Getcart");
    let userData = await User.findOne({_id:req.user.id})
    res.json(userData.cartData)
})

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    }
    else {
        console.log("Error : " + error);
    }
})

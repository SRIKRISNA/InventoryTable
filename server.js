const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const ejs = require('ejs');
const customerM = require('./models/customer');
const orderM = require('./models/order');
const inventoryM = require('./models/inventory');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({limit:'30mb', extended:true}));

app.set('view engine', 'ejs');

//mongo db 
mongoose.connect("mongodb://localhost/api_web_tech_assignment").then((req, res)=>{
    console.log("db connection established..!");
    // res.status(200).send('connected mongo');
})

//port
app.listen(3005, (req,res)=>{
    console.log("server connected");
    // res.send("server connectd");
})

//get customer details
app.get('/customerDetails', (req, res) => {
    customerM.find((err, result) => {
        res.send(result);
    })
})
//get order details
app.get('/orders', (req, res) => {
    orderM.find((err, result) => {
        res.send(result)
    })
})
//get inventory details
app.get('/inventory', (req, res) => {
    inventoryM.find((err, result) => {
        res.status(200).send(result)
    })
})
//get inevntory type details
app.get('/inventory/electronics', (req, res) => {
    inventoryM.find({inventory_type:"electronics"}).then((inventory) => {
        res.status(200).send(inventory)
    })
})
app.get('/inventory/furniture', (req, res) => {
    inventoryM.find({inventory_type:"furniture"}).then((inventory) => {
        res.status(200).send(inventory)
    })
})

//create inventory
app.post('/createInventory', (req,res)=>{
    const inventory = new inventoryM({
        inventory_id: req.body.inventory_id,
        inventory_type: req.body.inventory_type,
        item_name: req.body.item_name,
        Avl_quantity: req.body.Avl_quantity
    })
    inventory.save().then(()=>{
        console.log("new inventory item added");
        res.send("added new item");
    }).catch((err)=>{
        res.send(err);
        console.log(err);
    })
})

//create customer
app.post('/createCustomer', (req,res)=>{
    const customer = new customerM({
        customer_id: req.body.customer_id,
        customer_name: req.body.customer_name,
        email: req.body.email
    })
    customer.save().then(()=>{
        console.log("new customer registered");
        res.send("new customer registered");
    }).catch((err)=>{
        res.send(err);
        console.log(err);
    })
})
//create orders
app.post('/createOrders', async (req,res)=>{
    const order = new orderM({
        customer_id: req.body.customer_id,
        inventory_id: req.body.inventory_id,
        item_name: req.body.item_name,
        quantity: req.body.quantity
    })
    await orderM.create(order)
    const item = await inventoryM.find({inventory_id:req.body.inventory_id})

    if(item[0].Avl_quantity <= 0) res.send("Out of STock");

    if(item.length){
        if(req.body.quantity <= item[0].Avl_quantity){
            const setQty = item[0].Avl_quantity - req.body.quantity;

           await inventoryM.updateOne({inventory_id:req.body.inventory_id}, {Avl_quantity:setQty})
            res.status(200).send("Order placed")
        }else{
            res.send("Out of Stock")
        }
    }else{
        res.send("Item entry wrong, plz check")
    }
    
})

//update available quantity
app.get('/itemname/availablequantity', (req, res) => {
    const item =  inventoryM.find({inventory_id:req.body.inventory_id})
    res.send(parseInt(item[0].Avl_quantity));

})
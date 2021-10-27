const express = require('express'); // 1.......
const app = express(); // 2...... 
const port = process.env.PORT || 5000; // 3 ......

// for .env variable must have declare.
require('dotenv').config()

// middlewaire.......
var cors = require("cors");
app.use(cors());
app.use(express.json());
// const ObjectId = require('ObjectId').ObjectId;

//external 
const { MongoClient } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u6fw9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// ALl Works will happen happend.
async function run () {
    try {
       await client.connect();
       const database = client.db("ema-jhon");   // database name
       const Allproducts = database.collection("products");   // Collections name
       const orderCollect = database.collection("orders");   // Collections name


    //......  kno data read korte chaile = get method use korte hobe.
    //......  kno data craete korte kore database a rakte chaile = post method.


       // GET products API calls
       app.get('/products', async (req, res) =>{
       // console.log(req.query);  
       const cursor = Allproducts.find({}); // Show all products here.
       const page = req.query.page;
       const size = parseInt(req.query.size);

       // 1st-- useing count for showing all data length.
       // 2nd-- i've to change json (data.products) in  clined site.
       const count = await cursor.count();
        
       let products;
       if(page){
         products = await cursor.skip(page*size).limit(size).toArray();
       }
       else{
        // getting all the value from cursor & set to it in toArray & if i set limit(10) product will be load 10. 
         products = await cursor.toArray(); 
       }
        //after getting respons sending products to client site.
       res.send({
           count: count,
           products
       });
     }) 


    // Use POST to get data by keys...
    app.post('/products/byKeys', async(req, res) => {
       const keys = req.body; 
       const query = { key: {$in: keys} } // ata diye key maddome data gulo get korlm.
       const products = await Allproducts.find(query).toArray();
       res.json(products);
    })


    // Get Order API
    app.post('/orders', async (req, res) => {
        const order = req.body;
        const result = await orderCollect.insertOne(order);
        res.json(result);
    })


    }
    finally {
     // await client.close();
    }
}

run().catch(console.dir);

// 4...... 
app.get('/', (req, res) =>{
    res.send('Ema Server is running...')
});


// 5......
app.listen(port, () =>{
    console.log('listening on port', port);
})
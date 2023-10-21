const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


//middleware

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lxaloof.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const productCollection = client.db('productDB').collection('product');

        const cartCollection = client.db('productDB').collection('mycart')

        const userCollection = client.db('productDB').collection('user');


        //cart related api start

        app.post('/card', async (req, res) => {
            const newCart = req.body;
            console.log(newCart);
            const result = await cartCollection.insertOne(newCart);
            res.send(result);
        })

        app.get('/card', async (req, res) => {
            const cursor = await cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/card/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id }
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })

        //cart related api end



        app.get('/product', async (req, res) => {
            const cursor = await productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/product/:brandname', async (req, res) => {
            const brandname = req.params.brandname;
            const query = { brandname: brandname }
            const cursor = await productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/server/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);
        })




        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedProduct = req.body;
            const product = {
                $set: {
                    image: updatedProduct.image,
                    name: updatedProduct.name,
                    brandname: updatedProduct.brandname,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating
                }
            }

            const result = await productCollection.updateOne(filter, product, options);
            res.send(result);

        })

        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        //user related apis

        app.get('/user', async (req, res) => {
            const cursor = await userCollection.find();
            const users = await cursor.toArray();
            res.send(users);

        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('brand shop server is running')
})

app.listen(port, () => {
    console.log(`brand shop server is running on port : ${port}`)
})
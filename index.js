const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ihuwgkj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        const serviceCollection = client.db('paintService').collection('services');
        const reviewCollection = client.db('paintService').collection('reviews');

        app.get('/services', async(req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query).sort({$natural:-1});
            const services = await cursor.toArray();
            res.send(services);

        })

        app.post('/services', async(req, res) => {
            const service = req.body;
            console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        app.get('/reviews', async(req, res) =>{
            let query = {};
            if(req.query.service){
                query = {
                    service: req.query.service
                }
            }
            else if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query).sort({$natural:-1});
            const reviews = await cursor.toArray();
            res.send(reviews);

        })



        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        

    }
    finally{

    }

}

run().catch(err => console.err(err));



app.get('/', (req, res)  =>{
    res.send('paint server is running')
})


app.listen(port, ()=>{
    console.log(`paint server running on ${port}`);
})

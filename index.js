const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.port || 5000;

// rhr-tech-admin
// 0DhABUmZywc9ECtM
const uri =
  "mongodb+srv://rhr-tech-admin:0DhABUmZywc9ECtM@cluster0.gsplul7.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("productDB");
    const productCollection = database.collection("products");
    const addedProduct = database.collection("purchased");

    // to load specific data based on brand
    app.get("/products/:brand", async (req, res) => {
      const brand = req.params.brand;
      //   console.log(brand);
      const query = { brand: brand };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/products/brand/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      //   console.log("this is result", result);
      res.send(result);
    });
    // to load added data
    app.get("/added", async (req, res) => {
      const cursor = addedProduct.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // to load all data
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // add product to database and server
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });
    // add product after add to cart
    app.post("/added", async (req, res) => {
      const product = req.body;
      const result = await addedProduct.insertOne(product);
      res.send(result);
    });
    // delete product after click delete
    app.delete("/added/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await addedProduct.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

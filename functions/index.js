/* eslint-disable no-unused-vars */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();

const serviceAccount = require("./permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use( cors({origin: true} ));

const db = admin.firestore();

// Routes
app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello World");
});

// Create
app.post("/api/create", (req, res) => {
  
  (async () => {

    try {
      await db.collection('products').doc('/' + req.body.id + '/')
        .create({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price
        });

      return res.status(200).send();
    }
    catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }

  })();
});

// Read all product
app.get("/api/read/", (req, res) => {
  
  (async () => {

    try
    {
        let query = db.collection('products');
        let response = [];

        await query.get().then(querySnapshot => {
          let docs = querySnapshot.docs;

          for (let doc of docs){
            const selectedItem = {
              id: doc.id,
              name: doc.data().name,
              description: doc.data().description,
              price: doc.data().price
            };
            response.push(selectedItem);
          }
          return response;
        });
        return res.status(200).send(response);
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send(error);
    }

  })();
});



// Read by id
app.get("/api/read/:id", (req, res) => {
  
  (async () => {

    try
    {
        const document = db.collection('products').doc(req.params.id);
        let product = await document.get();
        let response = product.data();

        return res.status(200).send(response);
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send(error);
    }

  })();
});

// Update
app.put("/api/update/:id", (req, res) => {
  
  (async () => {

    try
    {
        const document = db.collection('products').doc(req.params.id);
        
        await document.update({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price
        });

        return res.status(200).send();
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send(error);
    }

  })();
});


// Delete
app.delete("/api/delete/:id", (req, res) => {
  
  (async () => {

    try
    {
        const document = db.collection('products').doc(req.params.id);
        
        await document.delete();
        return res.status(200).send();
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send(error);
    }

  })();
});


// Export the api to the firebase cloud function
exports.app = functions.https.onRequest(app);

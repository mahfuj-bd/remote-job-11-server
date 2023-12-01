const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elekwkd.mongodb.net/?retryWrites=true&w=majority`;

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

    const  jobsCollection = client.db("jobs").collection("jobsCollection")
    const appliedJobsCollection = client.db("jobs").collection("appliedJobsCollection")

    app.get('/jobs', async (req, res) => {
      const result = await jobsCollection.find().toArray()

      res.send(result);
  })


  
  app.get("/jobdetails/:_id", async (req, res) => {
    const id = req.params._id
    const query = {
        _id : new ObjectId(id)
    }
    const result = await jobsCollection.findOne(query)
    res.send(result)
    
})

app.post('/jobs', async (req, res) => {
  const job = req.body
  const result = await jobsCollection.insertOne(job)
 
  res.send(result);
})

app.post('/appliedJobs', async (req, res) => {
  const appliedJob = req.body
  const result = await appliedJobsCollection.insertOne(appliedJob)
  res.send(result);
}
)

app.get('/appliedJobs', async (req, res) => {
  const result = await appliedJobsCollection.find().toArray()

  res.send(result);
})

  app.get("/jobs/:id", async (req, res) => {
            const id = req.params.id
            
            const query = {
                _id : new ObjectId(id)
            }
            const result = await jobsCollection.findOne(query)
            console.log(result);
            res.send(result)
            
        })
        
        
        /* delete a single job  */
        app.delete('/jobs/:id', async (req, res) => {
          const id = req.params.id
          console.log(id);
          const query = { _id:new ObjectId(id) }
          const result = await jobsCollection.deleteOne(query)
          console.log(result);
          res.send(result);
      }
      )

           app.put('/jobs/:id', async (req, res) => {
            const id = req.params.id
            const filter = {
                _id: new ObjectId(id)
            }
            const newjobs = req.body
            const options = {
                upsert: true,
            }
            const updatedJob = {
                $set: {
                    jobBanner: newjobs.jobBanner,
                    jobTitle: newjobs.jobTitle,
                    category: newjobs.category,
                    salaryRange: newjobs.salaryRange,
                    short_description: newjobs.short_description,
                    postingDate: newjobs.postingDate,
                    applicationDeadline: newjobs.applicationDeadline,
                    postedBy: newjobs.postedBy

                }
            }
            const result = await jobsCollection.updateOne(filter, updatedJob, options)
            console.log(result);
            res.send(result);
        })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('remote job is running...')
})

app.listen(port, () =>{
    console.log(`remote job server is running on port ${port}`);
})
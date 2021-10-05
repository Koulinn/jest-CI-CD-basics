import app from "./server.js"
import mongoose from 'mongoose'

const port = process.env.PORT
const mongoUrl = process.env.MONGO_DEV_URL ? process.env.MONGO_DEV_URL : process.env.MONGO_PROD_URL

mongoose.connect(mongoUrl, {
    useNewUrlParser: true
}).then(() => {
    console.log("🍀 Connected to MongoDB")
    app.listen(port, () => {
        console.log("🤘 Server listening on port " + port)
    })
}).catch(e=>console.log(e))

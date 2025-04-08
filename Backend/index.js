import dotenv from 'dotenv';
dotenv.config();

import app from './app.js'
import connectDB from './db/connectDB.js'
const port = process.env.PORT

connectDB().
then(()=>{
    app.listen(port, ()=>{ console.log('App is running on port : ', port) })
})

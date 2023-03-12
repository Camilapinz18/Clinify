const express = require('express')
const cors = require('cors');
const morgan=require('morgan')
require('dotenv').config()
const db=require('./db/db')
const PORT = process.env.PORT
const app = express()

/*Middlewares*/
app.use(express.json())
app.use(cors());
app.use(morgan('dev'))

/*Routes*/
const authRoutes=require('./routes/auth.routes')
const historyRoutes=require('./routes/history.routes')
const physicianRoutes=require('./routes/physician.routes')
const userRoutes=require('./routes/user.routes')

app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/histories',historyRoutes)
app.use('/api/v1/physicians',physicianRoutes)
app.use('/api/v1/users',userRoutes)

/*Server and DB*/
db()
app.listen(PORT, () => {
  console.log(`Server started at ${PORT} port`)
})


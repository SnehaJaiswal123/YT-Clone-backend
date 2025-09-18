import express from 'express'
import cookieParser from 'cookie-parser'
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
app.use('/api/users',userRouter)

export {app}
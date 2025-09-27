import express from 'express'
import cookieParser from 'cookie-parser'
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
app.use('/api/users',userRouter)
app.use('/api/videos',videoRouter)
app.use('/api/subscriptions',subscriptionRouter)

export {app}
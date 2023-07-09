const http=require('http')
const app=require('./app')
require('dotenv').config()
const server=http.createServer(app)
const API_PORT=process.env.PORT || 3000
server.listen(API_PORT,()=>{
    console.log(`Server listening on port ${API_PORT}`)
})
import express from "express"
const app= express()
const PORT=3000
app.get("/",(req,res)=>{
    res.send("this is the home page")
})
app.get("/about",(req,res)=>{
    res.send("this is the about page")
})
app.listen(PORT,()=>{
    console.log(`Test app listening on port ${PORT}`)
})
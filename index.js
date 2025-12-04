require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")

const { initializeDb } = require("./db/db-connect")
const { errorHandler } = require("./middleware/errorHandler")
const productRoute = require("./routes/product-routes")
const categoryRoute = require("./routes/category-routes")
const addressRoute = require("./routes/address-routes")
const orderRouter = require("./routes/order-routes")
const userRouter = require("./routes/user-routes")
const cartRouter = require("./routes/cart-routes")
const wishlistRouter = require("./routes/wishlist-routes")

initializeDb()
const corsOptions = {
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200

}



app.use(cors(corsOptions))
app.use(express.json())

app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/wishlist", wishlistRouter)
app.use("/api", productRoute)
app.use("/api", categoryRoute)
app.use("/api/address", addressRoute)
app.use("/api/order", orderRouter)


app.use((req, res) => {
    res.status(404).json({ message: "Route not found." })
})


app.use((error, req, res, next) => {
    console.log(error.stack)
    res.status(400).json({ message: "Something went wrong." })
})

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
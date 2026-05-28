import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import { app, server } from "./socket/socket.js"

dotenv.config()
const port = process.env.PORT || 5000

app.use(cors({
    origin: "https://chitchat-1u0p.onrender.com",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)

app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: "Image is too large! Please upload under 10MB." })
    }
    res.status(500).json({ message: err.message || "Internal Server Error" })
})

server.listen(port, () => {
    connectDb()
    console.log("server started on port " + port)
})

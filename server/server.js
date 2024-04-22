import express from "express";
import mongoose from "mongoose";
import 'dotenv/config'

const server = express();
let PORT = 3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
server.use(express.json())
mongoose.connect(process.env.DB_LOCATION, { autoIndex: true })


server.post('/signup', (req, res) => {
    const { fullname, email, password } = req.body;
    if (fullname.length < 3) {
        res.status(403).json({ "error": "Fullname atleast must be 3 letter long" })
    }
    if (!email.length) {
        return res.status(403).json({ "error": "Enter email please" })
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Email is invalid" })
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "Password should be atleast 6 character long and should contain atleast one uppercase, one lowercase and one digit" })
    }
    return res.status(200).json({ "status": "Okey" })
})

server.listen(PORT, () => {
    console.log(`server is listining on port -> ${PORT}`)
})
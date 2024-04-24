import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import User from "./Schema/User.js";
import { nanoid } from "nanoid"
import jwt from "jsonwebtoken"
import cors from "cors"

const server = express();
server.use(cors())
let PORT = 3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
server.use(express.json());
mongoose.connect(process.env.DB_LOCATION, { autoIndex: true });



const formatDatattoSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)
    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname

    }
}
const generateUsername = async (email) => {
    let username = email.split('@')[0];
    let isUsernameNotUnique = await User.exists({ "personal_info.username": username }).then((result) => result)
    if (isUsernameNotUnique) {
        username = username + nanoid(5)
    }
    return username;

}

server.post("/signup", (req, res) => {
    const { fullname, email, password } = req.body;
    if (fullname.length < 3) {
        res.status(403).json({ error: "Fullname atleast must be 3 letter long" });
    }
    if (!email.length) {
        return res.status(403).json({ error: "Enter email please" });
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ error: "Email is invalid" });
    }
    if (!passwordRegex.test(password)) {
        return res
            .status(403)
            .json({
                error:
                    "Password should be atleast 6 character long and should contain atleast one uppercase, one lowercase and one digit",
            });
    }
    bcrypt.hash(password, 10, async (err, hashed_password) => {
        let username = await generateUsername(email);
        let user = new User({
            personal_info: {
                fullname,
                email,
                password: hashed_password,
                username
            },
        });
        user.save().then((u) => {
            return res.status(200).json(formatDatattoSend(u));
        }).catch((err) => {
            if (err.code == 11000) {
                return res.status(403).json({ "error": "Email already exists" })
            }
            return res.status(500).json({ error: err.message });
        });
    });
});
server.post("/signin", async (req, res) => {
    let { email, password } = req.body;
    await User.findOne({ "personal_info.email": email })
        .then((user) => {
            if (!user) {
                return res.status(403).json({ "error": "Email not found" })
            }
            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(403).json({ "error": "Error occured while login please try again" })
                }
                if (!result) {
                    return res.status(403).json({ "error": "Incorrect password" })
                } else {
                    return res.status(200).json(formatDatattoSend(user))
                }
            })
        }).catch(err => {
            return res.status(500).json({ "error": err.message });
        })



})

server.listen(PORT, () => {
    console.log(`server is listining on port -> ${PORT}`);
});

import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import User from "./Schema/User.js";
import { nanoid } from "nanoid"
import jwt from "jsonwebtoken"
import cors from "cors"
import aws from "aws-sdk"
// import admin from 'firebase-admin';
// import { getAuth } from 'firebase/auth';
// import serviceAccountKey from "./react-js-blog-website-yt-ae07c-firebase-adminsdk-2kmhl-3812b71491.json"  assert {type: 'json'};

const server = express();

let PORT = 3000;

server.use(cors())
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccountKey)
// });
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
server.use(express.json());
mongoose.connect(process.env.DB_LOCATION, { autoIndex: true });

const s3 = new aws.S3({
    region: 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const generateUploadURL = async () => {
    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
    console.log(imageName)
    return await s3.getSignedUrlPromise('putObject', {
        Bucket: 'blogging-website-yt04',
        Key: imageName,
        Expires: 1000,
        ContentType: "image/jpeg"
    })
}
// const generateUploadURL = async () => {
//     try {
//         const date = new Date();
//         const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
//         console.log(imageName);
//         const url = await s3.getSignedUrlPromise('putObject', {
//             Bucket: 'blogging-website-yt04',
//             Key: imageName,
//             Expires: 1000,
//             ContentType: "image/jpeg"
//         });
//         return url;
//     } catch (err) {
//         throw new Error(err.message);
//     }
// };


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


server.get('/get-upload-url', (req, res) => {
    generateUploadURL()
        .then(url = res.status(200).json({ uploadURL: url }))
        .catch(err => {
            console.log(err.message);
            return res.status(500).json({ error: err.message })
        })
})
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

// server.post('/google-auth', async (req, res) => {
//     const { access_token } = req.body;
//     getAuth.verifyIdToken(access_token)
//         .then(async (decodeUser) => {
//             let { email, name, picture } = decodeUser;
//             picture = picture.replace("s96-c", "s384-c");

//             let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth")
//                 .then((u) => {
//                     return u || null
//                 })
//                 .catch(err => {
//                     return res.status(500).json({ "error": err.message })
//                 })
//             if (user) {
//                 if (!user.google_auth) {
//                     return res.status(403).json({ "error": "This email was signed up without google. Please log in with password to access the account" })
//                 }

//             } else {
//                 let username = await generateUsername(email);
//                 user = new User({
//                     personal_info: { fullname: name, email, profile_img: picture, username }, google_auth: true
//                 })
//                 await user.save()
//                     .then((u) => {
//                         user = u;
//                     })
//                     .catch(err => {
//                         return res.status(500).json({ "error": err.message })
//                     })
//             }
//             return res.status(200).json(formatDatattoSend(user))
//         })
//         .catch(err => {
//             return res.status(500).json({ "error": "Failed to authenticate you with google.Try with some other google account" })
//         })


// })
server.listen(PORT, () => {
    console.log(`server is listining on port -> ${PORT}`);
});

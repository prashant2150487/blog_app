// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    // apiKey: `${process.env.REACT_APP_API_KEY}`,
    // authDomain: `${process.env.REACT_APP_AUTH_DOMAIN}`,
    apiKey: "AIzaSyDolDMtqyYnLnqJj__TIMk9Usuh6SxLyog",
    authDomain: "react-js-blog-website-yt-ae07c.firebaseapp.com",
    projectId: "react-js-blog-website-yt-ae07c",
    storageBucket: "react-js-blog-website-yt-ae07c.appspot.com",
    messagingSenderId: "809511641285",
    appId: "1:809511641285:web:d82afc1f960ebe39b710ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth();
export const authWithGoogle = async () => {
    let user = null;
    await signInWithPopup(auth, provider)
        .then((result) => {
            user = result.user
        })
        .catch((err) => {
            console.log(err)
        })
    return user;
}
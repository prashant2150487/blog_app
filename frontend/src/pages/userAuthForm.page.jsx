import React, { useRef } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import toast, { Toaster } from "react-hot-toast";

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const UserAuthForm = ({ type }) => {
  const authForm = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    let form = new FormData(authForm.current);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    console.log(formData);
    let { fullname, email, password } = formData;
    if (fullname) {
      if (fullname.length < 3) {
        toast.error("Fullname atleast must be 3 letter long");
      }
    }

    if (!email.length) {
      toast.error("Enter email please");
    }
    if (!emailRegex.test(email)) {
      toast.error("Email is invalid");
    }
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password should be atleast 6 character long and should contain atleast one uppercase, one lowercase and one digit"
      );
    }
  };

  return (
    <AnimationWrapper keyValue={type}>
      <section className=" flex items-center justify-center h-cover">
        <Toaster />
        <form ref={authForm} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "wellcome back" : "Join us today"}
          </h1>
          {type == "sign-up" ? (
            <>
              <InputBox
                name="fullname"
                type="text"
                placeholder="Full Name"
                icon="fi-rr-user"
              />
              <InputBox
                name="email"
                type="email"
                placeholder="Email"
                icon="fi-rr-envelope"
              />
              <InputBox
                name="password"
                type="password"
                placeholder="Password"
                icon="fi-rr-key"
              />
            </>
          ) : (
            <>
              <InputBox
                name="email"
                type="email"
                placeholder="Email"
                icon="fi-rr-envelope"
              />
              <InputBox
                name="password"
                type="password"
                placeholder="Password"
                icon="fi-rr-key"
              />
            </>
          )}
          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>
          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>
          <button className="btn-dark flex items-center gap-4 justify-center w-[90%] center ">
            <img src={googleIcon} className="w-5" />
            continue with google
          </button>
          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have account ?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;

import React, { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../imgs/logo.png";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";
const Navbar = () => {
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const { userAuth, userAuth: { access_token, profile_img }, setUserAuth } = useContext(UserContext);
    const [userNavPanel, setUserNavPanel] = useState(false);
    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false)

        },200)
    }

    return (
        <>
            <nav className="navbar ">
                <Link className="w-10 flex-none">
                    <img to="/" src={logo} alt="logo" className="w-full" />
                </Link>
                <div
                    className={`absolute w-full bg-white left-0 top-full mt-0.5 border-grey py-4 px-[4vw] md-border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show first-line:" + ${searchBoxVisibility ? "show" : "hide"
                        }`}
                >
                    <input
                        placeholder="search"
                        type="text"
                        className="w-full bg-grey p-4 pl-6 pr-[12%] rounded-full placeholder:text-dark-grey md:pl-10 "
                    />
                    <i className="fi fi-rr-search absolute right-[10%] top-1/2 -translate-y-1/2"></i>
                </div>
                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button
                        className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
                    >
                        <i className="fi fi-rr-search text-l" />
                    </button>
                    {access_token ? (
                        <>
                            <Link to="/dashboard/notification">
                                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-grey  hover:bg-black/20">
                                    <i className="fi fi-rr-bell text-1xl" />
                                </button>
                            </Link>
                            <div className="relative" onClick={() => setUserNavPanel(!userNavPanel)} onBlur={handleBlur}>
                                <button className="w-10 h-10 mt-1" >
                                    <img src={profile_img} className="w-full h-full object-cover rounded-full" alt='img' />
                                </button>
                                {
                                    userNavPanel && <UserNavigationPanel />
                                }

                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/editer" className="hidden md:flex gap-2 link">
                                {" "}
                                <i className="fi fi-rr-file-edit" /> <p>Write</p>
                            </Link>
                            <Link className="btn-dark py-2" to="/signin">
                                Sign In
                            </Link>
                            <Link className="btn-dark py-2 hidden md:block" to="/signup">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
            <Outlet />
        </>
    );
};

export default Navbar;

import React, { useState } from "react";

const InputBox = ({ name, type, id, value, placeholder, icon }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    function handleClick() {
        setPasswordVisible(!passwordVisible)
        console.log(passwordVisible)
    }
    return (
        <div className="relative w-full mb-4">
            <input
                type={type == 'password' ? passwordVisible ? "text" : "password" : type}
                name={name}
                id={id}
                defaultValue={value}
                placeholder={placeholder}
                className="input-box"
            />
            <i className={`fi ${icon} input-icon`} />
            {type === "password" && (
                <i
                    className={`${passwordVisible ? 'fi fi-rr-eye' : 'fi fi-rr-eye-crossed'} input-icon left-auto right-5 cursor-pointer`}
                    onClick={handleClick}
                />
            )}
        </div>
    );
};

export default InputBox;

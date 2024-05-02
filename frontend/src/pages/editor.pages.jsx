import React, { createContext, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import { UserContext } from "../App";

export const EditorContext = createContext({});

const blogStructure = {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: { personal_info: {} },
};
const Editor = () => {
    const [blog, setBlog] = useState(blogStructure);
    const [editorState, setEditorState] = useState("editor");
    const {
        userAuth: { access_token },
    } = useContext(UserContext);
    return (
        <EditorContext.Provider
            value={{ blog, setBlog, editorState, setEditorState }}
        >
            {access_token === null ? (
                <Navigate to="/signin" />
            ) : editorState == "editor" ? (
                <BlogEditor />
            ) : (
                <PublishForm />
            )}
        </EditorContext.Provider>
    );
};

export default Editor;

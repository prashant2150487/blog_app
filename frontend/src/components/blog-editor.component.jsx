import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import logo from "../imgs/logo.png"
import AnimationWrapper from '../common/page-animation'
import defaultBanner from "../imgs/blog banner.png"
import { uploadImage } from '../common/aws'
import toast, { Toaster } from 'react-hot-toast'
import { KeyCode } from 'monaco-editor'
function BlogEditor() {
    let blogBannerRef = useRef();
    const handleBannerUpload = (e) => {
        let img = e.target.files[0];
        if (img) {
            let loadingToast = toast.loading("Uploading...")
            uploadImage(img)
                .then((url) => {
                    if (url) {
                        toast.dismiss(loadingToast);
                        toast.success("Uploaded ");
                        blogBannerRef.current.src = url
                    }
                }).catch(err => {
                    toast.dismiss(loadingToast);
                    return toast.error(err);
                })
        }
        console.log(img)
    }
    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) { // Fixed typo here: should be e.keyCode instead of e.KeyCodeeyCode
            e.preventDefault();
        }
    };

    const handleChange = (e) => { // Added 'e' as a parameter to the handleChange function to access the event object
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";
    };

    return (
        <>
            <nav className='navbar'>
                <Link to="/" className='flex-none w-10'>
                    <img src={logo} alt='logos' />
                </Link>
                <p className='max-md:hidden text-black line-clamp-1 w-full'>New Blog</p>
                <div className='ml-auto gap-4 flex' >
                    <button className='btn-dark py-2'>Publish</button>
                    <button className='btn-light py-2'>Save draft</button>
                </div>
            </nav>
            <Toaster />
            <AnimationWrapper>
                <section>
                    <div className='mx-auto max-w-[900px] w-full'>
                        <div className='relative border-4 border-grey bg-white aspect-video hover:opacity-80'>
                            <label htmlFor='uploadBanner'>
                                <img src={defaultBanner} className='z-20' ref={blogBannerRef} alt="Banner" />
                                <input type='file' id='uploadBanner' accept='.png,.jpg,.jpeg' hidden onChange={handleBannerUpload} />
                            </label>
                        </div>
                    </div>
                    <textarea placeholder='Blog Title' className='text-4xl w-full font-medium h-20 outline-none mt-10 resize-none placeholder:opacity-40' onKeyDown={handleTitleKeyDown} onChange={handleChange}>

                    </textarea>
                </section>

            </AnimationWrapper>
        </>

    )
}

export default BlogEditor
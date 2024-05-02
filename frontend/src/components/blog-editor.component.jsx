import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import logo from "../imgs/logo.png"
import AnimationWrapper from '../common/page-animation'
import defaultBanner from "../imgs/blog banner.png"
import { uploadImage } from '../common/aws'
import toast, { Toaster } from 'react-hot-toast'
import { EditorContext } from '../pages/editor.pages'
function BlogEditor() {
    const { blog, blog: { title, banner }, setBlog } = useContext(EditorContext);
    console.log(blog.title, banner)
    const handleBannerUpload = (e) => {
        let img = e.target.files[0];
        if (img) {
            let loadingToast = toast.loading("Uploading...")
            uploadImage(img)
                .then((url) => {
                    if (url) {
                        toast.dismiss(loadingToast);
                        toast.success("Uploaded");
                        blogBannerRef.current.src = url
                        setBlog({ ...blog, banner: url })


                    }
                }).catch(err => {
                    toast.dismiss(loadingToast);
                    return toast.error(err);
                })
        }
    }


    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";
        setBlog({ ...blog, title: input.value });
    }
    const handleError = (e) => {
        let img = e.target;
        img.src = defaultBanner
    }
    return (
        <>
            <nav className='navbar'>
                <Link to="/" className='flex-none w-10'>
                    <img src={logo} alt='logos' />
                </Link>
                <p className='max-md:hidden text-black line-clamp-1 w-full'>
                    {title.length ? title : "New Blog"}
                </p>
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
                                <img src={banner} className='z-20' alt="Banner" onError={handleError} />
                                <input type='file' id='uploadBanner' accept='.png,.jpg,.jpeg' hidden onChange={handleBannerUpload} />
                            </label>
                        </div>
                    </div>
                    <textarea placeholder='Blog Title' className='text-4xl w-full font-medium h-20 outline-none mt-10 resize-none placeholder:opacity-40' onKeyDown={handleTitleKeyDown} onChange={handleTitleChange}>

                    </textarea>
                    <hr className="w-full opacity-10 my-5" />
                    <div id="textEdiotor"></div>
                </section>

            </AnimationWrapper>
        </>

    )
}

export default BlogEditor
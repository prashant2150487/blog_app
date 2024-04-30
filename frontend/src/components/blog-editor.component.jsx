import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import logo from "../imgs/logo.png"
import AnimationWrapper from '../common/page-animation'
import defaultBanner from "../imgs/blog banner.png"
import { uploadImage } from '../common/aws'
import toast, { Toaster } from 'react-hot-toast'
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
                                {/* <img src={defaultBanner} className='z-20' ref={blogBannerRef} />
                                <input type='file' id='uploadBanner' accept='.png .jpg .jpeg' hidden onChange={handleBannerUpload} /> */}
                            </label>
                        </div>
                    </div>
                </section>
            </AnimationWrapper>
        </>

    )
}

export default BlogEditor
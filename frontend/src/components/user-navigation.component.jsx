import React, { useContext } from 'react'
import AnimationWrapper from '../common/page-animation'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import { logOutUser, removeFromSession } from '../common/session'

const UserNavigationPanel = () => {

    const { userAuth: { username }, setUserAuth } = useContext(UserContext);
    const signOutUser = async () => {
        removeFromSession('user');
        await setUserAuth({
            access_token: null
        })
    }
    return (
        <AnimationWrapper className="absolute right-0 z-50" transition={{ duration: 1.0 }}>
            <div className='absolute right-0 w-60 overflow-hidden duration-200 boder mt-5 bg-white shadow'>
                <Link to='/editor' className='flex gap-2 link md:hidden'>
                    <i className='fi fi-rr-file-edit' />
                    <p>Write</p>
                </Link>
                <Link to={`/user/${username}`} className='link pl-8 py-4'>
                    Profile
                </Link>
                <Link to="/dashboard/blogs" className='link pl-8 py-4'>
                    Dashboard
                </Link>
                <Link to="/settings/edit-profile" className='link pl-8 py-4'>
                    Settings
                </Link>
                <span className="absolute border-t border-grey w-[100%]"></span>
                <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4" onClick={signOutUser}>
                    <h1 className='font-bold text-xl mb-1'>Sign Out</h1>
                    <p className='text-dark-grey'>@{username}</p>
                </button>


            </div>
        </AnimationWrapper>
    )
}

export default UserNavigationPanel
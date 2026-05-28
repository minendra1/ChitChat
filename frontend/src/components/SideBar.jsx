import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { MdDarkMode, MdLightMode } from "react-icons/md"; // Imported Dark Mode icons
import { serverUrl } from '../main';
import axios from 'axios';
import { setOtherUsers, setSearchData, setSelectedUser, setUserData, toggleDarkMode } from '../redux/userSlice'; // Imported toggleDarkMode
import { useNavigate } from 'react-router-dom';

function SideBar() {
    // Extracted darkMode from Redux state
    let { userData, otherUsers, selectedUser, onlineUsers, searchData, darkMode } = useSelector(state => state.user)
    let [search, setSearch] = useState(false)
    let [input, setInput] = useState("")
    let dispatch = useDispatch()
    let navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            dispatch(setOtherUsers(null))
            navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }

    const handlesearch = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, { withCredentials: true })
            dispatch(setSearchData(result.data))
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (input) {
            handlesearch()
        }
    }, [input])

    return (
        // Added dark:bg-gray-900 to main wrapper
        <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-slate-200 dark:bg-gray-900 relative ${!selectedUser ? "block" : "hidden"}`}>

            {/* --- NEW: Dark Mode Toggle Button --- */}
            <div className='w-[40px] h-[40px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-[#20c7ff] shadow-gray-500 text-white cursor-pointer shadow-lg fixed top-[10px] left-[10px] z-50' onClick={() => dispatch(toggleDarkMode())}>
                {darkMode ? <MdLightMode className='w-[20px] h-[20px]' /> : <MdDarkMode className='w-[20px] h-[20px]' />}
            </div>

            <div className='w-[60px] h-[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-[#20c7ff] shadow-gray-500 text-white cursor-pointer shadow-lg fixed bottom-[20px] left-[10px]' onClick={handleLogOut}>
                <BiLogOutCircle className='w-[25px] h-[25px]' />
            </div>

            {/* Added dark:bg-gray-800 to search dropdown wrapper */}
            {input.length > 0 && <div className='flex absolute top-[250px] bg-[white] dark:bg-gray-800 w-full h-[500px] overflow-y-auto items-center pt-[20px] flex-col gap-[10px] z-[150] shadow-lg'>
                {searchData?.map((user) => (
                    // Added dark:hover:bg-slate-700 and dark:border-gray-600
                    <div key={user._id} className='w-[95%] h-[70px] flex items-center gap-[20px] px-[10px] hover:bg-[#78cae5] dark:hover:bg-slate-700 border-b-2 border-gray-400 dark:border-gray-600 cursor-pointer' onClick={() => {
                        dispatch(setSelectedUser(user))
                        setInput("")
                        setSearch(false)
                    }}>
                        <div className='relative rounded-full bg-white flex justify-center items-center '>
                            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center '>
                                <img src={user.image || dp} alt="" className='h-[100%]' />
                            </div>
                            {onlineUsers?.includes(user._id) &&
                                <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md'></span>}
                        </div>
                        {/* Added dark:text-gray-200 */}
                        <h1 className='text-gray-800 dark:text-gray-200 font-semibold text-[20px]'>{user.name || user.userName}</h1>
                    </div>
                ))}
            </div>}

            {/* Added dark:bg-[#1a7a9c] to top section header */}
            <div className='w-full h-[300px] bg-[#20c7ff] dark:bg-[#1a7a9c] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px] '>
                <h1 className='text-white font-bold text-[25px] mt-[20px]'>ChiChat</h1>
                <div className='w-full flex justify-between items-center'>
                    {/* Added dark:text-white */}
                    <h1 className='text-gray-800 dark:text-white font-bold text-[25px]'>Hii , {userData.name || "user"}</h1>
                    <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-gray-500 shadow-lg' onClick={() => navigate("/profile")}>
                        <img src={userData.image || dp} alt="" className='h-[100%]' />
                    </div>
                </div>
                <div className='w-full flex items-center gap-[20px] overflow-y-auto py-[18px]'>
                    {!search && <div className='w-[60px] h-[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-gray-500 cursor-pointer shadow-lg' onClick={() => setSearch(true)}>
                        <IoIosSearch className='w-[25px] h-[25px]' />
                    </div>}

                    {search &&
                        // Added dark:bg-gray-800 to search bar
                        <form className='w-full h-[60px] bg-white dark:bg-gray-800 shadow-gray-500 shadow-lg flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px] relative'>
                            <IoIosSearch className='w-[25px] h-[25px] dark:text-gray-300' />
                            {/* Added dark text and background support to input */}
                            <input type="text" placeholder='search users...' className='w-full h-full p-[10px] text-[17px] outline-none border-0 bg-transparent dark:text-white' onChange={(e) => setInput(e.target.value)} value={input} />
                            <RxCross2 className='w-[25px] h-[25px] cursor-pointer dark:text-gray-300' onClick={() => setSearch(false)} />
                        </form>
                    }
                    {!search && otherUsers?.map((user) => (
                        onlineUsers?.includes(user._id) &&
                        <div key={user._id} className='relative rounded-full shadow-gray-500 bg-white shadow-lg flex justify-center items-center mt-[10px] cursor-pointer' onClick={() => dispatch(setSelectedUser(user))}>
                            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center '>
                                <img src={user.image || dp} alt="" className='h-[100%]' />
                            </div>
                            <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md'></span>
                        </div>
                    ))}
                </div>
            </div>

            <div className='w-full h-[50%] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]'>
                {otherUsers?.map((user) => (
                   
                    <div key={user._id} className='w-[95%] h-[60px] flex items-center gap-[20px] shadow-gray-500 bg-white dark:bg-gray-800 shadow-lg rounded-full hover:bg-[#78cae5] dark:hover:bg-slate-700 cursor-pointer' onClick={() => dispatch(setSelectedUser(user))}>
                        <div className='relative rounded-full shadow-gray-500 bg-white shadow-lg flex justify-center items-center mt-[10px]'>
                            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center '>
                                <img src={user.image || dp} alt="" className='h-[100%]' />
                            </div>
                            {onlineUsers?.includes(user._id) &&
                                <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md'></span>}
                        </div>
                        {/* Added dark:text-gray-200 */}
                        <h1 className='text-gray-800 dark:text-gray-200 font-semibold text-[20px]'>{user.name || user.userName}</h1>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideBar
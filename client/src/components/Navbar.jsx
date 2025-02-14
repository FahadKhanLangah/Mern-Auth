import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
const Navbar = () => {
  const { userData, backend_url, setIsLoggedIn, setUserData } = useContext(AppContext);
  const handleLogout = async () => {
    try {
      const { data } = await axios.post(`${backend_url}/api/v1/logout-user`, {},
        { withCredentials: true });
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  return (
    <div
      className='flex items-center justify-between top-0 p-4 sm:p-6 sm:px-24 '>
      <img src={assets.logo} className='w-28 sm:w-32' />
      {userData ? <div className='w-8 h-8 flex justify-center items-center cursor-pointer relative group rounded-full bg-slate-900 text-white text-center'>
        {userData.name[0].toUpperCase()}
        <div className='absolute top-8 p-2 hidden group-hover:block rounded text-black w-40 bg-gray-300 right-0 '>
          {userData.isAcountVerfied ? null : <Link to={'email-verify'}> <h1 className='bg-gray-100 p-2 mb-2 hover:bg-slate-400 rounded'>Verify Acount</h1></Link>}
          <h1 onClick={handleLogout} className='bg-gray-100 p-2 mb-2 hover:bg-slate-400 rounded'>Logout</h1>
        </div>
      </div> : <Link to={'/login'}><button className='flex gap-2 items-center transition-all px-6 py-2 border border-gray-500 hover:bg-gray-100 rounded-full'>
        Login
        <img src={assets.arrow_icon} alt="" />
      </button></Link>}
    </div>
  )
}

export default Navbar
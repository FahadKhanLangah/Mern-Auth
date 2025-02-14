import { assets } from '../assets/assets'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const { backend_url, setIsLoggedIn, getUserData } = useContext(AppContext);
  const [userLogin, setUserLogin] = useState('login');
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (userLogin === 'login') {
        console.log(backend_url)
        const { data } = await axios.post(`${backend_url}/api/v1/login-user`, {
          email, password,
        },
          { withCredentials: true }
        )
        console.log("Data ", data);
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(`${backend_url}/api/v1/register-user`, {
          email, password, name: fullName
        },
          { withCredentials: true })
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message)
        }

      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message)
      }
      else {
        console.error("Unexpected Error:", error);
      }
    }
  }
  const navigate = useNavigate();
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br to-pink-300 from-slate-200'>
      <img onClick={() => navigate('/')} src={assets.logo} className='cursor-pointer absolute left-5 top-4 sm:left-20 w-28 sm:w-32' />
      <div className='bg-slate-900 shadow-2xl w-full py-10 sm:w-96 text-white flex flex-col justify-center items-center text-center px-5 rounded'>
        {userLogin === "register" ? (<>
          <h1 className='text-2xl font-bold mb-2'>Create Acount</h1>
          <p className='text-sm text-gray-200 opacity-70 mb-3'>Create your acount</p>
        </>) :
          (<>
            <h1 className='text-2xl font-bold mb-2'>Login</h1>
            <p className='text-sm text-gray-200 opacity-70 mb-3'>Login to Your acount</p>
          </>)

        }
        <form onSubmit={handleSubmit} className='w-full rounded-full'>
          {userLogin === "register" ? <div className='flex items-center w-full gap-3 mb-5 bg-gray-800 rounded-full px-5 py-2.5'>
            <img className='' src={assets.person_icon} alt="" />
            <input onChange={e => setFullName(e.target.value)} value={fullName} className='text-sm bg-transparent outline-none' type="text" placeholder='Full Name' />
          </div> : ''}
          <div className='flex items-center w-full gap-3 mb-5 bg-gray-800 rounded-full px-5 py-2.5'>
            <img className='' src={assets.mail_icon} alt="" />
            <input onChange={e => setEmail(e.target.value)} value={email} className='text-sm bg-transparent outline-none' type="text" placeholder='Your E-mail' />
          </div>
          <div className='flex items-center w-full gap-3 mb-5 bg-gray-800 rounded-full px-5 py-2.5'>
            <img className='' src={assets.lock_icon} alt="" />
            <input onChange={e => setPassword(e.target.value)} value={password} className='text-sm bg-transparent outline-none' type={`${showPassword ? "text" : "password"}`} placeholder={` ${userLogin === 'register' ? 'Strong Password' : 'Your Password'} `} />
          </div>
          {userLogin !== 'register' ?
            <Link to={'/reset-password'}><p className='text-start hover:underline text-indigo-500 cursor-pointer -mt-4 mb-4'>
              Forget Password ?
            </p> </Link> : <p onClick={() => setShowPassword(!showPassword)} className='text-start hover:underline text-indigo-500 cursor-pointer -mt-4 mb-4'>
              {showPassword ? "Hide Password" : "Show Password"}
            </p>}
          <button type='submit' className='bg-gradient-to-r capitalize w-full from-indigo-500 to-indigo-900 px-4 py-2.5 font-medium rounded-full mb-4'>{userLogin}</button>
        </form>
        {userLogin === 'register' ?
          <h1 className='text-xs text-center'>Already have an acount ? {' '}
            <span onClick={() => setUserLogin("login")} className='text-indigo-600 cursor-pointer'>Login Now</span>
          </h1> :
          <h1 className='text-xs text-center'>Do not have an acount ? {' '}
            <span onClick={() => setUserLogin("register")} className='text-indigo-600 cursor-pointer'>Register</span>
          </h1>
        }
      </div>
    </div>
  )
}

export default Login
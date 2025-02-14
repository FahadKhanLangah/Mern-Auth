import { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
const EmailVerify = () => {
  const { getUserData, backend_url, userData } = useContext(AppContext);
  const [otpSent, setOtpSent] = useState(false);
  const inputRefs = useRef([]);
  const handleInput = (e, i) => {
    if (e.target.value.length > 0 && i < inputRefs.current.length - 1) {
      inputRefs.current[i + 1].focus()
    }
  }
  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && e.target.value === '' && i > 0) {
      inputRefs.current[i - 1].focus()
    }
  }
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('').slice(0, inputRefs.current.length);
    pasteArray.forEach((element, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = element;
      }
    });
  }
  const navigate = useNavigate();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map(e => e?.value).filter(Boolean);
      const otp = otpArray.join('');
      if (otp.length !== 6) {
        return toast.error("Please enter a valid 6-digit OTP.");
      }
      const { data } = await axios.post(backend_url + '/api/v1/acount-verified', { otp }, {
        withCredentials: true
      });
      if (data.success) {
        getUserData();
        navigate('/');
      } else {
        toast(data.message || "Verification failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong. Please try again.")
    }
  }
  const handleReqOTP = async () => {
    try {
      const { data } = await axios.post(backend_url + '/api/v1/send-verify-otp', {}, {
        withCredentials: true
      })
      console.log(data);
      if (data.success) {
        toast(data.message)
        setOtpSent(true);
      } else {
        toast.error(data.message);
        setOtpSent(false);
      }
    } catch (error) {
      toast.error(error.response.data.message)
      setOtpSent(false);
    }
  }
  return (
    <div className="flex justify-center items-center bg-gradient-to-br to-pink-300 from-slate-200 min-h-screen">
      <Link to={'/'}><img src={assets.logo} className='w-40 sm:w-44 cursor-pointer absolute top-0 left-0 p-5' /></Link>
      <div className=' bg-slate-900 rounded-2xl text-white px-10 gap-4 flex items-center flex-col'>
        <h1 className='text-xl sm:text-2xl mt-8 font-semibold'>Acount Verification</h1>
        {
          userData.isAcountVerfied ? <>
            <p className='text-indigo-300 text-center'>Your Acount is Already verified</p>
            <button onClick={() => navigate('/')} className='w-full mb-14 py-2 bg-gradient-to-r from-indigo-500 to-indigo-800 rounded-full transition-all hover:from-indigo-800'>Go to Home</button>
          </> : <>
            {otpSent ? <><p className='text-indigo-300 text-center'>Enter 6 digit OTP sent to your Email Id.</p>
              <div className='flex gap-2 mb-4' onPaste={handlePaste}>
                {Array(6).fill(0).map((v, i) => (
                  <input onInput={(e) => handleInput(e, i)} ref={e => inputRefs.current[i] = e} maxLength={1} key={i} required
                    onKeyDown={e => handleKeyDown(e, i)} className='w-12 h-12 text-xl outline-none bg-slate-600 text-center rounded-md' type="text" />
                ))}
              </div>
              <button onClick={onSubmitHandler} className='w-full mb-14 py-2 bg-gradient-to-r from-indigo-500 to-indigo-800 rounded-full transition-all hover:from-indigo-800'>Verify</button></> : <>
              <p className='text-indigo-300 text-center'>Click the button below to request OTP</p>
              <button onClick={handleReqOTP} className='w-full mb-14 py-2 bg-gradient-to-r from-indigo-500 to-indigo-800 rounded-full transition-all hover:from-indigo-800'>Request OTP</button>
            </>}
          </>
        }
      </div>
    </div>
  )
}

export default EmailVerify
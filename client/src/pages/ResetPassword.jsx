import { useContext, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../assets/assets';

const ResetPassword = () => {
  const { backend_url } = useContext(AppContext);

  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      if (!email) {
        return toast.error("Please Enter your Email");
      }
      if (!password || !email) {
        return toast.error("Please Enter a new Password also");
      }
      const { data } = await axios.post(backend_url + '/api/v1/verify-reset-otp', { otp, email, newPassword: password }, {
        withCredentials: true
      });
      if (data.success) {
        navigate('/login');
      } else {
        toast(data.message || "Verification failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong. Please try again.")
    }
  }
  const handleReqOTP = async () => {
    if (!email) {
      return toast.info("Enter Your email to request OTP")
    }
    try {
      const { data } = await axios.post(backend_url + '/api/v1/send-reset-otp', {
        email
      }, {
        withCredentials: true
      })
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
        <h1 className='text-xl sm:text-2xl mt-8 font-semibold'>Reset Password</h1><>
          {otpSent ? <><p className='text-indigo-300 text-center'>Enter 6 digit OTP sent to your Email Id.</p>
            <div className='flex gap-2 mb-4' onPaste={handlePaste}>
              {Array(6).fill(0).map((v, i) => (
                <input onInput={(e) => handleInput(e, i)} ref={e => inputRefs.current[i] = e} maxLength={1} key={i} required
                  onKeyDown={e => handleKeyDown(e, i)} className='w-12 h-12 text-xl outline-none bg-slate-600 text-center rounded-md' type="text" />
              ))}
            </div>
            <div className='flex items-center w-full gap-3 mb-3 bg-gray-800 rounded-full px-5 py-2.5'>
              <img className='' src={assets.mail_icon} alt="" />
              <input onChange={e => setEmail(e.target.value)} value={email} className='text-sm bg-transparent outline-none' type="text" placeholder='Your E-mail' />
            </div>
            <div className='flex items-center w-full gap-3 mb-3 bg-gray-800 rounded-full px-5 py-2.5'>
              <img className='' src={assets.lock_icon} alt="" />
              <input onChange={e => setPassword(e.target.value)} value={password} className='text-sm bg-transparent outline-none' type="text" placeholder="New Password" />
            </div>
            <button onClick={onSubmitHandler} className='w-full mb-10 py-2 bg-gradient-to-r from-indigo-500 to-indigo-800 rounded-full transition-all hover:from-indigo-800'>Verify and Reset</button>
            <button onClick={() => setOtpSent(false)} className='w-full mb-10 py-2 bg-orange-600 font-bold rounded-full transition-all hover:bg-indigo-800'>Did not recieve OTP</button>
          </>

            : <>
              <p className='text-indigo-300 text-center'>Enter Your Email and request the OTP</p>
              <div className='flex items-center w-full gap-3 mb-3 bg-gray-800 rounded-full px-5 py-2.5'>
                <img className='' src={assets.mail_icon} alt="" />
                <input onChange={e => setEmail(e.target.value)} value={email} className='text-sm bg-transparent outline-none' type="text" placeholder='Your E-mail' />
              </div>
              <button onClick={handleReqOTP} className='w-full mb-10 py-2 bg-gradient-to-r from-indigo-500 to-indigo-800 rounded-full transition-all hover:from-indigo-800'>Request OTP</button>
              <button onClick={() => setOtpSent(true)} className='w-full mb-14 py-2 bg-gradient-to-r from-green-500 to-green-800 font-bold text-lg rounded-full transition-all hover:from-indigo-800'>Have OTP ?</button>
            </>}
        </>
      </div>
    </div>
  )
}

export default ResetPassword
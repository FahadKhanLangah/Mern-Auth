import { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
const Header = () => {
  const { userData } = useContext(AppContext);
  return (
    <div className='flex justify-center text-center items-center flex-col'>
      <img className='w-36 h-36' src={assets.header_img} alt="" />
      <h1 className='flex items-center text-2xl gap-2 mb-2'>Hey {userData ? userData.name : 'Developer'} <img className='w-8' src={assets.hand_wave} alt="" /></h1>
      <h1 className='text-4xl font-semibold mb-4'>Welcome to our App</h1>
      <p className='max-w-md mb-6'>Let`s start with quick overview of product and we will have you running in no time</p>
      <a href="https://fahad-khan-portfolio.vercel.app/" target='_blank'><button className='transition-all px-6 py-2 border border-gray-500 hover:bg-gray-100 rounded-full'>Get Started
      </button></a>
    </div>
  )
}

export default Header
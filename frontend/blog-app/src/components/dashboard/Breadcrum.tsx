import Arrow from '@/assets/arrow'
import React from 'react'

type Prop = {
    Page: string
}

const Breadcrum = ({Page}: Prop) => {
  return (
    <div className='flex items-center text-base gap-2'>
        <p className='text-gray-200'>Dashboard</p>
        <Arrow className='w-5 h-4 text-gray-100'/>
        <p>{Page}</p>
    </div>
  )
}

export default Breadcrum
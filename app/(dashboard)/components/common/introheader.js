import React from 'react'

const Header = ({title}) => {
    // const i18n = useI18n()
  return (
    <div className='mb-8 p-5 rounded bg-white'>
       <h1 className='lg:text-4xl sm:text-2xl text-xl font-sans text-textColor font-medium'>{title}</h1>
    </div>
  )
}

export default Header

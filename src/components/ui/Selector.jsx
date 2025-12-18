import React from 'react'

const Selector = (props) => {
  return (
    <div className='px-3 border-[#6200B3] hover:text-white border-[1.9px] bg-transparent inline-flex whitespace-nowrap items-center justify-center text-sm py-[5px] ml-3 mt-3 rounded-xl cursor-pointer hover:bg-[#6200B3]'>
        {props.label}
    </div>
  )
}

export default Selector
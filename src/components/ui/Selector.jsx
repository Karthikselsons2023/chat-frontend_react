import React from 'react'
import { useChatStore } from '../../store/useChatStore'

const Selector = (props) => {
  const {isAllUsersRecentSelected} = useChatStore();
  return (
    <div className={`px-3 border-[#6200B3] hover:text-white border-[1.9px] inline-flex whitespace-nowrap items-center justify-center text-sm py-[5px] ml-3 mt-3 rounded-xl cursor-pointer hover:bg-[#6200B3] ${isAllUsersRecentSelected == `all` && props.label === `All` ? `bg-[#6200B3] text-white` : ``} ${isAllUsersRecentSelected == `group` && props.label === `Groups` ? `bg-[#6200B3] text-white` : ``}`}>
        {props.label}
    </div>
  )
}

export default Selector
import React from 'react'
import { X,Forward  } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
const ForwardingMessageBottomBar = () => {
  const { setIsSelecting, selectedChatIds,clearSelectedChatIds, handleForwardMessages} = useChatStore();
  return (
    <div className='h-18 items-center flex px-5 text-black inter-large'>
        <div className='flex gap-4 flex-row items-center'>
            <button className='cursor-pointer' onClick={() => {
                clearSelectedChatIds();
                setIsSelecting(false);
            }}><X size={20} className='text-[#6200B3]'/></button>
            <h2>{`${selectedChatIds.length} selected`}</h2>
        </div>
        <button onClick={()=>{handleForwardMessages()}} disabled={selectedChatIds.length === 0} className='flex gap-2 p-1 text-white rounded-full hover:bg-[#420078] disabled:bg-[#a7a7a7] disabled:cursor-not-allowed text-sm px-5 py-2 items-center cursor-pointer ml-auto bg-[#6200B3]'>
            <Forward size={20}/>
            <h2>Forward</h2>
        </button>
    </div>
  )
}

export default ForwardingMessageBottomBar
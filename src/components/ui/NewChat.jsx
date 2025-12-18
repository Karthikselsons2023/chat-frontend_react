import React from 'react'
import { PencilLine } from 'lucide-react';

const NewChat = () => {
  
  return (
    <div className={`mycolorbg absolute sm:top-[-70px] top-[-90px] right-0 p-2 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out m-4`}>
      <PencilLine size={20} className='text-white size-10 sm:size-6'/>
    </div>
  );
}

export default NewChat


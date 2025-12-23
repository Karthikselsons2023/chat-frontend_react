import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import GroupArea from './ui/Groups/GroupArea';
import GroupHeader from './ui/Groups/GroupHeader';
import GroupMessageInput from './ui/Groups/GroupMessageInput';



const GroupWindow = () => {
  const { selectedGroupId, setGroupInfo } = useChatStore();

  useEffect(() => {
    if (selectedGroupId) {
      setGroupInfo();
    }
  }, [selectedGroupId]);

  return (
    <div className="flex flex-col h-full w-full bg-[#ECECEC]">
      <div className="shrink-0 bg-white">
        <GroupHeader />
      </div>

      <div className="flex-1 overflow-y-auto">
        <GroupArea />
      </div>

      <div className="shrink-0 bg-white">
        <GroupMessageInput />
      </div>
    </div>
  );
};

export default GroupWindow;

import React, { useState } from 'react';
import { sidebarOptions, SidebarOptions } from './siderbarOptions'
import {signOut} from "next-auth/react";
import ProfileHeader from '../ui/profileHeader';

interface SidebarProps {
  onOptionSelect: (option: SidebarOptions) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOptionSelect })  => {
    const [selectedOption, setSelectedOption] = useState<SidebarOptions | null>(SidebarOptions.AllBoards);
  
    const handleOptionSelect = (option: SidebarOptions) => {
      onOptionSelect(option)
      setSelectedOption(option);
    };
  
    return (
      <div className="bg-white p-7 w-1/5 h-full flex justify-between flex-col items-start">
        <div className='w-full'>
          <h1 onClick={() => signOut()} className="text-blue-500 text-4xl tracking-[2px] font-bold mt-7 mb-6">Drawyy</h1>
        {sidebarOptions.map((opt) => (
          <div
            key={opt.title}
            onClick={() => handleOptionSelect(opt.title)}
            className={`flex items-center gap-3 mb-5 cursor-pointer w-full p-2 rounded-lg transition-all duration-200 
              ${selectedOption === opt.title ? "bg-[#f3f4f6]" : "hover:bg-[#f3f4f6]"} hover:scale-105 active:scale-95`}
          >
            <div
              className="flex items-center justify-center w-9 h-9 rounded-full text-white"
              style={{ backgroundColor: opt.bg_color }}
            >
              {React.createElement(opt.icon, { size: "1.3em" })}
            </div>
            <p className="text-black tracking-wider">{opt.title}</p>
          </div>
        ))}
      </div>
      </div>
    );
  };
  
  export default Sidebar;
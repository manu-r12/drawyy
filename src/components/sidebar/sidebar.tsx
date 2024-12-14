import React, { useState } from "react";
import { sidebarOptions, SidebarOptions } from "./siderbarOptions";
import { signOut } from "next-auth/react";

interface SidebarProps {
  onOptionSelect: (option: SidebarOptions) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOptionSelect }) => {
  const [selectedOption, setSelectedOption] = useState<SidebarOptions | null>(
    SidebarOptions.AllBoards
  );

  const handleOptionSelect = (option: SidebarOptions) => {
    onOptionSelect(option);
    setSelectedOption(option);
  };

  return (
    <div className="bg-white py-3 px-7 w-1/5 h-screen flex flex-col justify-between items-start overflow-hidden">
      {/* Sidebar Content */}
      <div className="w-full">
        <h1
          onClick={() => signOut()}
          className="text-4xl tracking-[2px] font-bold mt-7 mb-6 bg-gradient-to-r from-[#03001e] via-[#7303c0] to-[#ec38bc] text-transparent bg-clip-text cursor-pointer"
        >
          Drawyy
        </h1>
        {sidebarOptions.map((opt) => (
          <div
            key={opt.title}
            onClick={() => handleOptionSelect(opt.title)}
            className={`flex items-center gap-3 mb-5 cursor-pointer w-full p-2 rounded-lg transition-all duration-200 
              ${
                selectedOption === opt.title
                  ? "bg-[#f3f4f6]"
                  : "hover:bg-violet-100"
              } hover:scale-105 active:scale-95`}
          >
            <div
              className="flex items-center justify-center w-9 h-9 rounded-full text-white"
              style={{ backgroundColor: opt.bg_color }}
            >
              {React.createElement(opt.icon, { size: "1.3em" })}
            </div>
            <p className="text-blackr">{opt.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

"use client";
import React, {useState} from 'react';
import {SidebarOptions} from '../sidebar/siderbarOptions';
import Sidebar from '../sidebar/sidebar';
import ContentView from '../contentView/contentView';


const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState<SidebarOptions | null>(null);

  const handleOptionSelect = (option: SidebarOptions) => {
    setSelectedOption(option);
  };

  return (
    <section className="flex h-screen">
      {/* Sidebar Menu */}
      <Sidebar onOptionSelect={handleOptionSelect} />

      {/* Content View */}
      <div className="flex-1 p-2 text-black bg-white border-l-[1px] border-solid border-[#e4e7eb]">
          {selectedOption ? <ContentView option={selectedOption}/> : <ContentView option={SidebarOptions.AllBoards}/>}
      </div>
    </section>
  );
};

export default Dashboard;

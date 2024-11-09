import React, { ReactElement, useState } from "react";
import BigTitle from "../ui/bigTitle";
import { FiGrid, FiList, FiSearch } from "react-icons/fi";
import { HiMiniDocumentPlus } from "react-icons/hi2";
import ListCell from "../ui/boardCell";
import Card from "../ui/boardCards";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';



interface IconButtonProps {
  icon: ReactElement;
  onClick?: () => void;
}

function IconButton({ icon, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2 rounded-full bg-color_gray hover:bg-appleBlue focus:outline-none transition-transform duration-150 transform active:scale-75"
    >
      {icon}
    </button>
  );
}

const BoardsView = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const router = useRouter()

  const createNewBoard = () =>{
    const newId = uuidv4();
    router.push(`/canvas/${newId}`);
  }

  const cardsData = [
    { title: "AI Board", description: "Explore AI models and projects." },
    { title: "Collab", description: "Collaborate on group tasks." },
    { title: "Favorites", description: "Your favorite boards." },
    { title: "Recent Projects", description: "Check out your recent projects." },
    // Add more cards as needed
  ];

  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  return (
    <div className="w-full m-0">
      {/* Top Menu */}
      <div className="w-full flex justify-end items-center space-x-4">
        {/* Create New File Icon */}
        <IconButton onClick={createNewBoard} icon={<HiMiniDocumentPlus size={20} />} />

        {/* Change to Grid View Icon */}
        <IconButton
          icon={<FiGrid size={20} />}
          onClick={() => handleViewChange("grid")}
        />

        {/* Change to List View Icon */}
        <IconButton
          icon={<FiList size={20} />}
          onClick={() => handleViewChange("list")}
        />

        {/* Search Bar */}
        <div className="flex items-center bg-gray-200 p-2 w-[300px] rounded-full">
          <FiSearch className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Title of view */}
      <BigTitle text="All Boards" />

      {/* Render based on view mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mt-3">
          {cardsData.map((card, index) => (
            <Card key={index} title={card.title} description={card.description} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-5">
          {cardsData.map((card, index) => (
            <ListCell key={index} title={card.title} description={card.description} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardsView;

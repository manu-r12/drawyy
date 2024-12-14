import { ReactElement } from "react";

interface IconButtonProps {
    icon: ReactElement;
    onClick?: () => void;
  }
  
export default function IconButton({ icon, onClick }: IconButtonProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="p-2 rounded-full bg-[#f3f4f6] hover:bg-violet-500 hover:text-white focus:outline-none transition-transform duration-150 transform active:scale-75"
      >
        {icon}
      </button>
    );
  }
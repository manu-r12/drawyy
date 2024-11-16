import React, { useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FiSettings, FiLogOut } from "react-icons/fi";
import CircleImage from "@/components/ui/circleImage";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ContextMenuProps {
  isVisible: boolean;
  onOptionSelect: (option: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ isVisible, onOptionSelect }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute font-semibold right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md">
      <div
        className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
        onClick={() => onOptionSelect("settings")}
      >
        <FiSettings className="mr-2" />
        <span>Settings</span>
      </div>
      <div
        className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
        onClick={() => onOptionSelect("logout")}
      >
        <FiLogOut className="mr-2" />
        <span>Log Out</span>
      </div>
    </div>
  );
};

const ProfileHeader: React.FC = () => {
  const { data } = useSession();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const router = useRouter();

  const handleMenuToggle = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleOptionSelect = (option: string) => {
    if (option === "logout") {
      signOut();
      router.push("/login")
    } else if (option === "settings") {
      console.log("Navigating to settings...");
    }
    setIsMenuVisible(false);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="relative">
      <div
        className="flex flex-row gap-2 items-center justify-center h-full hover:bg-[#f3f4f6] cursor-pointer px-3 py-1 rounded-2xl transition-all duration-200"
        onClick={handleMenuToggle}
      >
        <CircleImage alt="profile-image" size={60} src={data.user.image} />
        <div>
          <h1 className="font-semibold">{data.user.name}</h1>
          <p>{getGreeting()}</p>
        </div>
        <IoIosArrowDropdownCircle className="text-2xl ml-2" />
      </div>

      <ContextMenu isVisible={isMenuVisible} onOptionSelect={handleOptionSelect} />
    </div>
  );
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

export default ProfileHeader;

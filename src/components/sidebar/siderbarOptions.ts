import { HiMiniRectangleStack } from "react-icons/hi2";
import { FaStarOfDavid, FaHeart } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";

export enum SidebarOptions {
    AllBoards = "All Boards",
    AI_Board = "AI Board",
    Collab = "Collab",
    Favorites = "Favorites",
  }
  
  export const sidebarOptions = [
    {
      title: SidebarOptions.AllBoards,
      icon: HiMiniRectangleStack,
      bg_color: "#133E87"
    },
    {
      title: SidebarOptions.AI_Board,
      icon: FaStarOfDavid,
      bg_color: "#007AFF"
    },
    {
      title: SidebarOptions.Collab,
      icon: IoPeople,
      bg_color: "#FF9D3D"
    },
    {
      title: SidebarOptions.Favorites,
      icon: FaHeart,
      bg_color: "#FF77B7"
    },
  ];
  
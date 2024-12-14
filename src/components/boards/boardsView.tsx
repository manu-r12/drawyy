import React, { useEffect, useState } from "react";
import BigTitle from "../ui/bigTitle";
import { FiGrid, FiList, FiSearch } from "react-icons/fi";
import { HiMiniDocumentPlus } from "react-icons/hi2";
import ListCell from "../ui/boardCell";
import Card from "../ui/boardCards";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import ProfileHeader from "../ui/profileHeader";
import NewBoardPopup from "@/components/ui/newBoardPopUp";
import { useDispatch } from "react-redux";
import { setBoardState } from "@/store/boardState/boardsSlice";
import IconButton from "../ui/iconButton";
import { getUserData, UserData } from "@/services/userService";
import { useSession } from "next-auth/react";
import SkeletonCard from "../ui/skeletonCards";
import { motion } from "framer-motion";
import { timeAgo } from "@/utils/getTimeAge";

const BoardsView = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const createNewBoard = (title: string) => {
    if (title.length > 0) {
      const newId = uuidv4();
      dispatch(setBoardState({ id: newId, title }));
      router.push(`/canvas/${newId}`);
    }
  };

  const { data } = useSession();

  const fetchUserData = async () => {
    console.log("Started Fetching User Data with user id.....", data?.user.id);
    const res = await getUserData(data?.user.id ?? "");
    setUserData(res);
    setIsLoading(false);
    console.log("Got the user data", res);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const filteredCards = userData?.drawings.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full m-0">
      {/* Top Menu */}
      <div className="w-full mb-2 flex justify-between items-center space-x-4 relative">
        <ProfileHeader />
        <div className="flex items-center space-x-4">
          <IconButton
            onClick={() => setPopupOpen(true)}
            icon={<HiMiniDocumentPlus size={20} />}
          />
          <IconButton
            icon={<FiGrid size={20} />}
            onClick={() => setViewMode("grid")}
          />
          <IconButton
            icon={<FiList size={20} />}
            onClick={() => setViewMode("list")}
          />
          <div className="flex items-center bg-gray-200 p-2 w-[300px] rounded-full">
            <FiSearch className="text-gray-500 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-gray-700 placeholder-gray-500"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Title of view */}
      <BigTitle text="All Boards" />

      {/* Cards Animation */}
      {isLoading ? (
        <motion.div
          className="grid overflow-y-scroll grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </motion.div>
      ) : viewMode === "grid" ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredCards?.length ? (
            filteredCards.map((card, index) => (
              <motion.div
                onClick={() => router.push(`/canvas/${card.id}`)}
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card title={card.title}  thumbnail={card.thumbnail} dateCreated={timeAgo(card.createdAt)}/>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500">No matching boards found.</p>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="mt-4 flex flex-col gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredCards?.map((card, index) => (
            <ListCell
              key={index}
              title={card.title}
              thumbnail={card.thumbnail}
            />
          ))}
        </motion.div>
      )}

      {/* Popup for creating a new board */}
      <NewBoardPopup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        onSubmit={(title) => {
          setPopupOpen(false);
          createNewBoard(title);
        }}
      />
    </div>
  );
};

export default BoardsView;

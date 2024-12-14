import BoardsView from "../boards/boardsView";
import CollabBoardView from "../boards/collabBoardView";
import { SidebarOptions } from "../sidebar/siderbarOptions";
import {motion} from 'framer-motion'

const ContentView: React.FC<{ option: SidebarOptions }> = ({ option }) => {
    const contentVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };
  
    return (
      <motion.div
        key={option}  
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={contentVariants}
        transition={{ duration: 0.5 }}
        className="p-4"
      >
        {(() => {

          switch (option) {
            case SidebarOptions.AllBoards:

              return <BoardsView/>

            case SidebarOptions.AI_Board:

              return <div>AI Board Content</div>;

            case SidebarOptions.Collab:

              return <CollabBoardView/>

            case SidebarOptions.Favorites:

              return <div>Favorites Content</div>;

            default:

            return <BoardsView/>

          }

        })()}
      </motion.div>
    );
  };

export default ContentView
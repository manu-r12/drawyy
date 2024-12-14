import { useRouter } from 'next/navigation';
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';

function EditableHeading({ boardtitle, onTitleUpdate }: { boardtitle: string, onTitleUpdate: (newTitle: string) => {} }) {

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState<string>(boardtitle || 'Loading...');
  const router = useRouter()

  useEffect(() => {
    if (boardtitle) setTitle(boardtitle);
  }, [boardtitle]);


  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleBackToHome = () => {
    router.push("/")
  }

  const handleTitleUpdate = () => {
    setIsEditing(false);
    onTitleUpdate(title)
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleUpdate();
    }
  };

  return (
    <div className="p-2 absolute top-4 left-4 flex gap-5 items-center">
      <button
        onClick={handleBackToHome}
        className="p-3 flex  justify-center items-center gap-2 bg-white rounded-full shadow-md hover:bg-gray-200"
      >
        <FaHome className="h-7 w-7 text-black"/>
      </button>

      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleUpdate}
          onKeyDown={handleKeyDown}
          autoFocus
          className="text-2xl font-semibold border-2 border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-[#e4e7eb]"
        />
      ) : (
        <h1
          className="text-xl font-medium cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
         🖼️ : {title}
        </h1>
      )}
    </div>
  );
}

export default EditableHeading
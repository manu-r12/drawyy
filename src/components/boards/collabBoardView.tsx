import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Card from '../ui/boardCards';
import { timeAgo } from '@/utils/getTimeAge';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileHeader from '../ui/profileHeader';
import { FaRegClipboard, FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { createCollabSession, getUserData, UserData } from '@/services/userService';
import { useSession } from 'next-auth/react';
import { createOrGetDrawingSession } from '@/services/drawingService';
import { useDispatch } from 'react-redux';
import { setCollabSessionData } from '@/store/collabSessionState/slice';

const Collab = () => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [link, setLink] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);
  const startSoundRef = useRef<AudioBufferSourceNode | null>(null);
  const sessionSoundRef = useRef<AudioBufferSourceNode | null>(null);
  

  const dispatch = useDispatch();

  const {data: session} = useSession()

  // Initialize audio context and load sound effects
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new AudioContext();
        
        // Preload both sound effects
        const loadSound = async (path: string) => {
          const response = await fetch(path);
          const arrayBuffer = await response.arrayBuffer();
          return await audioContextRef.current!.decodeAudioData(arrayBuffer);
        };

        await Promise.all([
          loadSound('/sounds/create.wav'),
          loadSound('/sounds/start.wav')
        ]);
      } catch (error) {
        console.error('Error loading sound effects:', error);
      }
    };

    initAudio();

    // Cleanup function
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play sound effect function for creating session
  const playCreateSessionSound = () => {
    if (audioContextRef.current) {
      if (startSoundRef.current) {
        startSoundRef.current.stop();
      }

      const source = audioContextRef.current.createBufferSource();
      fetch('/sounds/create.wav')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContextRef.current?.decodeAudioData(arrayBuffer))
        .then(buffer => {
          if (buffer) {
            source.buffer = buffer;
            source.connect(audioContextRef.current!.destination);
            source.start(0);
            startSoundRef.current = source;
          }
        })
        .catch(error => console.error('Error playing create session sound:', error));
    }
  };

  // Play sound effect function for starting session
  const playStartSessionSound = () => {
    if (audioContextRef.current) {
      // Stop any existing sound before playing
      if (sessionSoundRef.current) {
        sessionSoundRef.current.stop();
      }

      const source = audioContextRef.current.createBufferSource();
      fetch('/sounds/start.wav')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContextRef.current?.decodeAudioData(arrayBuffer))
        .then(buffer => {
          if (buffer) {
            source.buffer = buffer;
            source.connect(audioContextRef.current!.destination);
            source.start(0);
            sessionSoundRef.current = source;
          }
        })
        .catch(error => console.error('Error playing start session sound:', error));
    }
  };

  const startSession = () => {
    // Play create session sound
    playCreateSessionSound();

    const uniqueId = uuidv4();
    setLink(`http://localhost:3000/collabCanvas/${uniqueId}`);
    setRoomId(uniqueId)
    setSessionStarted(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const cancelSession = () => {
    setSessionStarted(false);
    setRoomId(null)
    setName('');
  };

  const handleSetData = () => {
    dispatch(
      setCollabSessionData({
        createdBy: session?.user.id ?? "",
        roomId: roomId ?? "",
        sessionName: name,
      })
    );
  };

  const fetchUserData = async () => {
    console.log("Started Fetching User Data with user id.....", session?.user.id);
    const res = await getUserData(session?.user.id ?? "");
    setUserData(res);
    setIsLoading(false);
    console.log("Got the user data", res);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleStartSession = async () => {
    setLoading(true)
    handleSetData()

    if(roomId){
      const collabData = {
        room_id: roomId,
        thumbnail: "",
        created_at: new Date().toISOString()
      }
      const response = await createCollabSession(session?.user.id ?? "", collabData)
      const data = await createOrGetDrawingSession(roomId, {
        uid: session?.user.id ?? " ",
        name: session?.user.name ?? " ",
        email: session?.user.email ?? " "
      }, name)
      console.log("Created Initial Session Data", data)
    }
    playStartSessionSound();
    setTimeout(() => {
      
      router.push(link); 
    }, 3000);

  };

  return (
    <div className="w-full mx-auto p-1">
      <div className="w-full mb-2 flex z-10 justify-between items-center space-x-4 relative">
        <ProfileHeader />
      </div>

      {/* Centered Live Collaboration Section */}
      <motion.div
        className="flex justify-center mb-12 p-3 py-9 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center w-full max-w-2xl relative">
          <AnimatePresence mode="wait">
            {!sessionStarted ? (
              <motion.div
                key="startSession"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl font-semibold mb-2 text-gray-900">Live <span className='text-violet-600'>Collaboration</span></h2>
                <p className="text-lg mb-10 text-gray-600">Invite people to collaborate on your drawing.</p>
                <button
                  onClick={startSession}
                  className="bg-violet-500 text-white text-md font-medium py-3 px-8 rounded-lg hover:bg-violet-700 transition duration-300"
                >
                  Create Session
                </button>
              <img src='/images/collab.png' className='object-cover   z-0 absolute w-[200px] h-[200px] -top-1 -right-56'/>
              <img src='/images/collab2.png' className='object-cover  z-0 absolute w-[180px] h-[180px] -top-1 -left-56'/>
              <img src='/images/star.png' className='object-cover z-0  absolute w-[45px] h-[45px] -top-14 -right-56'/>
              <img src='/images/star.png' className='object-cover -z-0  absolute w-[45px] h-[45px] -top-20 -left-26'/>
              <img src='/images/star.png' className='object-cover -z-0  absolute w-[45px] h-[45px] -top-5 -left-[17rem]'/>
              <img src='/images/star.png' className='object-cover z-0  absolute w-[45px] h-[45px] -top-4 right-[5rem]'/>
              <img src='/images/star.png' className='object-cover -z-0  absolute w-[45px] h-[45px] top-[7rem] left-[6rem]'/>
              <img src='/images/star.png' className='object-cover -z-0  absolute w-[45px] h-[45px] -top-5 -left-[17rem]'/>

              </motion.div>
            ) : (
              <motion.div
                key="collaborateSession"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl font-semibold text-gray-900 mb-6">Start Collaborating</h2>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-left text-md font-medium text-gray-700 mb-2">
                    Session Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Project Deadline...."
                  />
                </div>
                <label htmlFor="link" className="block text-left text-md font-medium text-gray-700 mb-2">
                    Link
                  </label>
                <div id='link' className="p-2 bg-violet-200 text-gray-800 rounded-lg text-[0.98rem] text-left tracking-[1px] break-words border-[1.5px] border-violet-300 mb-4">
                  {link}
                </div>
                <div className="flex justify-center space-x-4 mt-3">
                  <button
                    onClick={copyToClipboard}
                    className="bg-black text-white text-md font-normal py-3 px-8 rounded-lg hover:bg-violet-700 flex items-center justify-center gap-2 transition duration-300"
                  >
                    <FaRegClipboard />
                    Copy Link
                  </button>
                  <button
                    onClick={cancelSession}
                    className="bg-black text-white text-md font-normal py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartSession}
                    className={`bg-violet-800 text-white text-md font-medium py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition duration-300 ${
                      loading ? 'cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className='flex items-center gap-4 justify-center'><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" /> Starting...</div>
                    ) : (
                      <>
                        <FaPlay />
                        Start Session
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Previous Sessions Section */}
      <div className="w-full">
        <h2 className="text-3xl font-medium text-gray-900 mb-6">Previous Sessions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-1">
          {userData?.collab_drawings.map((card, index) => (
            <motion.div
              key={card.room_id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                title={"title"}
                thumbnail={card.thumbnail}
                dateCreated={timeAgo(card.created_at)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collab;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const Playlist = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [requery, setRequery] = useState("");
  const [page, setPage] = useState(1);
  const [playlist, setPlaylist] = useState([]);
  const [search, setSearch] = useState(false);

  const Getplaylist = async () => {
    try {
      const { data } = await axios.get(
        `https://jiosaavan-api-2-harsh-patel.vercel.app/api/search/playlists?query=${query}&page=${page}&limit=10`
      );

      setPlaylist((prevState) => [...prevState, ...data?.data?.results]);
      localStorage.setItem("playlist", JSON.stringify(data?.data?.results));
    } catch (error) {
      console.log("error", error);
    }
  };

  function searchClick() {
    if (query !== requery) {
      toast.success(`Searching ${query}, Wait For Results`);
      setRequery(query);
      setPlaylist([]);
      setPage(1);
      setSearch(!search);
    } else {
      toast.error(`Please Check Your Search Query, It's Same As Before`);
    }
  }

  // Handle key down event for Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchClick();
    }
  };

  function seccall() {
    const intervalId = setInterval(() => {
      if (
        (playlist.length >= 0 && page < 20) ||
        query.length !== requery.length
      ) {
        setPage((prev) => prev + 1);
        Getplaylist();
      }
    }, 1000);
    return intervalId;
  }

  useEffect(() => {
    if (query.length > 0) {
      var interval = seccall();
    }

    return () => clearInterval(interval);
  }, [search, playlist]);

  useEffect(() => {
    const allData = localStorage.getItem("playlist");

    if (allData) {
      const parsedData = JSON.parse(allData);
      setPlaylist(parsedData);
    } else {
      console.log("No data found in localStorage.");
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="w-full h-[100vh] bg-black" // Changed from bg-slate-700 to bg-black
    >
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div className="w-full h-[100vh] ">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeInOut", duration: 0.7, delay: 0.5 }}
          className="search gap-3 w-full sm:w-full h-[15vh] flex items-center justify-center "
        >
          <i
            onClick={() => navigate(-1)}
            className="ml-5 cursor-pointer text-3xl bg-green-500 rounded-full ri-arrow-left-line"
          ></i>
          <input
            className="bg-black rounded-md p-3 sm:text-sm text-white border-none outline-none w-[50%] sm:w-[50%] sm:h-[7vh] h-[10vh]"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown} // Add key down event
            placeholder="Search anything like 2023 hindi"
            type="search"
          />
          <button
  onClick={searchClick}
  className="duration-300 cursor-pointer text-xl p-2 rounded-md hover:scale-90 flex items-center justify-center"
  style={{ background: "linear-gradient(135deg, #6e5fda, #5e58ba)" }} // Apply gradient background
>
  <i className="ri-search-2-line text-white"></i> {/* Icon color remains white */}
</button>

          
        </motion.div>
        
        <motion.div className="w-full overflow-hidden overflow-y-auto h-[85vh] sm:min-h-[85vh] flex flex-wrap p-5 gap-5 justify-center bg-black"> {/* Changed from bg-slate-700 to bg-black */}
          {playlist?.map((e, i) => (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: "easeInOut", duration: 0.5, delay: i * 0.1 }} // staggered animation for each item
              key={i}
              onClick={() => navigate(`/playlist/details/${e.id}`)}
              className="w-[15vw] h-[30vh] sm:w-[40vw] mb-8 sm:h-[20vh] sm:mb-12 rounded-md bg-red-200 cursor-pointer"
            >
              <img
                className="w-full h-full object-fill rounded-md"
                src={e?.image[2]?.url}
                alt=""
              />
              <h3 className="text-white">{e.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Playlist;

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
      className="w-full h-[100vh] bg-black"
    >
      <style>
        {`
          body {
            background-color: #1a1a1a; /* Dark background */
            color: #e0e0e0; /* Light text color for contrast */
            font-family: 'Arial', sans-serif; /* Example font, change as needed */
          }
          
          .search {
            background-color: #222; /* Search bar background */
            border-radius: 10px; /* Rounded corners for the search bar */
            padding: 10px;
          }
          
          input[type="search"] {
            background-color: #333; /* Input field background */
            color: #fff; /* Input text color */
            border: none; /* Remove border */
            outline: none; /* Remove outline */
            border-radius: 5px; /* Rounded corners */
            padding: 10px; /* Add some padding for better appearance */
            width: 100%; /* Full width */
          }
          
          .album-card {
            position: relative;
            background-color: #444; /* Album card background */
            color: white; /* Album card text color */
            width: 180px; /* Square width */
            height: 180px; /* Square height */
            border-radius: 10px; /* Rounded corners */
            overflow: hidden; /* Clip the corners */
            transition: transform 0.3s; /* Animation for hover effect */
            cursor: pointer; /* Change cursor to pointer on hover */
          }
          
          .album-card:hover {
            transform: scale(1.05); /* Slightly enlarge on hover */
          }
          
          .album-image {
            width: 100%;
            height: 100%;
            object-fit: cover; /* Ensure image covers the card */
          }
          
          .album-title {
            position: absolute;
            bottom: 10px; /* Position title at the bottom */
            left: 5px; /* Left padding */
            right: 5px; /* Right padding */
            text-align: center; /* Center text */
            font-size: 16px; /* Font size for the album title */
            overflow: hidden; /* Hide overflow text */
            text-overflow: ellipsis; /* Add ellipsis for long text */
            white-space: nowrap; /* Prevent text wrapping */
          }
        `}
      </style>
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
            placeholder="Search anything like 2024 hindi"
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

        <motion.div className="w-full overflow-hidden overflow-y-auto h-[85vh] sm:min-h-[85vh] flex flex-wrap p-5 gap-5 justify-center bg-black">
          {playlist?.map((e, i) => (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: "easeInOut", duration: 0.5, delay: i * 0.1 }} // staggered animation for each item
              key={i}
              onClick={() => navigate(`/playlist/details/${e.id}`)}
              className="album-card"
            >
              <img
                className="album-image"
                src={e?.image[2]?.url}
                alt=""
              />
              <h3 className="album-title">{e.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Playlist;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import './Album.css'; // Adjust the path if your CSS file is in a different directory

const Album = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [requery, setRequery] = useState("");
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getAlbums = async () => {
    try {
      const { data } = await axios.get(
        `https://jiosaavan-api-2-harsh-patel.vercel.app/api/search/albums?query=${requery}&page=${page}&limit=40`
      );
      const newData = data.data.results.filter(
        (newItem) => !albums.some((prevItem) => prevItem.id === newItem.id)
      );
      setAlbums((prevState) => [...prevState, ...newData]);
      setHasMore(newData.length > 0);
      setPage(page + 1);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSearchClick = () => {
    if (query !== requery) {
      toast.success(`Searching for "${query}", please wait for results.`);
      setRequery(query);
      setAlbums([]);
      setPage(1);
      setSearch(!search);
    } else {
      toast.error("The search query is the same as before.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  useEffect(() => {
    if (query.length > 0) {
      const delaySearch = setTimeout(() => getAlbums(), 1000);
      return () => clearTimeout(delaySearch);
    }
  }, [search]);

  useEffect(() => {
    const storedAlbums = localStorage.getItem("albums");
    if (storedAlbums) {
      setAlbums(JSON.parse(storedAlbums));
    } else {
      console.log("No data found in localStorage.");
    }
  }, []);

  const loadMoreData = () => {
    setTimeout(() => getAlbums(), 1000);
  };

  return (
    <InfiniteScroll
      dataLength={albums.length}
      next={loadMoreData}
      hasMore={hasMore}
      loader={page > 2 && <h2 className="loading-text text-white">Loading...</h2>}
      endMessage={<p className="end-message text-white">No more items</p>}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="album-container bg-black min-h-screen w-full"
      >
        <Toaster position="top-center" reverseOrder={false} />
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="search-bar bg-black fixed z-50 w-full h-[15vh] flex items-center justify-center gap-3 p-5"
          style={{
            background: "#0e0e10",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
          }}
        >
          <i
            onClick={() => navigate(-1)}
            className="ml-5 cursor-pointer text-2xl bg-green-600 rounded-full ri-arrow-left-line"
          ></i>
          <input
            className="search-input bg-gray-800 rounded-md p-3 text-white w-1/2 sm:w-[50%] h-[10vh] sm:h-[7vh] outline-none"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Albums"
            type="search"
            onKeyPress={handleKeyPress} // Ensure Enter works
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid #444",
              color: "#f5f5f5",
              fontSize: "1rem",
              borderRadius: "8px",
              padding: "0.6rem",
              width: "100%",
              outline: "none",
            }}
          />
          <motion.button
            onClick={handleSearchClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="search-button"
            style={{
              background: "linear-gradient(135deg, #6e5fda, #5e58ba)",
              color: "#fff",
              fontSize: "1rem",
              padding: "0.4rem 1.2rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.2s ease",
            }}
          >
            <i className="ri-search-2-line"></i>
          </motion.button>
        </motion.div>
        <div className="album-grid pt-[15vh] min-h-[85vh] flex flex-wrap gap-5 justify-center bg-black p-5">
          {albums?.map((album, index) => (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="album-card bg-black rounded-md overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-all duration-300"
              key={album.id}
              onClick={() => navigate(`/albums/details/${album.id}`)}
            >
              <img
                className="album-image w-full h-full object-cover rounded-t-md"
                src={album?.image[2]?.url}
                alt={album.name}
              />
              <h3 className="album-title text-center text-white p-2">{album.name}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </InfiniteScroll>
  );
};

export default Album;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const Artists = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [requery, setRequery] = useState("");
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState(false);

  const GetArtists = async () => {
    try {
      const { data } = await axios.get(
        `https://jiosaavan-api-2-harsh-patel.vercel.app/api/search/artists?query=${query}&limit=100`
      );
      setArtists(data?.data?.results);
      localStorage.setItem("artists", JSON.stringify(data?.data?.results));
    } catch (error) {
      console.log("error", error);
    }
  };

  const searchClick = () => {
    if (query !== requery) {
      toast.success(`Searching for "${query}", please wait for results...`);
      setRequery(query);
      setArtists([]);
      setSearch(!search);
    } else {
      toast.error(`Search query is the same as before.`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchClick();
    }
  };

  const setIntervalFetch = () => {
    const intervalId = setInterval(() => {
      if (artists.length === 0 || query.length !== requery.length) {
        GetArtists();
      }
    }, 1000);
    return intervalId;
  };

  useEffect(() => {
    if (query.length > 0) {
      const interval = setIntervalFetch();
      return () => clearInterval(interval);
    }
  }, [search, artists]);

  useEffect(() => {
    const allData = localStorage.getItem("artists");
    if (allData) {
      const parsedData = JSON.parse(allData);
      setArtists(parsedData);
    } else {
      console.log("No data found in localStorage.");
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        width: "100%",
        background: "#0e0e10",
        color: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          width: "100%",
          maxWidth: "600px",
          padding: "0.8rem",
          background: "#1a1a1f",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
        }}
      >
        <i
          onClick={() => navigate(-1)}
          className="ml-5 cursor-pointer text-2xl bg-green-600 rounded-full ri-arrow-left-line"
        ></i>
        <input
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
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for artists..."
          type="search"
        />
        <motion.button
          onClick={searchClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
      <motion.div
        style={{
          padding: "1rem",
          gap: "0.8rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          overflowY: "auto",
          height: "85vh",
        }}
      >
        {artists?.map((artist, index) => (
          <motion.div
            key={index}
            onClick={() => navigate(`/artists/details/${artist.id}`)}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.05,
              duration: 0.3,
              ease: "easeInOut",
            }}
            style={{
              width: "150px",
              height: "220px",
              background: "#1a1a2b",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={artist?.image[2]?.url}
              alt={artist.name}
              style={{
                width: "100%",
                height: "70%",
                objectFit: "cover",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div
              style={{
                padding: "0.6rem",
                textAlign: "center",
                background: "#202030",
              }}
            >
              <h3 style={{ fontSize: "1rem", fontWeight: "bold", color: "#f5f5f5" }}>
                {artist.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Artists;

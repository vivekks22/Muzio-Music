import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import wavs from "../../public/wavs.gif";
import {
  animate,
  circIn,
  circInOut,
  circOut,
  easeIn,
  easeInOut,
  easeOut,
  motion,
} from "framer-motion";
import { useAnimate, stagger } from "framer-motion";
import { Bounce, Expo, Power4, Sine } from "gsap/all";
import { Circ } from "gsap/all";
import toast, { Toaster } from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
const Songs = () => {
  
  const navigate = useNavigate();
  const [query, setquery] = useState("");
  const [requery, setrequery] = useState("");
  const [search, setsearch] = useState([]);
  var [index, setindex] = useState("");
  const [songlink, setsonglink] = useState([]);
  const [page, setpage] = useState(null);
  const [searchclick, setsearchclick] = useState(false);
  const [like, setlike] = useState(false);
  const [like2, setlike2] = useState(false);
  const [existingData, setexistingData] = useState(null);
  const audioRef = useRef();
  const [hasMore, sethasMore] = useState(true);
  const [audiocheck, setaudiocheck] = useState(true);

  const Getsearch = async () => {
    try {
      if (hasMore === false) {
        setpage(page + 1);
        toast(`SEARCHING NEW SONGS IN PAGE ${page} `, {
          icon: "🔃",
          duration: 1500,
        style: {
          borderRadius: "8px",
          background: "linear-gradient(135deg, #333, #444)", // Smooth gradient
          color: "#e0e0e0", // Light color for text
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.5)", // Premium shadow
          padding: "12px 16px",
          fontSize: "0.95rem", // Slightly larger font for readability
        },
        });
      }
      const { data } = await axios.get(
        `https://jiosaavan-api-2-harsh-patel.vercel.app/api/search/songs?query=${requery}&page=${page}&limit=40`
      );
      if (hasMore) {
        const newData = data.data.results.filter(
          (newItem) => !search.some((prevItem) => prevItem.id === newItem.id)
        );
        setsearch((prevState) => [...prevState, ...newData]);
        sethasMore(newData.length > 0);
        setpage(page + 1);
      } else {
        const newData = data.data.results.filter(
          (newItem) => !search.some((prevItem) => prevItem.id === newItem.id)
        );
        if (newData.length > 0) {
          setsearch((prevState) => [...prevState, ...newData]);
          // setpage(page + 1);
          // sethasMore(true);
        } else {
          toast(
            `NO MORE NEW SONGS FOUND IN PAGE ${page} `,
            {
              icon: "⚠️",
              duration: 1500,
        style: {
          borderRadius: "8px",
          background: "linear-gradient(135deg, #333, #444)", // Smooth gradient
          color: "#e0e0e0", // Light color for text
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.5)", // Premium shadow
          padding: "12px 16px",
          fontSize: "0.95rem", // Slightly larger font for readability
        },
            }
          );
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  function searchClick() {
    if (query !== requery) {
      toast.success(`Searching ${query} , Wait For Results`);
      setsearch([]);
      setsonglink([]);
      sethasMore(true);
      setindex("");
      setpage(1);
      setrequery(query);
      setsearchclick(!searchclick);
    } else {
      toast.error(`Please Check Your Search Query , Its Same As Before `);
    }
  }

  function audioseter(i) {
    if (songlink[0]?.id === search[i].id) {
      const audio = audioRef.current;
      if (!audio.paused) {
        audio.pause();
        setaudiocheck(false);
      } else {
        setaudiocheck(true);
        audio.play().catch((error) => {
          console.error("Playback failed:", error);
        });
      }
    } else {
      setindex(i);
      setsonglink([search[i]]);
    }
  }

  function likeset(e) {
    // console.log(e);
    var tf =
      localStorage.getItem("likeData") &&
      JSON.parse(localStorage.getItem("likeData")).some(
        (item) => item.id == e?.id
      );
    // console.log(tf);
    // console.log(e?.id);
    setlike(tf);
    // console.log(like);
  }

  function likehandle(i) {
    // Retrieve existing data from localStorage
    let existingData = localStorage.getItem("likeData");

    // Initialize an array to hold the updated data
    let updatedData = [];

    // If existing data is found, parse it from JSON
    if (existingData) {
      updatedData = JSON.parse(existingData);
    }

    // Check if the new data already exists in the existing data
    let exists = updatedData.some((item) => item.id === i.id);

    if (!exists) {
      // If not, add the new data
      updatedData.push(i);
      // Store the updated data back into localStorage
      localStorage.setItem("likeData", JSON.stringify(updatedData));
      setlike(true);
    
      // Toast notification with premium styling
      toast(`Song (${i?.name}) added to Likes section`, {
        icon: "✅",
        duration: 1500,
        position: "bottom-center", // Position the toast at the bottom center
        style: {
          borderRadius: "10px", // Rounded for a premium look
          width: "fit-content", // Adjusts width to content
          maxWidth: "80%", // Prevents it from getting too wide
          background: "rgba(50, 50, 50, 0.9)", // Dark background for contrast
          color: "#ffffff", // White text for readability
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.7)", // Premium shadow
          padding: "12px 20px", // Extra padding for spacing
          fontSize: "0.9rem",
          fontWeight: "bold",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: "1.2", // For better readability
          borderLeft: "5px solid #4CAF50", // Green accent for "added" action
        },
      });
    }
     else {
      setlike(false);
      let existingData = localStorage.getItem("likeData");

      // If no data exists, there's nothing to remove
      if (!existingData) {
        console.log("No data found in localStorage.");
        return;
      }
      // Parse the existing data from JSON
      let updatedData = JSON.parse(existingData);

      // Find the index of the song with the given ID in the existing data
      const indexToRemove = updatedData.findIndex((item) => item.id === i.id);

      // If the song is found, remove it from the array
      if (indexToRemove !== -1) {
        updatedData.splice(indexToRemove, 1);
      
        // Store the updated data back into localStorage
        localStorage.setItem("likeData", JSON.stringify(updatedData));
      
        // Toast notification with premium styling for removal
        toast(`Song (${i?.name}) removed successfully.`, {
          icon: "⚠️",
          duration: 1500,
          position: "bottom-center", // Position at the bottom center of the screen
          style: {
            borderRadius: "10px", // Rounded corners for premium look
            width: "fit-content", // Auto-size based on content
            maxWidth: "80%", // Prevents it from being too wide on larger screens
            background: "rgba(50, 50, 50, 0.9)", // Dark background for contrast
            color: "#ffffff", // White text for readability
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.7)", // Shadow for depth effect
            padding: "12px 20px", // Extra padding for spacing
            fontSize: "0.9rem",
            fontWeight: "bold",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "1.2", // Line height for better readability
            borderLeft: "5px solid #ff9800", // Orange accent for "removed" action
          },
        });
      }
       else {
        toast.error("Song not found in localStorage.");
        //   console.log("Song not found in localStorage.");
      }
    }
  }

  function likehandle2(i) {
    // Retrieve existing data from localStorage
    let existingData = localStorage.getItem("likeData");

    // Initialize an array to hold the updated data
    let updatedData = [];

    // If existing data is found, parse it from JSON
    if (existingData) {
      updatedData = JSON.parse(existingData);
    }

    // Check if the new data already exists in the existing data
    let exists = updatedData.some((item) => item.id === i.id);

    if (!exists) {
      // If not, add the new data
      updatedData.push(i);
      // Store the updated data back into localStorage
      localStorage.setItem("likeData", JSON.stringify(updatedData));
      setlike(true);
    
      // Toast notification with premium styling
      toast(`Song (${i?.name}) added to Likes section`, {
        icon: "✅",
        duration: 1500,
        position: "bottom-center", // Position the toast at the bottom center
        style: {
          borderRadius: "10px", // Rounded for a premium look
          width: "fit-content", // Adjusts width to content
          maxWidth: "80%", // Prevents it from getting too wide
          background: "rgba(50, 50, 50, 0.9)", // Dark background for contrast
          color: "#ffffff", // White text for readability
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.7)", // Premium shadow
          padding: "12px 20px", // Extra padding for spacing
          fontSize: "0.9rem",
          fontWeight: "bold",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: "1.2", // For better readability
          borderLeft: "5px solid #4CAF50", // Green accent for "added" action
        },
      });
    }
     else {

      setlike2(!like2);
      let existingData = localStorage.getItem("likeData");

      // If no data exists, there's nothing to remove
      if (!existingData) {
        console.log("No data found in localStorage.");
        return;
      }
      // Parse the existing data from JSON
      let updatedData = JSON.parse(existingData);

      // Find the index of the song with the given ID in the existing data
      const indexToRemove = updatedData.findIndex((item) => item.id === i.id);

      // If the song is found, remove it from the array
      if (indexToRemove !== -1) {
        updatedData.splice(indexToRemove, 1);
      
        // Store the updated data back into localStorage
        localStorage.setItem("likeData", JSON.stringify(updatedData));
      
        // Toast notification with premium styling for removal
        toast(`Song (${i?.name}) removed successfully.`, {
          icon: "⚠️",
          duration: 1500,
          position: "bottom-center", // Position at the bottom center of the screen
          style: {
            borderRadius: "10px", // Rounded corners for premium look
            width: "fit-content", // Auto-size based on content
            maxWidth: "80%", // Prevents it from being too wide on larger screens
            background: "rgba(50, 50, 50, 0.9)", // Dark background for contrast
            color: "#ffffff", // White text for readability
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.7)", // Shadow for depth effect
            padding: "12px 20px", // Extra padding for spacing
            fontSize: "0.9rem",
            fontWeight: "bold",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "1.2", // Line height for better readability
            borderLeft: "5px solid #ff9800", // Orange accent for "removed" action
          },
        });
      }
       else {
        toast.error("Song not found in localStorage.");
        //   console.log("Song not found in localStorage.");
      }
    }
  }
  const initializeMediaSession = () => {
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: songlink[0]?.name || "",
        artist: songlink[0]?.album?.name || "",
        artwork: [
          {
            src: songlink[0]?.image[2]?.url || "",
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", function () {
        // Handle play action
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.error("Play error:", error);
          });
        }
      });

      navigator.mediaSession.setActionHandler("pause", function () {
        // Handle pause action
        if (audioRef.current) {
          audioRef.current.pause().catch((error) => {
            console.error("Pause error:", error);
          });
        }
      });

      navigator.mediaSession.setActionHandler("previoustrack", function () {
        pre();
        audioRef.current.play();
      });

      navigator.mediaSession.setActionHandler("nexttrack", function () {
        next();
        audioRef.current.play();
      });
    } else {
      console.warn("MediaSession API is not supported.");
    }
    if (isIOS) {
      // Enable background audio playback for iOS
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch((error) => {
              console.error("Play error:", error);
            });
          }
        } else {
          if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause().catch((error) => {
              console.error("Pause error:", error);
            });
          }
        }
      });
    }
  };

  function next() {
    if (index < search.length - 1) {
      setindex(index++);
      audioseter(index);
      audioRef.current.play();
    } else {
      setindex(0);
      setsonglink([search[0]]);
      audioRef.current.play();
    }
  }
  function pre() {
    if (index > 0) {
      setindex(index--);
      audioseter(index);
      audioRef.current.play();
    } else {
      setindex(search.length - 1);
      setsonglink([search[search.length - 1]]);
      audioRef.current.play();
    }
  }

  const handleDownloadSong = (url, name, poster) => {
    return toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${name}.mp3`;

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);

          resolve(); // Resolve the promise once the download is complete
        } catch (error) {
          console.log("Error fetching or downloading files", error);
          reject("Error downloading song");
        }
      }),
      {
        loading: `Song ${name} Downloading...`, // Loading message
        success: `Song Downloaded ✅`, // Success message
        error: <b>Error downloading song.</b>, // Error message
      }
    );
  };

  useEffect(() => {
    setTimeout(() => {
      if (requery.length > 0) {
        Getsearch();
      }
    }, 1000);
  }, [searchclick]);

  function newdata() {
    if (page>=2) {
      setTimeout(() => {
        Getsearch();
      }, 1000);
    }
  }
 
  useEffect(() => {
    likeset(songlink[0]);
  }, [search, like, songlink, like2, existingData]);

  useEffect(() => {
    // Retrieve all data from localStorage
    const allData = localStorage.getItem("likeData");

    // Check if data exists in localStorage
    if (allData) {
      // Parse the JSON string to convert it into a JavaScript object
      const parsedData = JSON.parse(allData);

      // Now you can use the parsedData object
      setexistingData(parsedData);
    } else {
      console.log("No data found in localStorage.");
    }
  }, [search, like, songlink, like2]);

  useEffect(() => {
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);

    if (!isIOS && songlink.length > 0) {
      audioRef.current.play();
      initializeMediaSession();
    }
  }, [songlink]);

  var title = songlink[0]?.name;

  document.title = `${title ? title : "Muzio"}`;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="w-full h-screen bg-black" // Full black background for the main container
      style={{ backgroundColor: 'black' }} // Inline style to ensure background is black
    >
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        initial={{ y: -50, scale: 0 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ ease: Circ.easeIn, duration: 0.7, delay: 0.7 }}
        className="search fixed z-[99] backdrop-blur-none gap-3 w-full max-h-[10vh] py-8 flex items-center justify-center bg-black" // Black background for the search bar
      >
        <i
          onClick={() => navigate(-1)}
          className="ml-5 cursor-pointer text-3xl bg-green-500 rounded-full ri-arrow-left-line"
        ></i>

        <input
          className="bg-black rounded-md p-3 sm:text-sm text-white border-none outline-none w-[50%] sm:w-[50%] sm:max-h-[5vh] max-h-[8vh]"
          onChange={(e) => setquery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchClick(); // Trigger search on Enter key press
            }
          }}
          placeholder="Search Songs"
          type="search"
        />

        <i
          onClick={() => searchClick()}
          className="duration-300 cursor-pointer text-2xl ri-search-2-line bg-slate-400 p-2 rounded-md hover:bg-slate-600 hover:scale-90"
          title="Search"
        ></i>
      </motion.div>

      <InfiniteScroll
        dataLength={search.length}
        next={newdata}
        hasMore={hasMore}
        loader={
          page > 2 && <h1 className="bg-black text-white">Loading...</h1> // Ensure loader has black background
        }
        endMessage={<p className="bg-black text-white">No more items</p>} // Ensure end message has black background
      >
        <div className="pt-[10vh] pb-[30vh] overflow-hidden overflow-y-auto">
          <div className="flex w-full bg-black text-white p-10 sm:p-3 sm:gap-3 sm:block flex-wrap gap-5 justify-center"> {/* Set container to black */}
            {search?.map((d, i) => (
              <div
                title="click on song image or name to play the song"
                key={i}
                className="items-center justify-center relative hover:scale-95 sm:hover:scale-100 duration-150 w-[40%] flex mb-3 sm:mb-3 sm:w-full sm:flex sm:items-center sm:gap-3 rounded-md h-[10vw] sm:h-[15vh] cursor-pointer bg-black" // Each item background is black
              >
                <div
                  onClick={() => audioseter(i)}
                  className="flex w-[80%] items-center"
                >
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 }}
                    viewport={{ once: true }}
                    className="w-[10vw] h-[10vw] sm:h-[15vh] sm:w-[15vh] rounded-md"
                    src={d.image[2].url}
                    alt=""
                  />

                  <p className="pl-1 text-green-400">{i + 1}</p>
                  <img
                    className={`absolute top-0 w-[8%] sm:w-[10%] rounded-md ${
                      d.id === songlink[0]?.id ? "block" : "hidden"
                    }`}
                    src={wavs}
                    alt=""
                  />
                  {songlink.length > 0 && (
                    <i
                      className={`absolute top-0 sm:h-[15vh] w-[10vw] h-full flex items-center justify-center text-5xl sm:w-[15vh] opacity-90 duration-300 rounded-md ${
                        d.id === songlink[0]?.id ? "block" : "hidden"
                      } ${
                        audiocheck
                          ? "ri-pause-circle-fill"
                          : "ri-play-circle-fill"
                      }`}
                    ></i>
                  )}
                  <div className="ml-3 sm:ml-3 flex justify-center items-center gap-5 mt-2">
                    <div className="flex flex-col">
                      <h3
                        className={`text-sm sm:text-xs leading-none font-bold ${
                          d.id === songlink[0]?.id && "text-green-300"
                        }`}
                      >
                        {d.name}
                      </h3>
                      <h4 className="text-xs sm:text-[2.5vw] text-zinc-300">
                        {d.album.name}
                      </h4>
                    </div>
                  </div>
                </div>

                {existingData?.find((element) => element?.id === d?.id) ? (
                  <i
                    title="Unlike"
                    onClick={() => likehandle2(d)}
                    className={`text-xl m-auto flex w-[3vw] sm:w-[9vw] rounded-full justify-center items-center h-[3vw] sm:h-[9vw] duration-300 cursor-pointer text-red-500 ri-heart-3-fill`}
                  ></i>
                ) : (
                  <i
                    title="Like"
                    onClick={() => likehandle2(d)}
                    className={`text-xl m-auto flex w-[3vw] sm:w-[9vw] rounded-full justify-center items-center h-[3vw] sm:h-[9vw] duration-300 cursor-pointer text-zinc-300 ri-heart-3-fill`}
                  ></i>
                )}
              </div>
            ))}
            {search.length > 0 && !hasMore && (
              <div className={`w-full flex flex-col items-center justify-center`}>
                <button
                  onClick={newdata}
                  className={`bg-red-400 shadow-2xl py-2 px-1 rounded-md`}
                >
                  Load more
                </button>
                <span>wait for some seconds after click</span>
              </div>
            )}
          </div>
        </div>
      </InfiniteScroll>

      <motion.div
        className={
          songlink.length > 0
            ? ` duration-700 fixed z-[99] bottom-0    gap-3 items-center justify-center py-3 sm:h-[30vh]  w-full max-h-[30vh]     backdrop-blur-xl`
            : "block"
        }
      >
        {songlink?.map((e, i) => (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            key={i}
            className="flex  sm:block w-full sm:w-full sm:h-full items-center justify-center gap-3"
          >
            
            <motion.div
              initial={{ x: -50, opacity: 0, scale: 0 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              className="w-[25vw] sm:w-full  flex gap-3 items-center sm:justify-center rounded-md  h-[7vw] sm:h-[30vw]"
            >
              <p className=" text-green-400">{index+1}</p>
              <motion.img
                initial={{ x: -50, opacity: 0, scale: 0 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                className="rounded-md h-[7vw] sm:h-[25vw]"
                src={e?.image[2]?.url}
                alt=""
              />
              <h3 className=" sm:w-[30%] text-white text-xs font-semibold">
                {e?.name}
              </h3>
              <i
                onClick={() =>
                  handleDownloadSong(e?.downloadUrl[4].url, e.name)
                }
                className="hidden sm:flex cursor-pointer  items-center justify-center bg-green-700 sm:w-[9vw] sm:h-[9vw] w-[3vw] h-[3vw]   rounded-full text-2xl ri-download-line"
              ></i>

              <i
                onClick={() => likehandle(e)}
                className={`text-xl hover:scale-150 sm:hover:scale-100 duration-300 cursor-pointer ${
                  like ? "text-red-500" : "text-zinc-300"
                }  ri-heart-3-fill`}
              ></i>
            </motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="w-[35%]  sm:w-full h-[10vh] flex gap-3 sm:gap-1 items-center justify-center"
            >
              <button
                onClick={pre}
                className="text-3xl text-white bg-zinc-800 cursor-pointer rounded-full"
              >
                <i className="ri-skip-back-mini-fill"></i>
              </button>
              <audio
                className="w-[80%]"
                ref={audioRef}
                onPause={() => setaudiocheck(false)}
                onPlay={() => setaudiocheck(true)}
                controls
                autoPlay
                onEnded={next}
                src={e?.downloadUrl[4]?.url}
              ></audio>
              <button
                onClick={next}
                className="text-3xl text-white bg-zinc-800 cursor-pointer rounded-full"
              >
                <i className="ri-skip-right-fill"></i>
              </button>
            </motion.div>
            <div className="sm:hidden flex flex-col text-[1vw] items-center  gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-400">
                  Download Options
                </h3>
              </div>
              <div className="flex flex-row-reverse gap-2 ">
                <p
                  onClick={() =>
                    handleDownloadSong(e.downloadUrl[0].url, e.name + " 12kbps")
                  }
                  className="duration-300 cursor-pointer hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                >
                  12kbps <br />
                  <p className="text-xs">Very low quality</p>
                </p>
                <p
                  onClick={() =>
                    handleDownloadSong(e.downloadUrl[1].url, e.name + " 48kbps")
                  }
                  className="duration-300 cursor-pointer  hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                >
                  48kbps <br />
                  <p className="text-xs">Low quality</p>
                </p>
                <p
                  onClick={() =>
                    handleDownloadSong(e.downloadUrl[2].url, e.name + " 96kbps")
                  }
                  className="duration-300 cursor-pointer  hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                >
                  96kbps <br />
                  <p className="text-xs">Fair quality</p>
                </p>
                <p
                  onClick={() =>
                    handleDownloadSong(
                      e.downloadUrl[3].url,
                      e.name + " 160kbps"
                    )
                  }
                  className="duration-300 cursor-pointer  hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                >
                  160kbps <br />
                  <p className="text-xs">Good quality</p>
                </p>
                <p
                  onClick={() =>
                    handleDownloadSong(
                      e.downloadUrl[4].url,
                      e.name + " 320kbps",
                      e?.image[2]?.url
                    )
                  }
                  className="duration-300 cursor-pointer  hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                >
                  320kbps <br />
                  <p className="text-xs"> High quality</p>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Songs;

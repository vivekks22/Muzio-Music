import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";
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

const AlbumDetails = () => {
  const navigate = useNavigate();
  let location = useLocation();
  let id = location.pathname;
  let newid = id.split("/");
  let finalid = newid[3];

  const [details, setdetails] = useState([]);
  const [songlink, setsonglink] = useState([]);
  var [index, setindex] = useState("");
  const [like, setlike] = useState(false);
  const [like2, setlike2] = useState(false);
  const [existingData, setexistingData] = useState(null);
  const audioRef = useRef();
  const [audiocheck, setaudiocheck] = useState(true);

  const Getdetails = async () => {
    try {
      const { data } = await axios.get(
        // `https://saavn.dev/api/albums?id=${finalid}`
        `https://jiosaavan-api-2-harsh-patel.vercel.app/api/albums?id=${finalid}`
      );
      setdetails(data.data.songs);
    } catch (error) {
      console.log("error", error);
    }
  };

  function audioseter(i) {
    if (songlink[0]?.id === details[i].id) {
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
      setsonglink([details[i]]);
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
      
      // Toast notification with premium styling for adding a song
      toast(`Song (${i?.name}) added to Likes section`, {
        icon: "✅",
        duration: 1500,
        position: "bottom-center", // Position at the bottom center of the screen
        style: {
          borderRadius: "10px", // Slightly rounded corners for a premium look
          width: "fit-content", // Auto-size based on content
          maxWidth: "80%", // Limit width for larger screens
          background: "linear-gradient(135deg, #333, #444)", // Smooth gradient
          color: "#e0e0e0", // Light color for text
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.7)", // Stronger shadow for depth
          padding: "12px 20px", // Extra padding for better spacing
          fontSize: "0.9rem", // Slightly reduced font size for better fit
          fontWeight: "bold", // Bold text for emphasis
          textAlign: "center", // Center the text
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: "1.2", // Improved line height for readability
          borderLeft: "5px solid #4caf50", // Green accent for "added" action
        },
      });
    }
     else {
      // setlike(true);
      // Otherwise, inform the user that the song is already liked
      // console.log("You've already liked this song.");
      // toast.error("You've already liked this song.");

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

  // Toast notification with premium styling for removing a song
  toast(`Song (${i?.name}) removed successfully.`, {
    icon: "⚠️",
    duration: 1500,
    position: "bottom-center", // Position at the bottom center of the screen
    style: {
      borderRadius: "10px", // Slightly rounded corners for a premium look
      width: "fit-content", // Auto-size based on content
      maxWidth: "80%", // Limit width for larger screens
      background: "linear-gradient(135deg, #333, #444)", // Smooth gradient
      color: "#e0e0e0", // Light color for text
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.7)", // Stronger shadow for depth
      padding: "12px 20px", // Extra padding for better spacing
      fontSize: "0.9rem", // Slightly reduced font size for better fit
      fontWeight: "bold", // Bold text for emphasis
      textAlign: "center", // Center the text
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: "1.2", // Improved line height for readability
      borderLeft: "5px solid #ff9800", // Orange accent for "removed" action
    },
  });


        // if (index>0 && details.length>=0) {
        //     setrerender(!rerender)
        //     var index2 = index-1
        //     setindex(index2);
        //     setsonglink([details[index2]]);
        // }
        // else{
        //     setrerender(!rerender)
        // }
      } else {
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
      
      // Toast notification with premium styling for adding a song
      toast(`Song (${i?.name}) added to Likes section`, {
        icon: "✅",
        duration: 1500,
        position: "bottom-center", // Position at the bottom center of the screen
        style: {
          borderRadius: "10px", // Slightly rounded corners for a premium look
          width: "fit-content", // Auto-size based on content
          maxWidth: "80%", // Limit width for larger screens
          background: "linear-gradient(135deg, #333, #444)", // Smooth gradient
          color: "#e0e0e0", // Light color for text
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.7)", // Stronger shadow for depth
          padding: "12px 20px", // Extra padding for better spacing
          fontSize: "0.9rem", // Slightly reduced font size for better fit
          fontWeight: "bold", // Bold text for emphasis
          textAlign: "center", // Center the text
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: "1.2", // Improved line height for readability
          borderLeft: "5px solid #4caf50", // Green accent for "added" action
        },
      });
    }
     else {
      // setlike(true);
      // Otherwise, inform the user that the song is already liked
      // console.log("You've already liked this song.");
      // toast.error("You've already liked this song.");

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

  // Toast notification with premium styling for removing a song
  toast(`Song (${i?.name}) removed successfully.`, {
    icon: "⚠️",
    duration: 1500,
    position: "bottom-center", // Position at the bottom center of the screen
    style: {
      borderRadius: "10px", // Slightly rounded corners for a premium look
      width: "fit-content", // Auto-size based on content
      maxWidth: "80%", // Limit width for larger screens
      background: "linear-gradient(135deg, #333, #444)", // Smooth gradient
      color: "#e0e0e0", // Light color for text
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.7)", // Stronger shadow for depth
      padding: "12px 20px", // Extra padding for better spacing
      fontSize: "0.9rem", // Slightly reduced font size for better fit
      fontWeight: "bold", // Bold text for emphasis
      textAlign: "center", // Center the text
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: "1.2", // Improved line height for readability
      borderLeft: "5px solid #ff9800", // Orange accent for "removed" action
    },
  });

        // if (index>0 && details.length>=0) {
        //     setrerender(!rerender)
        //     var index2 = index-1
        //     setindex(index2);
        //     setsonglink([details[index2]]);
        // }
        // else{
        //     setrerender(!rerender)
        // }
      } else {
        toast.error("Song not found in localStorage.");
        //   console.log("Song not found in localStorage.");
      }
    }
  }




  const initializeMediaSession = () => {
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);
  
    if (!isIOS && "mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: songlink[0]?.name || "",
        artist: songlink[0]?.album?.name || "",
        artwork: [
          { src: songlink[0]?.image[2]?.url || "", sizes: "96x96", type: "image/jpeg" },
          { src: songlink[0]?.image[2]?.url || "", sizes: "128x128", type: "image/jpeg" },
          { src: songlink[0]?.image[2]?.url || "", sizes: "192x192", type: "image/jpeg" },
          { src: songlink[0]?.image[2]?.url || "", sizes: "256x256", type: "image/jpeg" },
          { src: songlink[0]?.image[2]?.url || "", sizes: "512x512", type: "image/jpeg" },
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
      });
  
      navigator.mediaSession.setActionHandler("nexttrack", function () {
        next();
      });
    } else {
      console.warn("MediaSession API is not supported or the device is iOS.");
    }
  };
  

  function next() {
    if (index < details.length - 1) {
      setindex(index++);
      audioseter(index);
    } else {
      setindex(0);
      setsonglink([details[0]]);
    }
  }
  function pre() {
    if (index > 0) {
      setindex(index--);
      audioseter(index);
    } else {
      setindex(details.length - 1);
      setsonglink([details[details.length - 1]]);
    }
  }

  // const handleDownloadSong = async (url, name) => {
  //   try {
  //     toast.success(`Song ${name} Downloading...`);
  //     const res = await fetch(url);
  //     const blob = await res.blob();
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `${name}.mp3`;

  //     document.body.appendChild(link);
  //     link.click();

  //     document.body.removeChild(link);
  //     toast.success("Song Downloaded ✅");
  //   } catch (error) {
  //     console.log("Error fetching or downloading files", error);
  //   }
  // };

  const handleDownloadSong = (url, name, poster) => {
    return toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          // Display loading message
          // toast.loading(`Song ${name} Downloading...`, {
          //   id: 'loading-toast' // Set a unique ID for the loading toast
          // });
  
          // Perform the download
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
        error: <b>Error downloading song.</b> // Error message
      }
    );
  };

  function seccall() {
    const intervalId = setInterval(() => {
      if (details.length === 0) {
        Getdetails();
      }
    }, 3000);
    return intervalId;
  }

  useEffect(() => {
    var interval = seccall();

    return () => clearInterval(interval);
  }, [details, like, songlink, like2, existingData]);

  useEffect(() => {
    likeset(songlink[0]);
  }, [details, like, songlink, like2, existingData]);

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
  }, [details, like, songlink, like2]);

  useEffect(() => {
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);
  
    if (!isIOS && songlink.length > 0) {
      audioRef.current.play();
      (() => {
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
          });

          navigator.mediaSession.setActionHandler("nexttrack", function () {
            next();
          });
        } else {
          console.warn("MediaSession API is not supported.");
        }
      })();
    }
  }, [songlink]);

  // useEffect(() => {
  //   Getdetails();
  // }, []);

  var title = songlink[0]?.name;

  document.title = `${title ? title : "Muzio"}`;
  // console.log(finalid);
  // console.log(details);
  // console.log(songscount);
  // console.log();
  // console.log(index);
  // console.log(like);
  // console.log(existingData);
  return details.length ? (
    <motion.div
  initial={{ opacity: 0 }} // Starts fully transparent
  animate={{ opacity: 1 }}  // Fades to fully visible
  transition={{ duration: 0.5 }} // Sets a faster duration for the fade effect
  className="w-full h-screen bg-black" // Main background
>
  <Toaster position="top-center" reverseOrder={false} />
  <div className="w-full fixed z-[99] backdrop-blur-xl flex items-center gap-3 sm:h-[7vh] h-[10vh]">
    <i
      onClick={() => navigate(-1)}
      className="text-3xl cursor-pointer ml-5 bg-green-500 rounded-full ri-arrow-left-line"
    ></i>
    <h1 className="text-xl text-zinc-300 font-black">Muzio</h1>
  </div>

  <div className="flex w-full pt-[15vh] sm:pt-[10vh] pb-[25vh] sm:pb-[35vh] text-white p-10 sm:p-3 sm:gap-3 min-h-[65vh] overflow-y-auto sm:block flex-wrap gap-5 justify-center">
    {details?.map((d, i) => (
      <div
        title="click on song image or name to play the song"
        key={i}
        className="items-center justify-center relative hover:scale-95 sm:hover:scale-100 duration-150 w-[40%] flex mb-3 sm:mb-3 sm:w-full sm:flex sm:items-center sm:gap-3 rounded-lg shadow-lg h-[10vw] sm:h-[15vh] cursor-pointer bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600" // Updated gradient and shadow
      >
        <div
          onClick={() => audioseter(i)}
          className="flex w-[80%] items-center"
        >
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
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
              } ${audiocheck ? "ri-pause-circle-fill" : "ri-play-circle-fill"}`}
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

        {existingData?.find((element) => element?.id == d?.id) ? (
          <i
            onClick={() => likehandle2(d)}
            className={`text-xl m-auto flex w-[3vw] sm:w-[9vw] rounded-full justify-center items-center h-[3vw] sm:h-[9vw] duration-300 cursor-pointer text-red-500 ri-heart-3-fill`}
          ></i>
        ) : (
          <i
            onClick={() => likehandle2(d)}
            className={`text-xl m-auto flex w-[3vw] sm:w-[9vw] rounded-full justify-center items-center h-[3vw] sm:h-[9vw] duration-300 cursor-pointer text-zinc-300 ri-heart-3-fill`}
          ></i>
        )}
      </div>
    ))}
  </div>

  <motion.div
        className={
          songlink.length > 0
            ? `duration-700 flex  fixed z-[99] bottom-0  gap-3 items-center  w-full backdrop-blur-xl  py-3 sm:h-[30vh] max-h-[30vh]  `
            : "block"
        }
      >
        {songlink?.map((e, i) => (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            key={i}
            className="flex sm:block w-full sm:w-full sm:h-full items-center justify-center gap-3"
          >
            <motion.div
              initial={{ x: -50, opacity: 0, scale: 0 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              className="w-[25vw] sm:w-full  flex gap-3 items-center sm:justify-center rounded-md  h-[7vw] sm:h-[30vw]"
            >
              <p className="text-green-400">{index+1}</p>
              <motion.img
                initial={{ x: -50, opacity: 0, scale: 0 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                className="rounded-md  h-[7vw] sm:h-[25vw]"
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
                className="hidden sm:flex  cursor-pointer  items-center justify-center bg-green-700 sm:w-[9vw] sm:h-[9vw] w-[3vw] h-[3vw]   rounded-full text-2xl ri-download-line"
              ></i>

              <i
                onClick={() => likehandle(e)}
                className={`text-xl hover:scale-150 sm:hover:scale-100 duration-300 cursor-pointer ${
                  like ? "text-red-500" : "text-zinc-300"
                }  ri-heart-3-fill`}
              ></i>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-[35%] sm:w-full h-[10vh] flex gap-3 sm:gap-1 items-center justify-center"
        >
          <i
            onClick={() => pre()}
            className="text-3xl text-white bg-zinc-800 cursor-pointer rounded-full ri-skip-back-mini-fill"
          ></i>
          <audio
            className="w-[80%]"
            ref={audioRef}
            onPause={() => setaudiocheck(false)}
            onPlay={() => setaudiocheck(true)}
            controls
            autoPlay
            onEnded={() => next()}
            src={e?.downloadUrl[4]?.url}
          ></audio>
          <i
            onClick={() => next()}
            className="text-3xl text-white bg-zinc-800 cursor-pointer rounded-full ri-skip-right-fill"
          ></i>
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
                      e.name + " 320kbps"
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
  ) : (
    <Loading />
  );
};

export default AlbumDetails;

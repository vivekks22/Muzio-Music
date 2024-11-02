import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, json, useNavigate } from "react-router-dom";
import logo from "./../../public/music.png";
import axios from "axios";
import Loading from "./Loading";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import wavs from "../../public/wavs.gif";
import wait from "../../public/wait.gif";
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

const Home = () => {
  let navigate = useNavigate();
  const [home, sethome] = useState(null);
  const [language, setlanguage] = useState("malayalam");
  const [details, setdetails] = useState([]);
  const [songlink, setsonglink] = useState([]);
  const [songlink2, setsonglink2] = useState([]);
  // const [songlinkchecker, setsonglinkchecker] = useState(null);
  const [like, setlike] = useState(false);
  var [index, setindex] = useState("");
  var [index2, setindex2] = useState("");
  var [page, setpage] = useState(1);
  var [page2, setpage2] = useState(Math.floor(Math.random() * 50));
  const audioRef = useRef();
  const [audiocheck, setaudiocheck] = useState(true);
  // const [selectedSongIds, setSelectedSongIds] = useState([]);
  const [suggSong, setsuggSong] = useState([]);

  const options = [
    // "malayalam",
    // "english",
    // "punjabi",
    // "tamil",
    // "telugu",
    // "marathi",
    // "gujarati",
    // "bengali",
    // "kannada",
    // "bhojpuri",
    // "malayalam",
    // "urdu",
    // "haryanvi",
    // "rajasthani",
    // "odia",
    // "assamese",

    "malayalam",
    "english",
     "tamil",
     "telugu",
     "hindi",
  ];

  const Gethome = async () => {
    detailsseter();
    try {
      const { data } = await axios.get(
        `https://jiosaavan-harsh-patel.vercel.app/modules?language=${language}`
      );
      sethome(data.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  const Getdetails = async () => {
    try {
      // const { data } = await axios.get(
      //   `https://saavn.dev/search/songs?query=${language}&page=${page}&limit=20`
      // );
      const { data } = await axios.get(
        `https://jiosaavan-api-2-harsh-patel.vercel.app/api/search/songs?query=${language}&page=${
          language === "english" ? page : page2
        }&limit=20`
      );
      // setdetails((prevState) => [...prevState, ...data.data.results]);
      const newData = data.data.results.filter(
        (newItem) => !details.some((prevItem) => prevItem.id === newItem.id)
      );

      setdetails((prevState) => [...prevState, ...newData]);
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
      setindex2(null);
      // setsonglinkchecker(1);
      setsonglink2([]);
      setindex(i);
      setsonglink([details[i]]);
    }
  }

  function audioseter2(i) {
    if (songlink2[0]?.id === suggSong[i].id) {
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
      setindex(null);
      // setsonglinkchecker(2);
      setsonglink([]);
      setindex2(i);
      setsonglink2([suggSong[i]]);
    }
  }

  // Function to get a random subset of IDs without duplicates
  function getRandomIds(ids, num) {
    let shuffled = ids.sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, num); // Return a subset of the shuffled array
  }

  // Main function to handle liked song IDs
  function processLikedSongIds() {
    // Get liked songs from localStorage
    const likedSongs = JSON.parse(localStorage.getItem("likeData")) || [];

    // Extract song IDs
    const songIds = likedSongs.map((song) => song.id);

    // Remove duplicates by converting to Set and back to Array
    const uniqueSongIds = Array.from(new Set(songIds));

    let selectedIds;

    if (uniqueSongIds.length <= 10) {
      // If less than or equal to 10 liked songs, select all IDs
      selectedIds = uniqueSongIds;
    } else {
      // If more than 10 liked songs, randomly select 10 IDs
      selectedIds = getRandomIds(uniqueSongIds, 10);
    }

    // Store selected IDs back to localStorage
    localStorage.setItem("selectedSongIds", JSON.stringify(selectedIds));
    fetchAllSongs();
    return selectedIds;
  }

  const fetchAllSongs = async () => {
    const storedSelectedSongIds =
      JSON.parse(localStorage.getItem("selectedSongIds")) || [];
    // console.log(storedSelectedSongIds);
  
    // Use a Set to keep track of unique songs
    const seenSongs = new Set();
    
    for (const id of storedSelectedSongIds) {
      try {
        const response = await axios.get(
          `https://jiosaavan-api-2-harsh-patel.vercel.app/api/songs/${id}/suggestions`
        );
  
        const newSongs = response.data.data.filter(song => {
          if (seenSongs.has(song.id)) {
            return false; // Song is a duplicate
          } else {
            seenSongs.add(song.id);
            return true; // Song is unique
          }
        });
  
        setsuggSong(prevState => [...prevState, ...newSongs]);
      } catch (error) {
        console.error(`Error fetching data for ID ${id}:`, error);
      }
    }
  };
  

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
    
      // Customized premium toast notification
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
          display: "flex", // Flexbox layout for centering
          alignItems: "center", // Center vertically
          justifyContent: "center", // Center horizontally
          lineHeight: "1.2", // Improved line height for readability
          borderLeft: "5px solid #4caf50", // Green accent for "added" action
        },
      });
          
    } else {
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
        //   console.log("Song removed successfully.");
        // toast.success(`Song (${i?.name}) removed successfully. 🚮`);
        // toast(`Song (${i?.name}) removed successfully. 🚮`, {
        //   icon: '⚠️',
        // });

        toast(`Song (${i?.name}) removed successfully.`, {
          icon: "⚠️",
          duration: 1500,
          position: "bottom-center", // Position at the bottom center of the screen
          style: {
            borderRadius: "10px", // Rounded corners for a premium look
            width: "fit-content", // Auto-size based on content
            maxWidth: "80%", // Prevents it from being too wide on larger screens
            background: "linear-gradient(135deg, #333, #444)", // Smooth gradient for depth
            color: "#e0e0e0", // Light color for text
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.7)", // Shadow for depth effect
            padding: "12px 20px", // Extra padding for spacing
            fontSize: "0.9rem", // Consistent font size
            fontWeight: "bold", // Bold text for emphasis
            textAlign: "center", // Center text for alignment
            display: "flex", // Flexbox layout for better alignment
            alignItems: "center", // Center align items vertically
            justifyContent: "center", // Center align items horizontally
            lineHeight: "1.2", // Line height for better readability
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
  

  // function SongLike(e) {
  //   console.log(e);
  //   // Check if the song is already liked (exists in localStorage)
  //   const isLiked = localStorage.getItem('likeData') && JSON.parse(localStorage.getItem('likeData')).some(item => item.id === e.id);
  //   console.log(isLiked);
  // }

  // const initializeMediaSession = () => {
  //   if ("mediaSession" in navigator) {
  //     navigator.mediaSession.metadata = new MediaMetadata({
  //       title: songlink[0]?.name || "",
  //       artist: songlink[0]?.album?.name || "",
  //       artwork: [
  //         {
  //           src: songlink[0]?.image[2]?.url || "",
  //           sizes: "512x512",
  //           type: "image/jpeg",
  //         },
  //       ],
  //     });

  //     navigator.mediaSession.setActionHandler("play", function () {
  //       // Handle play action
  //       if (audioRef.current) {
  //         audioRef.current.play().catch((error) => {
  //           console.error("Play error:", error);
  //         });
  //       }
  //     });

  //     navigator.mediaSession.setActionHandler("pause", function () {
  //       // Handle pause action
  //       if (audioRef.current) {
  //         audioRef.current.pause().catch((error) => {
  //           console.error("Pause error:", error);
  //         });
  //       }
  //     });

  //     navigator.mediaSession.setActionHandler("previoustrack", function () {
  //       pre();
  //     });

  //     navigator.mediaSession.setActionHandler("nexttrack", function () {
  //       next();
  //     });
  //   } else {
  //     console.warn("MediaSession API is not supported.");
  //   }
  // };
  const initializeMediaSession = () => {
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);

    if (!isIOS && "mediaSession" in navigator) {
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
      console.warn("MediaSession API is not supported or the device is iOS.");
    }
  };

  const initializeMediaSession2 = () => {
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);

    if (!isIOS && "mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: songlink2[0]?.name || "",
        artist: songlink2[0]?.album?.name || "",
        artwork: [
          {
            src: songlink2[0]?.image[2]?.url || "",
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
        pre2();
      });

      navigator.mediaSession.setActionHandler("nexttrack", function () {
        next2();
      });
    } else {
      console.warn("MediaSession API is not supported or the device is iOS.");
    }
  };
  
  function next() {
    if (index < details.length - 1) {
      setindex(index++);
      audioseter(index);
      // audioRef.current.play()
      // initializeMediaSession();
    } else {
      setindex(0);
      setsonglink([details[0]]);
      // audioRef.current.play()
      // initializeMediaSession();
    }
  }
  function next2() {
    if (index2 < suggSong.length - 1) {
      setindex2(index2++);
      audioseter2(index2);
      // audioRef.current.play()
      // initializeMediaSession();
    } else {
      setindex2(0);
      setsonglink2([suggSong[0]]);
      // audioRef.current.play()
      // initializeMediaSession();
    }
  }

  function pre() {
    if (index > 0) {
      setindex(index--);
      audioseter(index);
      // audioRef.current.play()
      // initializeMediaSession();
    } else {
      setindex(details.length - 1);
      setsonglink([details[details.length - 1]]);
      // audioRef.current.play()
      // initializeMediaSession();
    }
  }
  function pre2() {
    if (index2 > 0) {
      setindex2(index2--);
      audioseter2(index2);
      // audioRef.current.play()
      // initializeMediaSession();
    } else {
      setindex2(suggSong.length - 1);
      setsonglink2([suggSong[suggSong.length - 1]]);
      // audioRef.current.play()
      // initializeMediaSession();
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
        error: <b>Error downloading song.</b>, // Error message
      }
    );
  };

  function detailsseter() {
    setpage(1);
    setindex("");
    setindex2("");
    setsonglink([]);
    setsonglink2([]);
    setdetails([]);
    setsuggSong([]);
  }

  function seccall() {
    const intervalId = setInterval(() => {
      if (home === null) {
        // sethome([])
        Getartists();
      }
    }, 1000);
    return intervalId;
  }
  function seccall2() {
    const intervalId2 = setInterval(
      () => {
        if (details.length >= 0 && page < 20) {
          setpage2(Math.floor(Math.random() * 50));
          setpage(page + 1);
          Getdetails();
        }
      },
      page <= 2 ? 500 : 2000
    );
    return intervalId2;
  }
  

  useEffect(() => {
    var interval = seccall();
    //  Gethome();
    //  Gethome();
    return () => clearInterval(interval);
  }, [language, home]);

  useEffect(() => {
    Gethome();
  }, [language]);

  useEffect(() => {
    var interval2 = seccall2();

    return () => clearInterval(interval2);
  }, [details, page, language]);

  useEffect(() => {
    likeset(songlink[0]);
  }, [songlink]);

  useEffect(() => {
    likeset(songlink2[0]);
  }, [songlink2]);

  useEffect(() => {
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);

    if (!isIOS && songlink.length > 0) {
      audioRef.current.play();
      initializeMediaSession();
    }
  }, [songlink]);

  useEffect(() => {
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);

    if (!isIOS && songlink2.length > 0) {
      audioRef.current.play();
      initializeMediaSession2();
    }
  }, [songlink2]);
  

  useEffect(() => {
    // Call the function to process liked song IDs
    processLikedSongIds();
    // console.log('Selected Song IDs:', selectedIds);
  }, [language]);

  // useEffect(() => {
  //   initializeMediaSession();
  // }, [songlink]);

  // useEffect(() => {
  //   Getdetails();
  //   Getartists();
  // }, [language]);

  // useEffect(() => {
  //   var interval = seccall();

  //   return () => clearInterval(interval);
  // }, [details, page, language]);

  // useEffect(() => {
  //   var interval2 = seccall2();

  //   return () => clearInterval(interval2);
  // }, [details, page, language]);

  var title = songlink[0]?.name;
  document.title = `${title ? title : "Muzio"}`;
  // console.log(details);
  // console.log(home);
  // console.log(page);
  // console.log(page2);
  // console.log(songlink);
  // console.log(index)
  // console.log(suggSong);
  // console.log(songlinkchecker);
  

  return details.length > 0 ? (
    <div className="w-full h-screen bg-black">
  <Toaster position="top-center" reverseOrder={false} />
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ ease: Circ.easeIn, duration: 0.5 }}
    className="logo fixed z-[99] top-0 w-full duration-700 max-h-[20vh] flex sm:block backdrop-blur-xl py-3 px-10 sm:px-5 items-center gap-3"
  >
    <div className="flex items-center sm:justify-center sm:pt-2 gap-3">
      <img className="w-[5vw] sm:w-[10vw] rounded-full" src={logo} alt="" />
      <h1 className="text-2xl text-white p-2 rounded-full bg-black sm:text-xl font-black">
        Muzio
      </h1>
    </div>

    <motion.div
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ ease: Circ.easeIn, duration: 1 }}
  className="sm:flex sm:pt-3 text-zinc-400 sm:justify-center mx-4 sm:mx-0 space-y-2 sm:space-y-0 sm:space-x-4 rounded-lg backdrop-blur-lg p-4"
>
  <h3 className="inline text-xl sm:hidden text-neutral-300 font-bold">Search</h3>
  <Link
    className="text-lg sm:text-sm font-semibold p-2 rounded-md hover:text-white duration-300 text-neutral-300 transition-all"
    to="/songs"
  >
    Songs
  </Link>
  <Link
    className="text-lg sm:text-sm font-semibold p-2 rounded-md hover:text-white duration-300 text-neutral-300 transition-all"
    to="/playlist"
  >
    Playlists
  </Link>
  <Link
    className="text-lg sm:text-sm font-semibold p-2 rounded-md hover:text-white duration-300 text-neutral-300 transition-all"
    to="/artists"
  >
    Artists
  </Link>
  <Link
    className="text-lg sm:text-sm font-semibold p-2 rounded-md hover:text-white duration-300 text-neutral-300 transition-all"
    to="/album"
  >
    Album
  </Link>
  <Link
    className="text-lg sm:text-sm font-semibold p-2 rounded-md hover:text-white duration-300 text-neutral-300 transition-all"
    to="/likes"
  >
    Likes
  </Link>
</motion.div>


      </motion.div>
      <div className="w-full  bg-black  min-h-[63vh] pt-[20vh] pb-[30vh]   text-zinc-300 p-5 flex flex-col gap-5 overflow-auto ">
        <div className="w-full   flex justify-end ">
          <Dropdown
            className="w-[15%] text-sm sm:w-[50%]"
            options={options}
            onChange={(e) => setlanguage(e.value)}
            placeholder={language ? ` ${language}  ` : "Select language"}
          />
        </div>

        <div className="trending songs flex flex-col gap-3 w-full">
  <h3 className="text-xl h-[5vh] font-semibold">{language} Songs</h3>
  <motion.div className="songs px-5 sm:px-3 flex flex-shrink gap-5 overflow-x-auto overflow-hidden w-full">
    {details?.map((t, i) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} // Start slightly smaller and below
        whileInView={{ opacity: 1, scale: 1, y: 0 }} // Fade in and slide up
        transition={{ type: "spring", stiffness: 100, damping: 15 }} // Spring effect for natural movement
        onClick={() => audioseter(i)}
        key={i}
        className="relative hover:scale-105 duration-200 flex-shrink-0 w-[15%] sm:w-[40%] rounded-md flex flex-col gap-1 py-4 cursor-pointer"
      >
        <motion.img
          className="relative w-full rounded-md"
          src={t.image[2].url}
          alt=""
        />
        <div className="flex items-center">
          <p className="text-green-400">{i + 1}</p>
        </div>

        <img
          className={`absolute top-4 w-[20%] sm:w-[25%] rounded-md ${i === index ? "block" : "hidden"}`}
          src={wavs}
          alt=""
        />
        {songlink.length > 0 && (
          <i
            className={`absolute top-20 sm:top-16 w-full flex items-center justify-center text-5xl opacity-90 duration-300 rounded-md ${
              t.id === songlink[0]?.id ? "block" : "hidden"
            } ${
              audiocheck
                ? "ri-pause-circle-fill"
                : "ri-play-circle-fill"
            }`}
          ></i>
        )}
                <motion.div
                  //  initial={{ y: 50, scale:0}}
                  //  whileInView={{ y: 0,scale: 1 }}
                  //  transition={{ease:Circ.easeIn,duration:0.05}}
                  className="flex flex-col"
                >
                  <h3
                    className={`text-sm sm:text-xs leading-none  font-bold ${
                      i === index && "text-green-300"
                    }`}
                  >
                    {t.name}
                  </h3>
                  <h4 className="text-xs sm:text-[2.5vw] text-zinc-300 ">
                    {t.album.name}
                  </h4>
                </motion.div>
              </motion.div>
            ))}

            <img
              className={page >= 18 ? "hidden" : "w-[20%] h-[20%]"}
              src={wait}
            />
          </motion.div>
        </div>

        {
  <div className="trending flex flex-col gap-3 w-full">
    <h3 className="text-xl h-[5vh] font-semibold">Trending Albums</h3>
    <motion.div className="playlistsdata px-5 sm:px-3 flex flex-shrink gap-5 overflow-x-auto overflow-hidden w-full">
      {home?.trending?.albums.map((t, i) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }} // Start slightly smaller and below
          whileInView={{ opacity: 1, scale: 1, y: 0 }} // Fade in and slide up
          transition={{ type: "spring", stiffness: 100, damping: 15 }} // Spring effect for natural movement
          key={i}
          className="relative hover:scale-105 duration-200 flex-shrink-0 w-[15%] sm:w-[40%] rounded-md flex flex-col gap-1 py-4 cursor-pointer"
        >
          <img
            className="w-full rounded-md"
            src={t.image[2].link}
            alt=""
          />
        </motion.div>
      ))}
    </motion.div>
  </div>
}

<div className="charts w-full flex flex-col gap-3">
  <h3 className="text-xl h-[5vh] font-semibold">Charts</h3>
  <motion.div className="chartsdata px-5 sm:px-3 flex flex-shrink gap-5 overflow-x-auto overflow-hidden w-full">
    {home?.charts?.map((c, i) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} // Start slightly smaller and below
        whileInView={{ opacity: 1, scale: 1, y: 0 }} // Fade in and slide up
        transition={{ type: "spring", stiffness: 100, damping: 15 }} // Spring effect for natural movement
        onClick={() => navigate(`/playlist/details/${c.id}`)}
        key={i}
        className="hover:scale-105 duration-200 flex-shrink-0 w-[15%] sm:w-[40%] rounded-md flex flex-col gap-2 py-4 cursor-pointer"
      >
        <img
          className="w-full rounded-md"
          src={c.image[2].link}
          alt=""
        />
        <motion.h3 className="leading-none">{c.title}</motion.h3>
      </motion.div>
    ))}
  </motion.div>
</div>

<div className="playlists w-full flex flex-col gap-3">
  <h3 className="text-xl h-[5vh] font-semibold">Playlists</h3>
  <motion.div className="playlistsdata px-5 sm:px-3 flex flex-shrink gap-5 overflow-x-auto overflow-hidden w-full">
    {home?.playlists?.map((p, i) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} // Start slightly smaller and below
        whileInView={{ opacity: 1, scale: 1, y: 0 }} // Fade in and slide up
        transition={{ type: "spring", stiffness: 100, damping: 15 }} // Spring effect for natural movement
        onClick={() => navigate(`/playlist/details/${p.id}`)}
        key={i}
        className="hover:scale-105 duration-200 flex-shrink-0 w-[15%] sm:w-[40%] rounded-md flex flex-col gap-2 py-4 cursor-pointer"
      >
        <img
          className="w-full rounded-md"
          src={p.image[2].link}
          alt=""
        />
        <motion.h3 className="leading-none">{p.title}</motion.h3>
      </motion.div>
    ))}
  </motion.div>
</div>

<div className="albums w-full flex flex-col gap-3">
  <h3 className="text-xl h-[5vh] font-semibold">Albums</h3>
  <motion.div className="albumsdata px-5 sm:px-3 flex flex-shrink gap-5 overflow-x-auto overflow-hidden w-full">
    {home?.albums?.map((a, i) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} // Start slightly smaller and below
        whileInView={{ opacity: 1, scale: 1, y: 0 }} // Fade in and slide up
        transition={{ type: "spring", stiffness: 100, damping: 15 }} // Spring effect for natural movement
        onClick={() => navigate(`/albums/details/${a.id}`)}
        key={i}
        className="hover:scale-105 duration-200 flex-shrink-0 w-[15%] sm:w-[40%] rounded-md flex flex-col gap-2 py-4 cursor-pointer"
      >
        <img
          className="w-full rounded-md"
          src={a.image[2].link}
          alt=""
        />
        <motion.h3 className="leading-none">{a.name}</motion.h3>
      </motion.div>
    ))}
  </motion.div>
</div>

<div
  style={{
    padding: '15px', // Padding for spacing
    margin: '20px 0', // Space around the note
    display: 'flex', // Flexbox for centering
    justifyContent: 'center', // Center the content
    width: '100%', // Full width
  }}
>
  <p
    style={{
      fontWeight: '500', // Medium weight text
      color: 'rgba(255, 255, 255, 0.6)', // Faded white color
      textAlign: 'center', // Center the text
      lineHeight: '1.5', // Increase line height for readability
      margin: 0, // Remove default margin
    }}
  >
    <b>Muzio</b> is not affiliated with JioSaavn. All trademarks and copyrights belong to their respective owners. All media, images, and songs are the property of their respective owners. This site is for educational purposes only.
  </p>
</div>
</div>

     <motion.div
        className={
          songlink.length > 0
            ? `duration-700 fixed  z-[99] bottom-0  flex  gap-3 items-center  w-full max-h-[30vh] py-3  backdrop-blur-xl `
            : "block"
        }
      >
        {songlink?.map((e, i) => (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ ease: Circ.easeIn, duration: 0.7 }}
            key={i}
            className={`flex sm:block w-full sm:w-full sm:h-full items-center justify-center gap-3`}
          >
            <motion.div
              initial={{ x: -100, opacity: 0, scale: 0 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              // transition={{ease:Circ.easeIn,duration:1}}

              className="w-[25vw] sm:w-full  flex gap-3 items-center sm:justify-center rounded-md  h-[7vw] sm:h-[30vw]"
            >
              <p className=" text-green-400">{index + 1}</p>
              <motion.img
                initial={{ x: -100, opacity: 0, scale: 0 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                // transition={{ease:Circ.easeIn,duration:1}}

                className={`rounded-md h-[7vw] sm:h-[25vw]`}
                src={e?.image[2]?.url}
                alt=""
              />

              <h3 className=" sm:w-[30%] text-white text-xs font-semibold">
                {e?.name}
              </h3>
              <i
                onClick={() => handleDownloadSong(e.downloadUrl[4].url, e.name)}
                className="hidden sm:visible sm:flex cursor-pointer  items-center justify-center bg-green-700 sm:w-[9vw] sm:h-[9vw] w-[3vw] h-[3vw]   rounded-full text-2xl ri-download-line"
              ></i>
              <i
                onClick={() => likehandle(e)}
                className={`text-xl hover:scale-150 sm:hover:scale-100 duration-300 cursor-pointer ${
                  like ? "text-red-500" : "text-zinc-300"
                }  ri-heart-3-fill`}
              ></i>
              {/* <i onClick={()=>navigate(`songs/details/${e.id}`)} className="text-zinc-300 text-xl hover:scale-150 sm:hover:scale-100 duration-300 cursor-pointer ri-information-fill"></i> */}

              {/* {localStorage.getItem("likeData") &&
              JSON.parse(localStorage.getItem("likeData")).some(
                (item) => item.id === e.id
              ) ? (
                <i
                  onClick={() => likehandle(e)}
                  className={`text-xl cursor-pointer text-red-500 ri-heart-3-fill`}
                ></i>
              ) : (
                <i
                  onClick={() => likehandle(e)}
                  className={`text-xl cursor-pointer text-zinc-300 ri-heart-3-fill`}
                ></i>
              )} */}

              {/* {like ? (
                <i
                  onClick={() => likehandle(e)}
                  className="text-xl cursor-pointer text-red-500 ri-heart-3-fill"
                ></i>
              ) : (
                <i
                  onClick={() => likehandle(e)}
                  className="text-xl cursor-pointer text-zinc-300  ri-heart-3-fill"
                ></i>
              )} */}
            </motion.div>
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              // transition={{ease:Circ.easeIn,duration:1}}
              className="w-[35%]  sm:w-full h-[10vh] flex gap-3 sm:gap-1 items-center justify-center"
            >
              <button
                onClick={pre}
                className="text-3xl text-white bg-zinc-800 cursor-pointer rounded-full"
              >
                <i className="ri-skip-back-mini-fill"></i>
              </button>
              <audio
                ref={audioRef}
                onPause={() => setaudiocheck(false)}
                onPlay={() => setaudiocheck(true)}
                className="w-[80%]"
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


      <motion.div
  className={`fixed z-50 bottom-0 flex items-center justify-between w-full px-6 py-4 bg-gradient-to-t from-black via-gray-900 to-gray-800 text-white shadow-lg ${
    songlink2.length > 0 ? "duration-700" : "hidden"
  }`}
>
  {songlink2?.map((e, i) => (
    <motion.div
      key={i}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.5 }}
      className="flex w-full items-center gap-6"
    >
      {/* Thumbnail and Song Details */}
      <div className="flex items-center gap-4 w-1/2">
        <motion.img
          src={e?.image[2]?.url}
          alt="song-thumbnail"
          className="w-16 h-16 rounded-md shadow-lg"
        />
        <div className="flex flex-col truncate">
          <h3 className="text-lg font-semibold truncate">{e?.name}</h3>
          <p className="text-sm text-gray-400 truncate">Artist Name</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center gap-6">
          {/* Previous Button */}
          <button
            onClick={pre2}
            className="text-gray-400 hover:text-white text-2xl transition transform hover:scale-110"
          >
            <i className="ri-skip-back-mini-line"></i>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={() => (audiocheck ? audioRef.current.pause() : audioRef.current.play())}
            className="text-3xl bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 transition"
          >
            {audiocheck ? (
              <i className="ri-pause-fill"></i>
            ) : (
              <i className="ri-play-fill"></i>
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={next2}
            className="text-gray-400 hover:text-white text-2xl transition transform hover:scale-110"
          >
            <i className="ri-skip-forward-fill"></i>
          </button>
        </div>

        {/* Gradient Progress Bar */}
        <div className="relative w-full h-1 mt-3 bg-gray-600 rounded-full overflow-hidden">
          <div className="absolute h-full w-1/2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
        </div>
      </div>

      {/* Additional Controls */}
      <div className="flex items-center gap-4 w-1/5 justify-end">
        {/* Like Button */}
        <button
          onClick={() => likehandle(e)}
          className={`text-2xl ${
            like ? "text-red-500" : "text-gray-400"
          } hover:text-red-500 transition transform hover:scale-110`}
        >
          <i className="ri-heart-3-fill"></i>
        </button>

        {/* Download Button */}
        <button
          onClick={() => handleDownloadSong(e.downloadUrl[4].url, e.name)}
          className="text-2xl text-gray-400 hover:text-green-400 transition transform hover:scale-110"
        >
          <i className="ri-download-line"></i>
        </button>
      </div>
    </motion.div>
  ))}
</motion.div>


    </div>
  ) : (
    <Loading />
  );
};


export default Home;

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import wavs from "../../public/wavs.gif";
import empty from "../../public/music.png";
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
import JSZip from "jszip";
import CryptoJS from 'crypto-js';
// import { saveAs } from 'file-saver';
// import { ID3Writer } from 'browser-id3-writer';
// import AdmZip from 'adm-zip';
// import fs from 'fs';
// import mm from 'music-metadata';

function Likes() {
  const navigate = useNavigate();
  let location = useLocation();

  const [details, setdetails] = useState([]);
  const [songs, setSongs] = useState([]);

  const [songlink, setsonglink] = useState([]);
  var [index, setindex] = useState("");
  var [rerender, setrerender] = useState(false);
  const [like, setlike] = useState(false);
  const [download, setdownload] = useState(false);
  const audioRef = useRef();
  const [audiocheck, setaudiocheck] = useState(true);
  const [shuffled, setShuffled] = useState(false);
const [shuffledSongs, setShuffledSongs] = useState([]);

  


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

//   const downloadSongsfile = () => {
//     if (details.length>0) {
      
//       toast(`Exporting...`, {
//         icon: "✅",
//         duration: 1500,
//         style: {
//           borderRadius: "10px",
//           background: "rgb(115 115 115)",
//           color: "#fff",
//         },
//       });
//     // Convert array to JSON string
//     const json = JSON.stringify(details);

//     // Create Blob object
//     const blob = new Blob([json], { type: 'application/json' });

//     // Create temporary URL for the Blob
//     const url = URL.createObjectURL(blob);

//     // Create a link element
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${details.length} songs.json`; // File name
//     document.body.appendChild(a);

//     // Click the link to initiate download
//     a.click();

//     // Remove the link element
//     document.body.removeChild(a);

//     // Revoke the temporary URL
//     URL.revokeObjectURL(url);
//     toast(`Exported successfully.`, {
//       icon: "✅",
//       duration: 1500,
//       style: {
//         borderRadius: "10px",
//         background: "rgb(115 115 115)",
//         color: "#fff",
//       },
//     });
//     }
//     else{
//       toast(`No songs available to Export`, {
//         icon: "❌",
//         duration: 1500,
//         style: {
//           borderRadius: "10px",
//           background: "rgb(115 115 115)",
//           color: "#fff",
//         },
//       });
//     }
// };

const downloadSongsfile = () => {
  if (details.length > 0) {
      const password = prompt(`Create A Password For Your File Protection 🔑 , Note : This Password Is Required At The Time Of Import Songs
      Please Enter Your Password 👇:`);
      if (!password) return; // Cancelled or empty password
      
      // Convert array to JSON string
      const json = JSON.stringify(details);

      // Encrypt the JSON data with the password
      const encryptedData = CryptoJS.AES.encrypt(json, password).toString();

      // Create Blob object
      const blob = new Blob([encryptedData], { type: 'text/plain' });

      // Create temporary URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a link element
      const a = document.createElement('a');
      a.href = url;
      a.download = `${details.length} muzio_playlist.json`; // File name
      document.body.appendChild(a);

      // Click the link to initiate download
      a.click();

      // Remove the link element
      document.body.removeChild(a);

      // Revoke the temporary URL
      URL.revokeObjectURL(url);

      toast(`Exported successfully.`, {
          icon: "✅",
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
  } else {
      toast(`No songs available to Export`, {
          icon: "❌",
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
};
function shuffleSongs() {
  // If a song is already playing, keep it as the first in the shuffled order
  let currentSong = songlink.length > 0 ? songlink[0] : null;
  let remainingSongs = details.filter(song => song.id !== currentSong?.id);

  // Shuffle the remaining songs
  const shuffledDetails = currentSong 
      ? [currentSong, ...remainingSongs.sort(() => Math.random() - 0.5)]
      : remainingSongs.sort(() => Math.random() - 0.5);

  // Update state to reflect shuffle mode
  setShuffledSongs(shuffledDetails);
  setShuffled(true);
  
  // If a song is currently playing, keep it as the active song
  if (currentSong) {
      setindex(0); // Start with the current song as the first in shuffled order
      setsonglink([currentSong]);
  } else {
      // If no song is currently selected, set the first song in shuffled list as the active song
      setindex(0);
      setsonglink([shuffledDetails[0]]);
  }
  
  toast.success("Shuffle mode activated 🎶");
}

function audioseter(i) {
  // Check if we're in shuffle mode and select the correct song
  if (shuffled) {
      // Find the song from shuffledSongs that matches the selected index
      setsonglink([shuffledSongs[i]]);
      setindex(i);
  } else {
      setsonglink([details[i]]);
      setindex(i);
  }
}

function next() {
  if (shuffled) {
      if (index < shuffledSongs.length - 1) {
          setindex(index + 1);
          setsonglink([shuffledSongs[index + 1]]);
      } else {
          setindex(0);
          setsonglink([shuffledSongs[0]]);
      }
  } else {
      if (index < details.length - 1) {
          setindex(index + 1);
          setsonglink([details[index + 1]]);
      } else {
          setindex(0);
          setsonglink([details[0]]);
      }
  }
}

function pre() {
  if (shuffled) {
      if (index > 0) {
          setindex(index - 1);
          setsonglink([shuffledSongs[index - 1]]);
      } else {
          setindex(shuffledSongs.length - 1);
          setsonglink([shuffledSongs[shuffledSongs.length - 1]]);
      }
  } else {
      if (index > 0) {
          setindex(index - 1);
          setsonglink([details[index - 1]]);
      } else {
          setindex(details.length - 1);
          setsonglink([details[details.length - 1]]);
      }
  }
}

<audio
    ref={audioRef}
    onPause={() => setaudiocheck(false)}
    onPlay={() => setaudiocheck(true)}
    controls
    autoPlay
    onEnded={next}
    src={songlink[0]?.downloadUrl[4]?.url}
></audio>







  // function likeset(e) {
  //   // console.log(e);
  //   var tf =
  //     localStorage.getItem("likeData") &&
  //     JSON.parse(localStorage.getItem("likeData")).some(
  //       (item) => item.id == e?.id
  //     );
  //   // console.log(tf);
  //   // console.log(e?.id);
  //   setlike(tf);
  //   // console.log(like);
  // }
  // function indexset() {
  //   setindex(details.findIndex((item) => item.id === songlink[0]?.id))
  // }

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
      toast.success("Song added to Likes section ✅ ");
    } else {
      setlike(true);
      // Otherwise, inform the user that the song is already liked
      //   console.log("You've already liked this song.");
      toast.error("You've already liked this song. ❌");
    }
  }

  // function removehandle(id) {
  //   // Retrieve existing data from localStorage
  //   let existingData = localStorage.getItem("likeData");

  //   // If no data exists, there's nothing to remove
  //   if (!existingData) {
  //     console.log("No data found in localStorage.");
  //     return;
  //   }
  //   // Parse the existing data from JSON
  //   let updatedData = JSON.parse(existingData);

  //   // Find the index of the song with the given ID in the existing data
  //   const indexToRemove = updatedData.findIndex((item) => item.id === id);

  //   // If the song is found, remove it from the array
  //   if (indexToRemove !== -1) {
  //     updatedData.splice(indexToRemove, 1);

  //     // Store the updated data back into localStorage
  //     localStorage.setItem("likeData", JSON.stringify(updatedData));
  //   //   console.log("Song removed successfully.");
  //     toast.success("Song removed successfully.🚮");
  //       setrerender(!rerender);
  //       setsonglink([]);

  //     // if (index>0 && details.length>=0) {
  //     //     setrerender(!rerender)
  //     //     var index2 = index-1
  //     //     setindex(index2);
  //     //     setsonglink([details[index2]]);
  //     // }
  //     // else{
  //     //     setrerender(!rerender)
  //     // }
  //   } else {
  //       toast.error("Song not found in localStorage.")
  //   //   console.log("Song not found in localStorage.");
  //     setsonglink([]);
  //    setrerender(!rerender);
  //   }
  // }

  function removehandle(i, ind) {
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
    const indexToRemove = updatedData.findIndex((item) => item.id === i);

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
          borderRadius: "10px", // Slightly rounded for a premium look
          width: "fit-content", // Auto-size based on content
          maxWidth: "80%", // Limit width for larger screens
          background: "rgba(50, 50, 50, 0.9)", // Dark background for contrast
          color: "#ffffff", // White text for readability
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.7)", // Shadow for depth
          padding: "12px 20px", // Extra padding for spacing
          fontSize: "0.9rem",
          fontWeight: "bold",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: "1.2", // Line height for better text readability
          borderLeft: "5px solid #ff9800", // Orange accent for "removed" action
        },
      });
      setrerender(!rerender);
      if (songlink[0].id != i) {
        setrerender(!rerender);
        if (index > ind) {
          setindex(index - 1);
        }
        // else{
        //   setindex(details.findIndex((item) => item.id === songlink[0].id)+1)
        // }
      } else {
        setrerender(!rerender);
        setsonglink([]);
      }
      // setsonglink([]);

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
      setsonglink([]);
      setrerender(!rerender);

      //   console.log("Song not found in localStorage.");
    }
  }

  function emptyfile() {
    toast.error("it's empty, liked songs will be shown in this page 👇");
  }

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

    if ("mediaSession" in navigator && !isIOS) {
        // For Android and supported environments
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

        navigator.mediaSession.setActionHandler("play", () => {
            if (audioRef.current) {
                audioRef.current.play().catch(error => {
                    console.error("Play error:", error);
                });
            }
        });

        navigator.mediaSession.setActionHandler("pause", () => {
            if (audioRef.current) {
                audioRef.current.pause().catch(error => {
                    console.error("Pause error:", error);
                });
            }
        });

        navigator.mediaSession.setActionHandler("previoustrack", pre);
        navigator.mediaSession.setActionHandler("nexttrack", next);

    } else if (isIOS) {
        // iOS-specific fallback for displaying metadata directly on the page
        console.warn("MediaSession API is not supported on iOS. Using fallback UI.");

        // Display metadata within the web page for iOS users
        const fallbackContainer = document.getElementById("ios-media-fallback");
        if (fallbackContainer) {
            fallbackContainer.innerHTML = `
                <div class="media-info">
                    <img src="${songlink[0]?.image[2]?.url || ''}" alt="Album Art" class="album-art" />
                    <div>
                        <h4>${songlink[0]?.name || 'Unknown Title'}</h4>
                        <p>${songlink[0]?.album?.name || 'Unknown Artist'}</p>
                    </div>
                </div>
            `;
            fallbackContainer.style.display = 'block'; // Make the fallback visible for iOS
        }
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

  // const handleDownloadSong = async (url, name, img) => {
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
        success: <b>Song Downloaded ✅</b>, // Success message
        error: <b>Error downloading song.</b>, // Error message
      }
    );
  };

  useEffect(() => {
    // Retrieve all data from localStorage
    const allData = localStorage.getItem("likeData");

    // Check if data exists in localStorage
    if (allData) {
      // Parse the JSON string to convert it into a JavaScript object
      const parsedData = JSON.parse(allData);
      // Now you can use the parsedData object
      setdetails(parsedData.reverse());
      // setSongs(parsedData.reverse());
      const extractedSongs = parsedData.map((song) => ({
        title: song.name,
        url: song.downloadUrl[4].url,
        image: song.image[2].url,
        artist: song.artists.primary.map((artist) => artist.name).join(" , "),
        album: song.album.name,
        year: song.year,
      }));
      setSongs(extractedSongs);
      // console.log((details.findIndex((item) => item.id === songlink[0].id)))
    } else {
      console.log("No data found in localStorage.");
    }
  }, [rerender, songlink]);

  useEffect(() => {
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);

    if (!isIOS && songlink.length > 0) {
      audioRef.current.play();
      initializeMediaSession();
    }
  }, [songlink]);

  // const downloadSongs = () => {
  //   if (songs.length > 0) {
  //     setdownload(true);
  //     toast.success("Downloading songs");
  //     // Create a zip file
  //     const zip = new JSZip();
  //     const promises = [];

  //     // Add each song to the zip file
  //     songs.forEach((song) => {
  //       const { title, url } = song;
  //       // toast.success(`Song ${title} Downloading...`);
  //       const promise = fetch(url)
  //         .then((response) => response.blob())
  //         .then((blob) => {
  //           zip.file(`${title} (320kbps).mp3`, blob, { binary: true });
  //         })
  //         .catch((error) => toast.error("Error downloading song:", error));
  //       promises.push(promise);
  //       // toast.success(`Song ${title} Downloaded ✅`);
  //     });

  //     // Wait for all promises to resolve before generating the zip file
  //     Promise.all(promises).then(() => {
  //       // Generate the zip file and initiate download
  //       zip.generateAsync({ type: "blob" }).then((content) => {
  //         const zipUrl = window.URL.createObjectURL(content);
  //         const link = document.createElement("a");
  //         link.href = zipUrl;
  //         link.download = "songs.zip";
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //         setdownload(false);
  //         toast.success("Download songs completed successfully");
  //       });
  //     });
  //   } else {
  //     toast.error("No songs available to download");
  //   }
  // };


  const downloadSongs = () => {
    if (songs.length > 0) {
      return toast.promise(
        new Promise(async (resolve, reject) => {
          try {
            // Display initial message

            // Create a zip file
            const zip = new JSZip();
            const promises = [];

            // Add each song to the zip file
            songs.forEach((song) => {
              const { title, url } = song;
              const promise = fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                  zip.file(`${title} (320kbps).mp3`, blob, { binary: true });
                })
                .catch((error) => {
                  // Display error message for individual song download
                  toast.error(`Error downloading ${title}: ${error}`);
                });
              promises.push(promise);
            });

            // Wait for all promises to resolve before generating the zip file
            await Promise.all(promises);

            // Generate the zip file and initiate download
            const content = await zip.generateAsync({ type: "blob" });
            const zipUrl = window.URL.createObjectURL(content);
            const link = document.createElement("a");
            link.href = zipUrl;
            link.download = "songs.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Resolve the promise after successful download
            resolve();
          } catch (error) {
            // Reject the promise if any error occurs
            reject("Error downloading songs");
          }
        }),
        {
          loading: `Downloading songs`, // Loading message
          success: "Download songs completed successfully ✅", // Success message
          error: "Error downloading songs", // Error message
        }
      );
    } else {
      // Display error message if no songs available
      return toast.error("No songs available to download");
    }
  };

  var title = songlink[0]?.name;
  document.title = `${title ? title : "Muzio"}`;
  //   console.log(details);
  //   console.log(rerender);
  // console.log(index);
  // console.log(download);
  // console.log(songlink);

  // console.log(songlink[0]?.id);
  return (
    <div className="w-full h-screen bg-black">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full justify-between px-3 fixed z-[99] backdrop-blur-xl flex items-center gap-3 sm:h-[7vh]  h-[10vh]">
        <div className="flex items-center gap-3">
          <i
            onClick={() => navigate("/")}
            className="text-3xl cursor-pointer  bg-green-500 rounded-full ri-arrow-left-line"
          ></i>
          <h1 className="text-xl text-zinc-300 sm:text-xs font-black">
            Muzio
          </h1>
        </div>
        <div className="w-fit flex gap-3">
  <button
    className="hover:scale-105 duration-300 inline-block w-fit h-fit text-md sm:text-sm rounded-md p-3 font-semibold bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg hover:brightness-125 transition-all"
    onClick={downloadSongs}
    disabled={download}
  >
    {download ? "Downloading..." : "Download All Songs"}
  </button>
  
  {/*
  <button
    className="hover:scale-105 duration-300 inline-block w-fit h-fit text-md sm:text-sm rounded-md p-3 font-semibold bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg hover:brightness-125 transition-all"
    onClick={() => navigate("/import")}
  >
    Import Songs
  </button>
  
  <button
    className="hover:scale-105 duration-300 inline-block w-fit h-fit text-md sm:text-sm rounded-md p-3 font-semibold bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg hover:brightness-125 transition-all"
    onClick={downloadSongsfile}
  >
    Export Songs
  </button>

  */}
  
  <button
    className="hover:scale-105 duration-300 inline-block w-fit h-fit text-md sm:text-sm rounded-md p-3 font-semibold bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg hover:brightness-125 transition-all"
    onClick={shuffleSongs}
  >
    Shuffle Songs
  </button>
</div>

      </div>

      {details.length > 0 ? (
  <div className="flex w-full text-white p-10 pt-[15vh] pb-[30vh] sm:pt-[10vh] sm:pb-[35vh] sm:p-3 sm:gap-3 bg-black min-h-[60vh] overflow-y-auto flex-wrap gap-5 justify-center">
  {details.map((d, i) => (
    <div
      title="Click on song image or name to play the song"
      key={i}
      className="relative flex flex-col items-center justify-between w-[18vw] h-[20vw] sm:w-[45vw] sm:h-[45vw] bg-slate-800 rounded-lg shadow-lg hover:shadow-xl shadow-gray-900 transition-transform duration-150 hover:scale-105 cursor-pointer overflow-hidden"
    >
      {/* Song Image */}
      <div onClick={() => audioseter(i)} className="relative w-full h-[90%] overflow-hidden"> {/* Increased height to 80% */}
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="w-full h-full object-cover" // Ensures full coverage of the image
          src={d.image[2].url}
          alt=""
        />
        <p className="absolute top-2 left-2 text-green-400 font-bold text-xs">{i + 1}</p>
        <img
                  className={`absolute top-0 w-[20%] sm:w-[22%] rounded-md ${
                    d.id === songlink[0]?.id ? "block" : "hidden"
                  } `}
                  src={wavs}
                  alt=""
                />
      </div>
      

      {/* Song Details */}
      <div className="flex flex-col items-center text-center p-2 w-full h-[25%]"> {/* Reduced height to 20% */}
        <h3 className={`text-sm font-bold ${d.id === songlink[0]?.id ? "text-green-300" : "text-white"}`}>
          {d.name}
        </h3>
        <h4 className="text-xs text-zinc-300">{d.album.name}</h4>
      </div>

      {/* Unlike Button */}
      <i
        title="Remove Song"
        onClick={() => removehandle(d.id, i)}
        className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-full duration-300 cursor-pointer text-zinc-300 ri-dislike-fill"
      ></i>

      {/* Play/Pause Button */}
      {songlink.length > 0 && (
        <i
          className={`absolute inset-0 flex items-center justify-center text-4xl text-white opacity-80 duration-300 ${
            d.id === songlink[0]?.id ? "block" : "hidden"
          } ${audiocheck ? "ri-pause-circle-fill" : "ri-play-circle-fill"}`}
        ></i>
      )}
    </div>
  ))}
</div>



      ) : (
        <div 
        onClick={() => emptyfile()}
        className="absolute w-[25%] sm:w-[60%] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2  cursor-pointer">
          <img
            className="rounded-md "
            src={empty}
          />
          <p className=" text-base font-bold text-zinc-300">it's empty , liked songs will be shown in this page</p>
        </div>
      )}
      {songlink !== null ? (
        <motion.div
          className={
            songlink.length > 0
              ? `duration-700 flex fixed z-[99] bottom-0    gap-3 items-center  w-full py-2 sm:h-[30vh] max-h-[30vh] backdrop-blur-xl `
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
                    handleDownloadSong(e?.downloadUrl[4].url, e?.name)
                  }
                  className="hidden sm:flex  cursor-pointer  items-center justify-center bg-green-700 sm:w-[9vw] sm:h-[9vw] w-[3vw] h-[3vw]   rounded-full text-2xl ri-download-line"
                ></i>

                {/* {like ? (
                  <i
                    title="You Liked This Song"
                    onClick={() => likehandle(e)}
                    className="text-xl hover:scale-150 sm:hover:scale-100 duration-300 cursor-pointer text-red-500 ri-heart-3-fill"
                  ></i>
                ) : (
                  <i
                    title="Like Song"
                    onClick={() => likehandle(e)}
                    className="text-xl hover:scale-150 sm:hover:scale-100 duration-300 cursor-pointer text-zinc-300  ri-heart-3-fill"
                  ></i>
                )} */}
                <i
                  title="Remove Song "
                  onClick={() => removehandle(e.id)}
                  className="text-xl hover:scale-150 sm:hover:scale-100 duration-300 cursor-pointer text-zinc-300 ri-dislike-fill"
                ></i>
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                className="w-[35%]  sm:w-full h-[10vh] flex gap-3 sm:gap-1 items-center justify-center"
              >
                <i
                  onClick={pre}
                  className="text-3xl text-white bg-zinc-800 cursor-pointer rounded-full ri-skip-back-mini-fill"
                ></i>
                <audio
                  className="w-[80%] "
                  ref={audioRef}
                  onPause={() => setaudiocheck(false)}
                  onPlay={() => setaudiocheck(true)}
                  controls
                  autoPlay
                  onEnded={next}
                  src={e?.downloadUrl[4]?.url}
                ></audio>
                <i
                  onClick={next}
                  className=" text-3xl text-white bg-zinc-800 cursor-pointer rounded-full ri-skip-right-fill"
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
                      handleDownloadSong(
                        e.downloadUrl[0].url,
                        e.name + " (12kbps)"
                      )
                    }
                    className="duration-300 cursor-pointer hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                  >
                    12kbps <br />
                    <p className="text-xs">Very low quality</p>
                  </p>
                  <p
                    onClick={() =>
                      handleDownloadSong(
                        e.downloadUrl[1].url,
                        e.name + " (48kbps)"
                      )
                    }
                    className="duration-300 cursor-pointer  hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                  >
                    48kbps <br />
                    <p className="text-xs">Low quality</p>
                  </p>
                  <p
                    onClick={() =>
                      handleDownloadSong(
                        e.downloadUrl[2].url,
                        e.name + " (96kbps)"
                      )
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
                        e.name + " (160kbps)"
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
                        e.name + " (320kbps)"
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
      ) : (
        <h1>NO DATA</h1>
      )}
    </div>
  );
}

export default Likes;

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const MusicPlayer = () => {
    const location = useLocation();
    const songs = location.state?.songs || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const audioRef = useRef(new Audio(songs[0]?.downloadUrl[4]?.url));

    const playAudio = () => {
        audioRef.current.play();
    };

    const pauseAudio = () => {
        audioRef.current.pause();
    };

    const nextSong = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
    };

    const prevSong = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    };

    // Initialize Media Session API
    const initializeMediaSession = () => {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: songs[currentIndex]?.name || "",
                artist: songs[currentIndex]?.album?.name || "",
                artwork: [
                    {
                        src: songs[currentIndex]?.image[2]?.url || "",
                        sizes: "512x512",
                        type: "image/jpeg",
                    },
                ],
            });

            navigator.mediaSession.setActionHandler("play", playAudio);
            navigator.mediaSession.setActionHandler("pause", pauseAudio);
            navigator.mediaSession.setActionHandler("nexttrack", nextSong);
            navigator.mediaSession.setActionHandler("previoustrack", prevSong);
        }
    };

    useEffect(() => {
        if (songs.length > 0) {
            audioRef.current.src = songs[currentIndex]?.downloadUrl[4]?.url;
            playAudio();
            initializeMediaSession(); // Call to initialize media session

            return () => {
                audioRef.current.pause();
            };
        }
    }, [currentIndex, songs]);

    return (
        <div>
            <h2>{songs[currentIndex]?.name}</h2>
            <button onClick={prevSong}>Previous</button>
            <button onClick={nextSong}>Next</button>
            <audio ref={audioRef} controls autoPlay />
        </div>
    );
};

export default MusicPlayer;
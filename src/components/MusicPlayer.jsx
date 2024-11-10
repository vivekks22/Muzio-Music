import React, { useEffect, useRef, useState } from "react";

function MusicPlayer({ songs }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const audioRef = useRef(new Audio(songs[0]?.url));

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

    useEffect(() => {
        audioRef.current.src = songs[currentIndex]?.url;
        playAudio();

        // Media Session API integration
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: songs[currentIndex]?.title,
                artist: songs[currentIndex]?.artist,
                artwork: [{ src: songs[currentIndex]?.image }]
            });

            navigator.mediaSession.setActionHandler('play', playAudio);
            navigator.mediaSession.setActionHandler('pause', pauseAudio);
            navigator.mediaSession.setActionHandler('nexttrack', nextSong);
            navigator.mediaSession.setActionHandler('previoustrack', prevSong);
        }

        return () => {
            audioRef.current.pause();
        };
    }, [currentIndex]);

    return (
        <div>
            <h2>{songs[currentIndex]?.title}</h2>
            <button onClick={prevSong}>Previous</button>
            <button onClick={nextSong}>Next</button>
            <audio ref={audioRef} controls autoPlay />
        </div>
    );
}

export default MusicPlayer;
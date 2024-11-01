import React, { useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const Cards = ({ searches, query, requery }) => {
  const handleDownloadSong = async (url, name, img) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${name}.mp3`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.log("Error fetching or downloading files", error);
    }
  };

  return (
    <div>
      <style>{`
        /* General styles for the container */
        .cards-container {
          width: 100%;
          min-height: 85vh;
          padding: 2.5rem 1rem;
          color: #ffffff; /* White text for better readability */
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem; /* Gap between cards */
          background: #1a1a1a; /* Dark background for the overall container */
        }

        /* Individual card styling */
        .card {
          width: calc(20% - 1.5rem); /* Responsive width */
          min-width: 250px; /* Minimum card width */
          max-width: 300px; /* Limit the width of cards */
          height: auto; /* Height adjusts automatically */
          border-radius: 10px; /* Rounded corners */
          overflow: hidden;
          background: #2c2c3e; /* Darker background for cards */
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Shadow for depth */
          transition: transform 0.2s; /* Smooth transform on hover */
        }

        .card:hover {
          transform: scale(1.05); /* Scale effect on hover */
        }

        /* Image container within card */
        .card .img {
          width: 100%;
          height: 30vh; /* Height for the image */
          background: #2c2c3e; /* Placeholder background color */
        }

        /* Image styling */
        .card img {
          width: 100%;
          height: 100%;
          object-fit: cover; /* Maintain aspect ratio */
        }

        /* Card content */
        .card-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #333344; /* Slightly lighter background for content */
        }

        /* Song title styling */
        .card-content h3 {
          font-size: 1rem; /* Adjust font size for better visibility */
        }

        /* Download button */
        .download-btn {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #4caf50; /* Green color for download button */
          border-radius: 50%; /* Circle button */
          font-size: 1.5rem; /* Size of the icon */
          transition: background 0.3s; /* Smooth background transition */
        }

        .download-btn:hover {
          background: #388e3c; /* Darker green on hover */
        }

        /* Audio player styling */
        .audio-player {
          width: 100%;
          height: 10vh; /* Height of audio player */
          background: #222232; /* Darker background for audio player */
          display: flex;
          align-items: center;
          justify-content: center; /* Center audio controls */
        }

        /* Loading text */
        .loading-text {
          font-size: 1.5rem; /* Bigger loading text */
          color: #ffffff; /* White loading text */
          text-align: center; /* Centered loading text */
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .card {
            width: calc(50% - 1rem); /* Two cards per row on smaller screens */
          }
        }

        @media (max-width: 480px) {
          .card {
            width: 100%; /* Full width for mobile screens */
          }

          .card-content h3 {
            font-size: 0.9rem; /* Smaller title font on mobile */
          }

          .download-btn {
            width: 30px;
            height: 30px;
            font-size: 1.2rem; /* Smaller icon size on mobile */
          }
        }
      `}</style>

      <div className="cards-container">
        {searches?.length > 0 ? (
          searches.map((d, i) => (
            <div key={i} className="card">
              <div className="img">
                <img src={d.image[2].link} alt={d.name} />
              </div>
              <div className="card-content">
                <h3>{d.name}</h3>
                <i
                  onClick={() =>
                    handleDownloadSong(d.downloadUrl[4].link, d.name, d.image[2].link)
                  }
                  className="download-btn ri-download-line"
                ></i>
              </div>
              <div className="audio-player">
                <audio controls src={d.downloadUrl[4].link}></audio>
              </div>
            </div>
          ))
        ) : (
          <h1 className="loading-text">{query === requery ? "Loading" : ""}</h1>
        )}
      </div>
    </div>
  );
};

export default Cards;

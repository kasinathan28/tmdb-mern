import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Details.css";
import axios from "axios";
import { FaList, FaHeart, FaSave, FaPlay } from 'react-icons/fa';


function Details() {
  const { id } = useParams();
  const TOKEN = `${process.env.REACT_APP_TOKEN}`;
  const BACKDROP = `${process.env.REACT_APP_BACKDROP}`;
  const [movieDetails, setMovieDetails] = useState(null);
  const POSTERURL = `${process.env.REACT_APP_POSTERURL}`;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `${TOKEN}`,
            },
          }
        );
        setMovieDetails(response.data);
      } catch (error) {
        console.log("Error while fetching the details", error);
      }
    };
    fetchDetails();
  }, [id, TOKEN]);

  return (
    <div>
      <Navbar />
      <div className="detailsPage">
        {movieDetails && (
          <div className="Detailsbg">
            <img
              src={`${BACKDROP}${movieDetails.backdrop_path}`}
              alt="Backdrop"
              className="backdrop-image"
            />
            <div className="center">
              <div className="poster">
                <img
                  src={`${POSTERURL}${movieDetails.poster_path}`}
                  alt={`${movieDetails.title}`}
                />
                <div className="buttons">
                  <button><FaList /></button>
                  <button><FaHeart /></button>
                  <button><FaSave /></button>
                  <button><FaPlay /></button>
                </div>
              </div>

              <div className="overview">
                <h1>{`${movieDetails.title}`}</h1>
                <p>{`${movieDetails.overview}`}</p>
                <div className="buttons">
                  <button><FaList /></button>
                  <button><FaHeart /></button>
                  <button><FaSave /></button>
                  <button><FaPlay /></button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Details;

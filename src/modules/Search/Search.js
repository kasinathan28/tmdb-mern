import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Search.css";
import No_avatar from "../../assets/No_avatar.png";
import Loader from "../../components/Loader/Loader";

function Search() {
  const { query: urlQuery } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(urlQuery || "");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const SEARCHURL = `${process.env.REACT_APP_SEARCHURL}`;
  const TOKEN = `${process.env.REACT_APP_TOKEN}`;
  const POSTERPATH = `${process.env.REACT_APP_POSTERURL}`;
  const [categoryCounts, setCategoryCounts] = useState({
    movie: 0,
    tv: 0,
    person: 0,
    collection: 0,
    keyword: 0,
    network: 0,
    company: 0,
  });

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SEARCHURL}${query}`, {
          headers: {
            accept: "application/json",
            Authorization: `${TOKEN}`,
          },
        });
        setResults(response.data.results);
        setFilteredResults(response.data.results);
      } catch (error) {
        console.log("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim() !== "") {
      fetchSearchResults();
    }
  }, [query, SEARCHURL, TOKEN, navigate]);

  useEffect(() => {
    const counts = results.reduce(
      (acc, result) => {
        if (result.media_type === "movie") {
          acc.movie++;
        } else if (result.media_type === "tv") {
          acc.tv++;
        } else if (result.media_type === "person") {
          acc.person++;
        }
        return acc;
      },
      {
        movie: 0,
        tv: 0,
        person: 0,
        collection: 0,
        keyword: 0,
        network: 0,
        company: 0,
      }
    );
    setCategoryCounts(counts);
  }, [results]);

  const handleSubmit = () => {
    const inputQuery = document.getElementById("searchq").value;
    setQuery(inputQuery);
  };

  const handleCategoryClick = (category) => {
    const filtered = results.filter((result) => result.media_type === category);
    setFilteredResults(filtered);
    setActiveCategory(category);
  };

  const handleDetails = (mediaType, id) => {
    navigate(`/details/${mediaType}/${id}`);
  };

  return (
    <div className="searchpage">
      <Navbar />
      <div className="searchbar">
        <input
          type="text"
          name="searchQuery"
          id="searchq"
          defaultValue={query}
        />
        <button onClick={handleSubmit}>Search</button>
      </div>

      <div>
        {loading ? (
          <Loader />
        ) : (
          <div className="searchsub-ctn">
            <div className="category-section">
              <div className="catbox">
                <div className="search-count">
                  <h3>Search Results</h3>
                </div>
                <div
                  className={`category-box ${
                    activeCategory === "movie" ? "active-category" : ""
                  }`}
                  onClick={() => handleCategoryClick("movie")}
                >
                  <h3>Movies </h3> <h4>{categoryCounts.movie}</h4>
                </div>
                <div
                  className={`category-box ${
                    activeCategory === "tv" ? "active-category" : ""
                  }`}
                  onClick={() => handleCategoryClick("tv")}
                >
                  <h3>TV Shows </h3> <h4>{categoryCounts.tv}</h4>
                </div>
                <div
                  className={`category-box ${
                    activeCategory === "person" ? "active-category" : ""
                  }`}
                  onClick={() => handleCategoryClick("person")}
                >
                  <h3>People</h3> <h4> {categoryCounts.person}</h4>
                </div>
   
              </div>
            </div>
            <div className="results-section">
            {filteredResults.map((result, index) => (
  <div key={index} className="det">
    <div
      className="image"
      onClick={() => handleDetails(result.media_type, result.id)}
    >
      {result.media_type === "person" && result.profile_path ? (
        <img
          src={`${POSTERPATH}/${result.profile_path}`}
          alt={`${result.title}`}
        />
      ) : result.media_type === "movie" && result.poster_path ? (
        <img
          src={`${POSTERPATH}/${result.poster_path}`}
          alt={`${result.title}`}
        />
      ) : result.media_type === "tv" && result.poster_path ? (
        <img
          src={`${POSTERPATH}/${result.poster_path}`}
          alt={`${result.name}`}
        />
      ) : (
        <img src={No_avatar} alt="no avatar" />
      )}
    </div>
    <div className="details">
      {result.title && <h1>{result.title}</h1>}
      {result.name && <h1>{result.name}</h1>}
      {result.release_date && (
        <p id="date">{result.release_date}</p>
      )}
      {result.first_air_date && (
        <p id="date">{result.first_air_date}</p>
      )}
      {result.overview && <p>{result.overview}</p>}
      {result.media_type === "tv" && (
        <>
          {result.seasons && (
            <p>Number of seasons: {result.seasons.length}</p>
          )}
          {result.number_of_episodes && (
            <p>Number of episodes: {result.number_of_episodes}</p>
          )}
          {result.last_episode_to_air && (
            <div>
              <p>Last episode aired: {result.last_episode_to_air.name}</p>
              <p>Last episode overview: {result.last_episode_to_air.overview}</p>
            </div>
          )}
        </>
      )}
      <div className="known">
        {result.known_for_department}
        {result.media_type === "person" &&
          result.known_for.map((item, index) => (
            <p key={index}>{item.title}</p>
          ))}
      </div>
    </div>
  </div>
))}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
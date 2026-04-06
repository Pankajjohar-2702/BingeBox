import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const Anime = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [data, setData] = useState({
    trendingNow: [],
    actionShonen: [],
    darkPsychological: [],
    sciFiFantasy: [],
    popularClassics: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
    $('.section').hide().fadeIn(1000);
  }, []);

  const groupVideos = (videos) => {
    const grouped = {
      trendingNow: [],
      actionShonen: [],
      darkPsychological: [],
      sciFiFantasy: [],
      popularClassics: []
    };

    videos.forEach((item) => {
      if (grouped[item.section]) {
        grouped[item.section].push(item);
      }
    });

    return grouped;
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos?category=anime');
      const videos = await response.json();
      setData(groupVideos(videos));
    } catch (error) {
      console.error('Failed to load anime videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setShowSearchResults(false);
      return;
    }

    const allItems = [
      ...data.trendingNow,
      ...data.actionShonen,
      ...data.darkPsychological,
      ...data.sciFiFantasy,
      ...data.popularClassics
    ];

    const filtered = allItems.filter((item) =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  const handleVideoClick = (videoUrl) => {
    window.dispatchEvent(new CustomEvent('openVideoModal', { detail: videoUrl }));
  };

  const handleDelete = async (item) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/videos/${item._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Unable to delete video');
        return;
      }

      setData((prevData) => {
        const updated = { ...prevData };
        Object.keys(updated).forEach((key) => {
          updated[key] = updated[key].filter((video) => video._id !== item._id);
        });
        return updated;
      });

      setSearchResults((prev) => prev.filter((video) => video._id !== item._id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const renderSection = (title, items) => (
    <div className="section">
      <h2>{title}</h2>
      <div className="grid-content">
        {items.map((item) => (
          <Card
            key={item._id}
            item={item}
            onVideoClick={handleVideoClick}
            onDelete={handleDelete}
            showFavoriteButton={true}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <Navbar onSearch={handleSearch} />
        <div className="section" style={{ textAlign: 'center', padding: '60px', color: '#fff' }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar onSearch={handleSearch} />

      {showSearchResults ? (
        <div id="searchResultsSection" className="section">
          <h2>Search Results</h2>
          <div id="searchResults" className="grid-content">
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <Card
                  key={item._id}
                  item={item}
                  onVideoClick={handleVideoClick}
                  onDelete={handleDelete}
                  showFavoriteButton={true}
                />
              ))
            ) : (
              <div style={{
                gridColumn: '1/-1',
                textAlign: 'center',
                padding: '40px',
                color: '#999',
                fontSize: '18px'
              }}>
                <p>Nothing found</p>
                <p style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
                  Not available right now
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div id="allContentWrapper">
          <div className="banner">
            <h2>Anime Universe</h2>
            <p>Explore the world of Japanese animation</p>
          </div>

          {renderSection('🔥 Trending Now', data.trendingNow)}
          {renderSection('⚔️ Action / Shonen', data.actionShonen)}
          {renderSection('🧠 Dark / Psychological', data.darkPsychological)}
          {renderSection('🚀 Sci-Fi / Fantasy', data.sciFiFantasy)}
          {renderSection('🌟 Popular Classics', data.popularClassics)}
        </div>
      )}

      <footer className="footer">
        <p>&copy; 2026 BingeBox. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Anime;
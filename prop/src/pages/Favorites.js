import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    loadFavorites();
    $('.section').hide().fadeIn(1000);
  }, []);

  const loadFavorites = () => {
    const stored = JSON.parse(localStorage.getItem('bingebox_favorites') || '[]');
    setFavorites(stored);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setShowSearchResults(false);
      return;
    }

    const filtered = favorites.filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  const handleVideoClick = (videoUrl) => {
    window.dispatchEvent(new CustomEvent('openVideoModal', { detail: videoUrl }));
  };

  const handleRemoveFavorite = (item) => {
    const updated = favorites.filter(fav => fav.title !== item.title);
    setFavorites(updated);
    localStorage.setItem('bingebox_favorites', JSON.stringify(updated));
  };

  const renderFavorites = () => {
    const itemsToShow = showSearchResults ? searchResults : favorites;

    if (itemsToShow.length === 0) {
      if (showSearchResults) {
        return (
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
        );
      }
      return (
        <div id="emptyFavorites" style={{
          textAlign: 'center',
          padding: '50px',
          color: '#666'
        }}>
          <h3>No favorites yet</h3>
          <p>Click the heart icon on any content to add it to your favorites!</p>
        </div>
      );
    }

    return itemsToShow.map((item, index) => (
      <div key={index} style={{ position: 'relative' }}>
        <Card
          item={item}
          onVideoClick={handleVideoClick}
        />
        <button
          onClick={() => handleRemoveFavorite(item)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            fontSize: '16px',
            zIndex: 10
          }}
        >
          ✕
        </button>
      </div>
    ));
  };

  return (
    <div>
      <Navbar onSearch={handleSearch} />

      {showSearchResults ? (
        <div id="searchResultsSection" className="section">
          <h2>Search Results</h2>
          <div id="searchResults" className="grid-content">
            {renderFavorites()}
          </div>
        </div>
      ) : (
        <div id="allContentWrapper">
          <div className="banner">
            <h2>Your Favorites</h2>
            <p>Your personally curated collection</p>
          </div>

          <div className="section">
            <h2>❤️ My Favorites</h2>
            <div id="favoritesContent" className="grid-content">
              {renderFavorites()}
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>&copy; 2026 BingeBox. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Favorites;
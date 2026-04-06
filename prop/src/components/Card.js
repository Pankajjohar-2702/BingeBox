import React, { useEffect, useState } from 'react';
import $ from 'jquery';

const Card = ({ item, onVideoClick, onDelete, showFavoriteButton = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const handleRoleChange = () => {
      const role = localStorage.getItem('userRole') || '';
      setUserRole(role);
    };

    window.addEventListener('userRoleChanged', handleRoleChange);
    handleRoleChange(); // initial

    // Check if item is in favorites
    if (showFavoriteButton) {
      const favorites = JSON.parse(localStorage.getItem('bingebox_favorites') || '[]');
      const exists = favorites.some(fav => fav.title === item.title);
      setIsFavorite(exists);
    }

    // jQuery hover effects
    $('.card').hover(
      function() {
        $(this).css('transform', 'scale(1.05)');
      },
      function() {
        $(this).css('transform', 'scale(1)');
      }
    );

    // Image error handling
    $('img').on('error', function() {
      var currentSrc = $(this).attr('src');
      if (currentSrc.includes('maxresdefault.jpg')) {
        $(this).attr('src', currentSrc.replace('maxresdefault.jpg', 'sddefault.jpg'));
        return;
      }
      if (currentSrc.includes('sddefault.jpg')) {
        $(this).attr('src', currentSrc.replace('sddefault.jpg', 'hqdefault.jpg'));
        return;
      }
      if (currentSrc.includes('hqdefault.jpg')) {
        $(this).attr('src', currentSrc.replace('hqdefault.jpg', 'mqdefault.jpg'));
        return;
      }
      if (currentSrc.includes('mqdefault.jpg')) {
        $(this).attr('src', currentSrc.replace('mqdefault.jpg', 'default.jpg'));
        return;
      }
      var altText = $(this).attr('alt') || 'Trailer';
      altText = encodeURIComponent(altText.replace(/\s+/g, '+'));
      $(this).attr('src', `https://via.placeholder.com/300x170/111111/ffffff?text=${altText}`);
    });

    // Cleanup
    return () => {
      window.removeEventListener('userRoleChanged', handleRoleChange);
      $('.card').off('mouseenter mouseleave');
      $('img').off('error');
    };
  }, [item.title, showFavoriteButton]);

  const handleClick = (e) => {
    if ($(e.target).hasClass('favorite-btn') || $(e.target).closest('.favorite-btn').length > 0 ||
        $(e.target).hasClass('delete-btn') || $(e.target).closest('.delete-btn').length > 0) {
      return;
    }
    if (onVideoClick) {
      onVideoClick(item.video);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem('bingebox_favorites') || '[]');

    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter(fav => fav.title !== item.title);
    } else {
      // Add to favorites
      favorites.push(item);
    }

    localStorage.setItem('bingebox_favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item);
    }
  };

  return (
    <div className="card" onClick={handleClick} data-video={item.video} data-title={item.title}>
      <img src={item.thumbnail} alt={item.title} />
      <p>{item.title}</p>
      {showFavoriteButton && (
        <button
          className="favorite-btn"
          onClick={handleFavoriteClick}
          data-title={item.title}
          data-video={item.video}
          data-thumbnail={item.thumbnail}
          style={{
            position: 'absolute',
            top: '10px',
            right: userRole === 'admin' ? '45px' : '10px',
            background: 'rgba(0,0,0,0.7)',
            color: isFavorite ? '#e50914' : 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      )}
      {userRole === 'admin' && onDelete && (
        <button
          className="delete-btn"
          onClick={handleDeleteClick}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🗑️
        </button>
      )}
    </div>
  );
};

export default Card;
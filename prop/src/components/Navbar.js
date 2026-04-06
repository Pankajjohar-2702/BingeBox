import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import $ from 'jquery';

const Navbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRoleChange = () => {
      const role = localStorage.getItem('userRole') || '';
      setUserRole(role);
    };

    window.addEventListener('userRoleChanged', handleRoleChange);
    handleRoleChange(); // initial check

    // jQuery hover effects
    $('.navbar h1').on('click', () => {
      setSearchTerm('');
      if (onSearch) onSearch('');
    });

    // Cleanup
    return () => {
      window.removeEventListener('userRoleChanged', handleRoleChange);
      $('.navbar h1').off('click');
    };
  }, [onSearch]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setUserRole('');
    window.dispatchEvent(new CustomEvent('userRoleChanged'));
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearch) onSearch(term);
  };

  const getPlaceholder = () => {
    switch (location.pathname) {
      case '/anime': return 'Search anime...';
      case '/drama': return 'Search drama...';
      case '/favorites': return 'Search favorites...';
      default: return 'Search movies & shows...';
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1>BingeBox</h1>
      </Link>
      <div className="search-container">
        <input
          type="text"
          id="searchInput"
          className="search-bar"
          placeholder={getPlaceholder()}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <span className="search-icon">🔍</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {userRole && (
          <span style={{ color: 'white', marginRight: '10px' }}>
            Logged in as {userRole}
          </span>
        )}
        {userRole && (
          <button
            onClick={handleLogout}
            style={{
              background: '#e50914',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Logout
          </button>
        )}
        <ul style={{ margin: 0 }}>
          <li><Link to="/" style={{ color: isActive('/') ? '#e50914' : 'white' }}>Home</Link></li>
          <li><Link to="/drama" style={{ color: isActive('/drama') ? '#e50914' : 'white' }}>Drama</Link></li>
          <li><Link to="/anime" style={{ color: isActive('/anime') ? '#e50914' : 'white' }}>Anime</Link></li>
          {userRole === 'admin' && (
            <li><Link to="/admin" style={{ color: isActive('/admin') ? '#e50914' : 'white' }}>Admin</Link></li>
          )}
          <li>
            <Link to="/favorites" title="Favorites" style={{ color: isActive('/favorites') ? '#e50914' : 'white' }}>
              <span style={{ color: '#e50914', fontSize: '18px' }}>❤️</span> Favorites
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
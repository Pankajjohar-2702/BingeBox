import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }
    loadUsers();
  }, [userRole, navigate]);

  const loadUsers = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Unable to load users');
      } else {
        setUsers(data);
      }
    } catch (err) {
      setError('Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadChanges = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/admin/changes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Unable to load changes');
      } else {
        setChanges(data);
      }
    } catch (err) {
      setError('Unable to load changes');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') {
      loadUsers();
    } else {
      loadChanges();
    }
  };

  const renderUsers = () => (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>{new Date(user.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderChanges = () => (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Title</th>
            <th>Category</th>
            <th>Section</th>
            <th>Performed By</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((change) => (
            <tr key={change._id}>
              <td>{change.action}</td>
              <td>{change.title}</td>
              <td>{change.category}</td>
              <td>{change.section}</td>
              <td>{change.performedBy}</td>
              <td>{new Date(change.performedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <Navbar onSearch={() => {}} />
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
          <p>View registered user accounts and admin change logs.</p>
        </div>
        <div className="admin-actions">
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => switchTab('users')}
          >
            Login User Data
          </button>
          <button
            className={activeTab === 'changes' ? 'active' : ''}
            onClick={() => switchTab('changes')}
          >
            Admin Changes Data
          </button>
        </div>

        {loading && <div className="admin-loading">Loading...</div>}
        {error && <div className="admin-error">{error}</div>}
        {!loading && !error && (
          <div>
            {activeTab === 'users' ? renderUsers() : renderChanges()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

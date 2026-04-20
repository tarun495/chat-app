import { useAuth } from '../context/AuthContext';
import './UserList.css';

function UserList({ users, selectedUser, setSelectedUser, onlineUsers }) {
  const { user, logout } = useAuth();

  return (
    <div className="userlist-container">
      <div className="userlist-header">
        <div className="userlist-top">
          <h3>Messages</h3>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
        <div className="current-user-badge">
          <div className="dot"></div>
          <span>{user?.username}</span>
        </div>
      </div>

      <div className="users-list">
        <p className="section-label">All Users</p>
        {users
          .filter(u => u._id !== user?.id)
          .map(u => {
            const isOnline = onlineUsers.includes(u._id);
            return (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className={`user-item ${selectedUser?._id === u._id ? 'active' : ''}`}
              >
                <div className="avatar">
                  {u.username[0].toUpperCase()}
                  <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
                </div>
                <div className="user-info">
                  <p className="username">{u.username}</p>
                  <p className={`status-text ${isOnline ? 'online' : 'offline'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default UserList;
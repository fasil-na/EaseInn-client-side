import React from 'react';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-text">Page not found</p>
        <div className="spinner" />
      </div>
    </div>
  );
}

export default NotFound;

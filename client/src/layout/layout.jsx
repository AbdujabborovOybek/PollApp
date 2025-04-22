import React, { memo } from "react";
import "./layout.css";
import { Outlet, Link } from "react-router-dom";

export default memo(function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/">PollApp</Link>
          <nav className="nav">
            <Link to="/create">Crate Poll</Link>
            <Link to="/polls">Polls</Link>
          </nav>

          <Link to="/login">Login</Link>
        </div>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
});

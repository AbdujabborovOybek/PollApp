import React, { memo } from "react";
import "./layout.css";
import { Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default memo(function Layout() {
  const user = useSelector((state) => state.user);

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/">PollApp</Link>
          <nav className="nav">
            <Link to="/create">Crate Poll</Link>
            <Link to="/polls">Polls</Link>
          </nav>

          {user ? <p>{user?.first_name}</p> : <Link to="/login">Login</Link>}
        </div>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
});

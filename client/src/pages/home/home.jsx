import React from "react";
import "./home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <div className="intro">
        <img src="/public/splash.jpg" alt="" />

        <div className="intro-content">
          <h1>
            <i>Create a poll</i>
            <span>in seconds</span>
          </h1>

          <p>
            Want to ask your friends where to go friday night or arrange a
            meeting with co-workers? Create a poll - and get answers in no time.
          </p>

          <div>
            <Link to="/create">Create a poll</Link>
            <Link to="/polls">My Polls</Link>
          </div>
        </div>
      </div>

      <p className="trusted">Trusted by over 1,500,000 users worldwide</p>

      <div className="stats">
        <div>
          <h1>1.5M+</h1>
          <p>Users</p>
        </div>
        <div>
          <h1>11M+</h1>
          <p>Polls</p>
        </div>
        <div>
          <h1>260M+</h1>
          <p>Votes</p>
        </div>
      </div>
    </div>
  );
}

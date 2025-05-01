import React from "react";
import "./crate.css";

export default function Crate() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };

  return (
    <div className="crate">
      <h1>Create a Poll </h1>
      <p>Complete the below fields to create your poll.</p>

      <form className="crate-form" onSubmit={handleSubmit}>
        <label>
          <span>Title</span>
          <input
            type="text"
            name="question"
            placeholder="Enter your question"
            autoComplete="off"
          />
        </label>

        <div className="crate-form-options">
          <label>
            <span>Poll status</span>
            <select name="status">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
            </select>
          </label>
          <label>
            <span>Poll type</span>
            <select name="poll_type">
              <option value="single_choice">Multiple choice</option>
              <option value="single_choice">Single choice</option>
            </select>
          </label>
        </div>

        <div className="crate-form-options">
          <label>
            <span>Start date</span>
            <input type="datetime-local" name="start_time" />
          </label>

          <label>
            <span>End date</span>
            <input type="datetime-local" name="end_time" />
          </label>
        </div>

        <div className="crate-form-options">
          <label>
            <span>Type of poll</span>
            <select name="type_of_poll">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </label>
        </div>

        <button>
          <span>Create Poll</span>
        </button>
      </form>
    </div>
  );
}

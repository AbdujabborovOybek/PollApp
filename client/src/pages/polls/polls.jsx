import React, { useState } from "react";
import "./polls.css";
import { useGetPollsQuery } from "../../context/service/poll.service";

export default function Polls() {
  const [status, setStatus] = useState("all");
  const [pollType, setPollType] = useState("all");
  const { data: polls } = useGetPollsQuery({ status, type_of_poll: pollType });
  const pollsList = polls?.innerData || null;

  return (
    <div className="polls">
      <div className="polls-header">
        <h1>Polls</h1>
        <div className="filters">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={pollType}
            onChange={(e) => setPollType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <table
        className="polls-table"
        border="1"
        cellPadding="10"
        cellSpacing="0"
      >
        <thead>
          <tr>
            <th>Index</th>
            <th>Question</th>
            <th>Type</th>
            <th>Status</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Vote Count</th>
          </tr>
        </thead>
        <tbody>
          {pollsList && pollsList.length > 0 ? (
            pollsList.map((poll, index) => (
              <tr key={poll.id}>
                <td>{index + 1}</td>
                <td>{poll.question}</td>
                <td>{poll.poll_type}</td>
                <td>{poll.status}</td>
                <td>{new Date(poll.start_time).toLocaleString()}</td>
                <td>{new Date(poll.end_time).toLocaleString()}</td>
                <td>{poll.vote_count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No polls found.</td>
            </tr>
          )}
        </tbody>
      </table>
      {pollsList && pollsList.length > 0 && (
        <div className="polls-pagination">
          {/* Pagination controls can be added here if needed */}
        </div>
      )}
    </div>
  );
}

// created_at: "2025-05-29T12:22:39.000Z";
// deleted_at: null;
// end_time: "2025-05-30T16:26:00.000Z";
// id: "7f59e5bb-43d1-40bb-8761-97088ec2612a";
// poll_type: "multiple_choice";
// question: "test ";
// start_time: "2025-05-28T16:25:00.000Z";
// status: "pending";
// type_of_poll: "public";
// updated_at: "2025-05-29T12:22:39.000Z";
// user_id: "65b58158-6132-4b5c-811f-64331537be51";
// vote_count: 0;

import React, { useState } from "react";
import "./crate.css";
import { useCreatePollMutation } from "../../context/service/poll.service.js";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function Crate() {
  const navigate = useNavigate();
  // Boshlang‘ichda bitta bo‘sh javob maydoni
  const [options, setOptions] = useState([""]);

  // Javob yozilganda chaqiriladi
  const handleOptionChange = (index, e) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;

    // Agar so‘nggi maydonga biron narsa yozilsa, avtomatik yangi bo‘sh maydon qo‘sh
    if (index === options.length - 1 && e.target.value.trim() !== "") {
      newOptions.push("");
    }

    setOptions(newOptions);
  };

  const [createPoll] = useCreatePollMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData’dan barcha maydonlarni o‘qiymiz
    const formData = new FormData(e.target);
    // Avval boshqa maydonlarni Object.fromEntries bilan olamiz
    const data = Object.fromEntries(
      [...formData.entries()].filter(([key]) => key !== "poll_options")
    );
    // poll_options maydonini array sifatida olish
    data.poll_options = formData
      .getAll("poll_options")
      .map((opt) => opt.trim())
      .filter((opt) => opt !== "");

    // Vaqtni ISOga aylantiramiz
    data.start_time = new Date(data.start_time).toISOString();
    data.end_time = new Date(data.end_time).toISOString();

    try {
      const response = await createPoll(data);

      if (response?.data) {
        enqueueSnackbar(response.data.message, {
          variant: response.data.variant,
        });
        e.target.reset();
        setOptions([""]); // javob maydonlarini reset qilamiz
        return navigate("/polls"); // muvaffaqiyatli yaratilganda poll sahifasiga qaytamiz
      } else if (response?.error) {
        enqueueSnackbar(response.error.data.message, {
          variant: response.error.data.variant,
        });
      }
    } catch (error) {
      enqueueSnackbar("An unexpected error occurred. Please try again.", {
        variant: "error",
      });
      console.error("Error creating poll:", error);
    }
  };

  return (
    <div className="crate">
      <h1>Create a Poll</h1>
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
            <select name="type_of_poll">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
            </select>
          </label>
          <label>
            <span>Poll type</span>
            <select name="poll_type">
              <option value="multiple_choice">Multiple choice</option>
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

        {/* Dinamik javob maydonlari */}
        <div className="crate-form-options crate-form-options-dynamic">
          {options.map((opt, idx) => (
            <label key={idx}>
              <span>Option {idx + 1}</span>
              <input
                type="text"
                name="poll_options"
                value={opt}
                placeholder={`Enter option ${idx + 1}`}
                onChange={(e) => handleOptionChange(idx, e)}
                autoComplete="off"
              />
            </label>
          ))}
        </div>

        <button type="submit">
          <span>Create Poll</span>
        </button>
      </form>
    </div>
  );
}

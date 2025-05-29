import React, { useState } from "react";
import "./login.css";
import { PatternFormat } from "react-number-format";
import { useVerifyMutation } from "../../context/service/auth.service.js";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [verify] = useVerifyMutation();
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const code = e.target.code.value.replace(/\s+/g, "");
      const response = await verify({ code: Number(code) });

      if (response.data) {
        enqueueSnackbar(response?.data?.message, {
          variant: response?.data?.variant,
        });

        dispatch({ type: "SET_USER", payload: response?.data?.innerData });
        localStorage.setItem("user", JSON.stringify(response?.data?.innerData));
        return navigate("/polls");
      }

      if (response.error) {
        enqueueSnackbar(response?.error?.data?.message, {
          variant: response?.error?.data?.variant,
        });
      }
    } catch (error) {
      enqueueSnackbar("An unexpected error occurred. Please try again.", {
        variant: "error",
      });
      console.error("Error verifying code:", error);
    }
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Poll App</h1>
        <PatternFormat
          format="### ###"
          allowEmptyFormatting
          mask="_"
          name="code"
          autoComplete="off"
        />

        <button type="submit">Verify</button>

        <a
          href="https://t.me/PollAppSupportBot"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get verification code
        </a>
      </form>
    </div>
  );
}

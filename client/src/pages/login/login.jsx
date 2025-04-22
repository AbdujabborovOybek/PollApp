import React from "react";
import "./login.css";
import { PatternFormat } from "react-number-format";

export default function Login() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = e.target.code.value.replace(/\s+/g, "");
    console.log(code);
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
      </form>
    </div>
  );
}

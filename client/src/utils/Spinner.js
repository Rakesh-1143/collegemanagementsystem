import React from "react";

// Dependency-free replacement for react-loader-spinner (which does not peer
// support React 19). Keeps the same props interface used across the app.
const Spinner = ({
  message,
  height = 50,
  width,
  color = "#111111",
  messageColor = "blue",
}) => {
  const size = Number(height) || 50;
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div
        role="status"
        aria-label={message || "Loading"}
        className="rounded-full animate-spin m-5"
        style={{
          width: size,
          height: size,
          border: "4px solid rgba(128,128,128,0.2)",
          borderTopColor: color,
        }}
      />
      <p style={{ color: messageColor }} className="text-lg text-center px-2">
        {message}
      </p>
    </div>
  );
};

export default Spinner;
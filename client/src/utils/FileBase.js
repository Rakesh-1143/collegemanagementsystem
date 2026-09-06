import React from "react";

// Drop-in replacement for the unmaintained react-file-base64 package.
// Reads selected files as base64 data URLs and reports each one via
// onDone({ base64, file }).
const FileBase = ({ multiple = false, onDone }) => {
  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        onDone({ base64: reader.result, file });
      };
      reader.readAsDataURL(file);
    });
    // Allow re-selecting the same file after a failed submit.
    e.target.value = "";
  };

  return (
    <div>
      <input
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleChange}
        className="text-sm"
      />
    </div>
  );
};

export default FileBase;
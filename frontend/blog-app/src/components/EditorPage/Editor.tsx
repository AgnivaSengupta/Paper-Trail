import React, { useState } from "react";
//import ReactQuill from "react-quill";
//import "react-quill/dist/quill.snow.css"; // default theme

function Editor() {
  const [value, setValue] = useState("");

  return (
    <div className="py-2 w-full h-screen flex flex-col gap-3 ">
      <h1> Editor</h1>
    </div>
  );
}

export default Editor;

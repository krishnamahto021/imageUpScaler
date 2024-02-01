import React from "react";
import ImageUploader from "./ImageUploader";

const App = () => {
  return (
    <div className="App bg-gradient-to-r from-cyan-500 to-blue-500 h-screen">
      <header className="App-header">
        <h1 className="text-4xl font-bold mb-4">
          Enhance your low Quality images
        </h1>
        <ImageUploader />
      </header>
    </div>
  );
};

export default App;

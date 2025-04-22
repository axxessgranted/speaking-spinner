import React from "react";
import Spinner from "./components/Spinner";
import "./index.css";

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <h1 className="text-3xl font-bold mt-8 mb-6 text-blue-700">
        🎯 Speaking Spinner
      </h1>
      <Spinner />
    </div>
  );
};

export default App;

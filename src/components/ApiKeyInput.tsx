import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Key } from "lucide-react";
import { toast } from "sonner";

const ApiKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem("openrouter_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    try {
      localStorage.setItem("openrouter_api_key", apiKey);
      setIsSaved(true);
      toast.success("API key saved successfully!");
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
    }
  };

  const handleClear = () => {
    try {
      localStorage.removeItem("openrouter_api_key");
      setApiKey("");
      setIsSaved(false);
      toast.success("API key cleared successfully!");
    } catch (error) {
      console.error("Error clearing API key:", error);
      toast.error("Failed to clear API key");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Key className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={isVisible ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenRouter API key"
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            {isVisible ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={handleClear}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isSaved ? "Update" : "Save"}
        </button>
      </div>

      {isSaved && (
        <div className="mt-2 text-sm text-green-600">
          API key is saved and ready to use
        </div>
      )}
    </div>
  );
};

export default ApiKeyInput;

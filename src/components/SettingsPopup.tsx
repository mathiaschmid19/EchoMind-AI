import React, { useState, useEffect } from "react";
import { X, Key, Moon, Sun, Info, LogIn, LogOut, User } from "lucide-react";
import ApiKeyInput from "./ApiKeyInput";
import { useTheme } from "../context/ThemeContext";
import {
  SignIn,
  SignUp,
  SignOutButton,
  UserButton,
  useAuth,
  useUser,
  useClerk,
} from "@clerk/clerk-react";

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialActiveTab?: string;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({
  isOpen,
  onClose,
  initialActiveTab = "api",
}) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const {
    isDarkMode,
    toggleDarkMode,
    fontSize,
    setFontSize,
    messageDensity,
    setMessageDensity,
    chatStyle,
    setChatStyle,
  } = useTheme();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { openSignIn, openSignUp, openUserProfile } = useClerk();

  // Update activeTab when initialActiveTab changes
  useEffect(() => {
    setActiveTab(initialActiveTab);
  }, [initialActiveTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[600px]">
        {/* Vertical tabs sidebar - hidden on mobile, shown as horizontal on small screens */}
        <div className="md:w-48 bg-gray-50 dark:bg-gray-700 border-b md:border-b-0 md:border-r dark:border-gray-600 flex flex-col">
          <div className="p-4 border-b dark:border-gray-600 flex items-center justify-between md:block">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="py-2 flex-1 overflow-x-auto md:overflow-x-visible">
            <div className="flex md:flex-col min-w-max md:min-w-0">
              <button
                onClick={() => setActiveTab("appearance")}
                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "appearance"
                    ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600 dark:text-blue-400 dark:bg-gray-600 dark:border-blue-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <Sun className="h-4 w-4 mr-3" />
                Appearance
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "account"
                    ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600 dark:text-blue-400 dark:bg-gray-600 dark:border-blue-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <User className="h-4 w-4 mr-3" />
                Account
              </button>
              <button
                onClick={() => setActiveTab("api")}
                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "api"
                    ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600 dark:text-blue-400 dark:bg-gray-600 dark:border-blue-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <Key className="h-4 w-4 mr-3" />
                API Key
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "about"
                    ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600 dark:text-blue-400 dark:bg-gray-600 dark:border-blue-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <Info className="h-4 w-4 mr-3" />
                About
              </button>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex justify-end p-4 border-b dark:border-gray-700 hidden md:flex">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 md:p-6 flex-1 overflow-y-auto">
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  Appearance
                </h3>
                <div className="space-y-4">
                  {/* Theme Switcher */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-4">
                        Theme
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {isDarkMode ? (
                            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-3" />
                          ) : (
                            <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-3" />
                          )}
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {isDarkMode ? "Dark Mode" : "Light Mode"}
                          </span>
                        </div>
                        <button
                          onClick={toggleDarkMode}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600"
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                              isDarkMode ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-4">
                        Font Size
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          onClick={() => setFontSize("small")}
                          className={`p-3 text-xs font-medium ${
                            fontSize === "small"
                              ? "text-white bg-blue-600 border-transparent"
                              : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400"
                          } rounded-md border transition-colors`}
                        >
                          Small
                        </button>
                        <button
                          onClick={() => setFontSize("medium")}
                          className={`p-3 text-sm font-medium ${
                            fontSize === "medium"
                              ? "text-white bg-blue-600 border-transparent"
                              : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400"
                          } rounded-md border transition-colors`}
                        >
                          Medium
                        </button>
                        <button
                          onClick={() => setFontSize("large")}
                          className={`p-3 text-base font-medium ${
                            fontSize === "large"
                              ? "text-white bg-blue-600 border-transparent"
                              : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400"
                          } rounded-md border transition-colors`}
                        >
                          Large
                        </button>
                        <button
                          onClick={() => setFontSize("xlarge")}
                          className={`p-3 text-lg font-medium ${
                            fontSize === "xlarge"
                              ? "text-white bg-blue-600 border-transparent"
                              : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400"
                          } rounded-md border transition-colors`}
                        >
                          X-Large
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Message Density */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-4">
                        Message Density
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setMessageDensity("compact")}
                          className={`p-3 text-sm font-medium ${
                            messageDensity === "compact"
                              ? "text-white bg-blue-600 border-transparent"
                              : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400"
                          } rounded-md border transition-colors`}
                        >
                          Compact
                        </button>
                        <button
                          onClick={() => setMessageDensity("comfortable")}
                          className={`p-3 text-sm font-medium ${
                            messageDensity === "comfortable"
                              ? "text-white bg-blue-600 border-transparent"
                              : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400"
                          } rounded-md border transition-colors`}
                        >
                          Comfortable
                        </button>
                        <button
                          onClick={() => setMessageDensity("spacious")}
                          className={`p-3 text-sm font-medium ${
                            messageDensity === "spacious"
                              ? "text-white bg-blue-600 border-transparent"
                              : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400"
                          } rounded-md border transition-colors`}
                        >
                          Spacious
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Chat Style */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-4">
                        Chat Style
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setChatStyle("modern")}
                          className={`p-3 text-sm font-medium ${
                            chatStyle === "modern"
                              ? "text-white bg-blue-600 border-transparent"
                              : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400"
                          } rounded-md border transition-colors`}
                        >
                          Modern
                        </button>
                        <button
                          onClick={() => setChatStyle("classic")}
                          className={`p-3 text-sm font-medium ${
                            chatStyle === "classic"
                              ? "text-white bg-blue-600 border-transparent"
                              : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400"
                          } rounded-md border transition-colors`}
                        >
                          Classic
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  Account Settings
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {isSignedIn ? (
                    <div>
                      {/* Profile Section */}
                      <div className="p-4 md:p-6 space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            {user?.imageUrl ? (
                              <img
                                src={user.imageUrl}
                                alt="Profile"
                                className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                              />
                            ) : (
                              <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-600">
                                <User className="h-6 w-6 md:h-8 md:w-8 text-white" />
                              </div>
                            )}
                            <div>
                              <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                {user?.firstName || user?.username || "User"}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user?.primaryEmailAddress?.emailAddress}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => openUserProfile()}
                            className="w-full flex items-center justify-center p-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                          >
                            Edit Profile
                          </button>
                        </div>
                      </div>

                      {/* Sign Out Button */}
                      <div className="px-4 md:px-6 pb-4 md:pb-6">
                        <SignOutButton>
                          <button className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </button>
                        </SignOutButton>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 md:p-6 space-y-6">
                      <div className="text-center">
                        <User className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                        <h4 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                          Welcome to EchoMind
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Sign in or create an account to access all features
                        </p>
                      </div>
                      <div className="space-y-3">
                        <button
                          onClick={() => openSignIn()}
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </button>
                        <button
                          onClick={() => openSignUp()}
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Create Account
                        </button>
                      </div>
                      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                        By continuing, you agree to our Terms of Service and
                        Privacy Policy
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  OpenRouter API Key
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your API key is stored locally and never sent to our servers.
                  You need this key to use the AI chat features.
                </p>
                <div className="mt-4">
                  <ApiKeyInput />
                </div>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 hover:underline"
                  >
                    Get an API key
                  </a>
                  {" • "}
                  <a
                    href="https://openrouter.ai/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 hover:underline"
                  >
                    Documentation
                  </a>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  About EchoMind
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    EchoMind is an AI chat interface powered by OpenRouter. It
                    allows you to interact with various AI models through a
                    simple and intuitive interface.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Version: 1.0.0
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;

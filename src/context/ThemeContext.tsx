import React, { createContext, useContext, useEffect, useState } from "react";

type FontSize = "small" | "medium" | "large" | "xlarge";
type MessageDensity = "compact" | "comfortable" | "spacious";
type ChatStyle = "modern" | "classic";

interface ThemeContextType {
  isDarkMode: boolean;
  fontSize: FontSize;
  messageDensity: MessageDensity;
  chatStyle: ChatStyle;
  toggleDarkMode: () => void;
  setFontSize: (size: FontSize) => void;
  setMessageDensity: (density: MessageDensity) => void;
  setChatStyle: (style: ChatStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state from localStorage or defaults
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme-mode");
    return saved ? saved === "dark" : false;
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem("font-size");
    return (saved as FontSize) || "medium";
  });

  const [messageDensity, setMessageDensity] = useState<MessageDensity>(() => {
    const saved = localStorage.getItem("message-density");
    return (saved as MessageDensity) || "comfortable";
  });

  const [chatStyle, setChatStyle] = useState<ChatStyle>(() => {
    const saved = localStorage.getItem("chat-style");
    return (saved as ChatStyle) || "modern";
  });

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme-mode", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Apply font size
  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", fontSize);
    localStorage.setItem("font-size", fontSize);
  }, [fontSize]);

  // Apply message density
  useEffect(() => {
    document.documentElement.setAttribute("data-density", messageDensity);
    localStorage.setItem("message-density", messageDensity);
  }, [messageDensity]);

  // Apply chat style
  useEffect(() => {
    document.documentElement.setAttribute("data-chat-style", chatStyle);
    localStorage.setItem("chat-style", chatStyle);
  }, [chatStyle]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSetFontSize = (size: FontSize) => {
    setFontSize(size);
  };

  const handleSetMessageDensity = (density: MessageDensity) => {
    setMessageDensity(density);
  };

  const handleSetChatStyle = (style: ChatStyle) => {
    setChatStyle(style);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        fontSize,
        messageDensity,
        chatStyle,
        toggleDarkMode,
        setFontSize: handleSetFontSize,
        setMessageDensity: handleSetMessageDensity,
        setChatStyle: handleSetChatStyle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

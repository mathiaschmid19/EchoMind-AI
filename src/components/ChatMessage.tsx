import React from "react";
import { User } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export type MessageRole = "user" | "assistant";

// Consistent brand colors
const BRAND_COLORS = {
  primary: "#3B82F6", // Main brand color (blue)
  secondary: "#F9FAFB", // Light background for assistant messages
  accent: "#6366F1", // Accent color for assistant avatar
  textPrimary: "#1F2937", // Dark text
  textLight: "#FFFFFF", // White text
  border: "#E5E7EB", // Light border color
};

interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp?: string;
}

const formatMessage = (content: string, isUser: boolean) => {
  // Split content into paragraphs
  const paragraphs = content.split("\n\n");

  return paragraphs.map((paragraph, index) => {
    // Check if paragraph is a table
    if (paragraph.includes("|") && paragraph.includes("-")) {
      const lines = paragraph.split("\n");
      const header = lines[0]
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean);
      const separator = lines[1]
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean);
      const rows = lines.slice(2).map((line) =>
        line
          .split("|")
          .map((cell) => cell.trim())
          .filter(Boolean)
      );

      return (
        <div key={index} className="my-4 overflow-x-auto">
          <table
            className={`min-w-full border-collapse ${
              isUser ? "text-white" : "text-gray-800"
            }`}
          >
            <thead>
              <tr className="border-b border-gray-200">
                {header.map((cell, i) => (
                  <th
                    key={i}
                    className={`px-4 py-2 text-left font-medium ${
                      isUser ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {cell.replace(/\*\*/g, "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b border-gray-200 ${
                    rowIndex % 2 === 0
                      ? isUser
                        ? "bg-blue-600/10"
                        : "bg-gray-50"
                      : ""
                  }`}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-4 py-2 ${
                        isUser ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {cell.replace(/\*\*/g, "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Check if paragraph is a code block
    if (paragraph.startsWith("```") && paragraph.endsWith("```")) {
      const code = paragraph.slice(3, -3).trim();
      const language = code.split("\n")[0].trim();
      const codeContent = code.split("\n").slice(1).join("\n");

      return (
        <div key={index} className="my-2">
          <SyntaxHighlighter
            language={language || "javascript"}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      );
    }

    // Check if paragraph is a list
    if (paragraph.startsWith("- ") || paragraph.startsWith("* ")) {
      const items = paragraph.split("\n");
      return (
        <ul key={index} className="list-disc list-inside my-2 space-y-1">
          {items.map((item, i) => (
            <li key={i} className={isUser ? "text-white" : "text-gray-800"}>
              {item.replace(/^[-*]\s+/, "")}
            </li>
          ))}
        </ul>
      );
    }

    // Regular paragraph
    return (
      <p
        key={index}
        className={`my-2 ${isUser ? "text-white" : "text-gray-800"}`}
      >
        {paragraph}
      </p>
    );
  });
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  timestamp,
}) => {
  const isUser = role === "user";

  return (
    <div className="py-4 bg-white animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div
          className={`flex items-start ${
            isUser ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* Avatar */}
          <div className={`mt-1 ${isUser ? "ml-4" : "mr-4"}`}>
            {!isUser ? (
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>

          {/* Message content */}
          <div className={`flex-1 ${isUser ? "text-right" : "text-left"}`}>
            <div
              className={`flex items-center mb-1 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div className="font-medium text-sm text-gray-800">
                {!isUser ? "EchoMind" : "You"}
              </div>
              {timestamp && (
                <div className="text-xs text-gray-500 ml-2">{timestamp}</div>
              )}
            </div>
            <div
              className={`inline-block text-sm ${
                isUser
                  ? "bg-blue-500 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl px-4 py-2 max-w-[80%]"
                  : "bg-gray-50 text-gray-800 rounded-tl-xl rounded-tr-xl rounded-br-xl px-4 py-2 border border-gray-200 max-w-[80%]"
              }`}
            >
              {formatMessage(content, isUser)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

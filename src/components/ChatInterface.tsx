import { useRef, useEffect } from "react";
import { useOpenRouter } from "@/hooks/useOpenRouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const listSchema = {
  name: "list",
  strict: true,
  schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        description: "List of items",
        items: {
          type: "string",
          description: "Individual item in the list",
        },
      },
    },
    required: ["items"],
    additionalProperties: false,
  },
};

export const ChatInterface = () => {
  const { messages, isLoading, error, sendMessage, clearMessages } =
    useOpenRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    if (!textarea || !textarea.value.trim() || isLoading) return;

    const message = textarea.value;
    textarea.value = "";

    // Check if the message is asking for a list
    const isListRequest =
      message.toLowerCase().includes("list") ||
      message.toLowerCase().includes("ideas") ||
      message.toLowerCase().includes("suggestions");

    await sendMessage(message, isListRequest ? listSchema : undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatContent = (content: string) => {
    try {
      // Try to parse as JSON if it's a structured output
      const parsed = JSON.parse(content);
      if (parsed.items && Array.isArray(parsed.items)) {
        return parsed.items
          .map((item: string, index: number) => `${index + 1}. ${item}`)
          .join("\n\n");
      }
      return content;
    } catch {
      return content;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {message.role === "user" ? (
                    message.content
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-3 prose-headings:my-4 prose-ul:my-3 prose-ol:my-3 prose-li:my-2 prose-table:my-4 prose-th:p-2 prose-td:p-2 prose-strong:font-bold prose-strong:text-gray-900">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1 className="text-2xl font-bold" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-xl font-bold" {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 className="text-lg font-bold" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p
                              className="whitespace-pre-wrap leading-relaxed"
                              {...props}
                            />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-disc pl-6 space-y-2"
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              className="list-decimal pl-6 space-y-3"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li
                              className="whitespace-pre-wrap leading-relaxed"
                              {...props}
                            />
                          ),
                          code: ({ node, className, ...props }) => (
                            <code
                              className={`${
                                className?.includes("language-")
                                  ? "bg-gray-100 dark:bg-gray-800 rounded p-2 block overflow-x-auto"
                                  : "bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5"
                              }`}
                              {...props}
                            />
                          ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="border-l-4 border-gray-300 pl-4 italic my-2"
                              {...props}
                            />
                          ),
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto">
                              <table
                                className="border-collapse border border-gray-300"
                                {...props}
                              />
                            </div>
                          ),
                          th: ({ node, ...props }) => (
                            <th
                              className="border border-gray-300 bg-gray-100 font-bold"
                              {...props}
                            />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="border border-gray-300" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong
                              className="font-bold text-gray-900"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {formatContent(message.content)}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-gray-200 text-gray-900">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      {error && <div className="p-4 text-red-500 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex flex-col space-y-2">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message..."
            disabled={isLoading}
            className="min-h-[80px] max-h-[200px] resize-none"
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearMessages}
              disabled={isLoading}
            >
              Clear
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

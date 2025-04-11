import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignIn";
import { ClerkProvider, UserProfile } from "@clerk/clerk-react";
import { rootAuthLoader } from "@clerk/react-router/ssr.server";

const queryClient = new QueryClient();

// Get environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = import.meta.env.VITE_CLERK_SECRET_KEY;

// Validate environment variables
if (!clerkPubKey) {
  console.error(
    "Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file"
  );
}

if (!clerkSecretKey) {
  console.error(
    "Missing Clerk Secret Key. Please add VITE_CLERK_SECRET_KEY to your .env file"
  );
}

const App = () => {
  if (!clerkPubKey || !clerkSecretKey) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Configuration Error
          </h1>
          <p className="mt-2">
            Please check your environment variables and restart the application.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <ClerkProvider
            publishableKey={clerkPubKey}
            appearance={{
              baseTheme: undefined,
              elements: {
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                footerActionLink: "text-blue-600 hover:text-blue-700",
              },
            }}
          >
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/" element={<Index />} loader={rootAuthLoader} />
                <Route
                  path="/user-profile/*"
                  element={
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                      <UserProfile
                        appearance={{
                          elements: {
                            navbar: "bg-white dark:bg-gray-800",
                            navbarButton:
                              "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                            card: "bg-white dark:bg-gray-800 shadow-none border dark:border-gray-700",
                            headerTitle: "text-gray-900 dark:text-white",
                            headerSubtitle: "text-gray-600 dark:text-gray-400",
                            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                            formButtonReset:
                              "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300",
                            formFieldInput:
                              "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
                            formFieldLabel: "text-gray-700 dark:text-gray-300",
                          },
                        }}
                        routing="path"
                        path="/user-profile"
                      />
                    </div>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ClerkProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

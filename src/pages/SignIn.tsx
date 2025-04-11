import { SignIn } from "@clerk/react-router";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>
        <SignIn
          appearance={{
            baseTheme: undefined,
            elements: {
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
              footerActionLink: "text-blue-600 hover:text-blue-700",
              formFieldInput:
                "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
              formFieldLabel: "text-gray-700 dark:text-gray-300",
              socialButtonsBlockButton: "border-gray-300 dark:border-gray-600",
            },
          }}
          routing="path"
          path="/sign-in"
        />
      </div>
    </div>
  );
};

export default SignInPage;

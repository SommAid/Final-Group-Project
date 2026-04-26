"use client";

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import React from "react";

const config = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || "",
    },
  },
};

// Debug log to ensure env variables are loaded correctly
console.log("DEBUG CONFIG:", config);

// Configure at the module level (outside the component) to execute synchronously
Amplify.configure(config, { ssr: true });

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator.Provider>
      <div className="flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950">
        <Authenticator
          hideSignUp={false}
          loginMechanisms={['email']}
        >
          {children}
        </Authenticator>

      </div>
    </Authenticator.Provider>
  );
}

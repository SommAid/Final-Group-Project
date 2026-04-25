"use client";

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import React from "react";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || "",
    },
  },
});

export default function AmplifyAuth({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator.Provider>
      <div className="flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950">
        <Authenticator hideSignUp={false}>
          {children}
        </Authenticator>
      </div>
    </Authenticator.Provider>
  );
}
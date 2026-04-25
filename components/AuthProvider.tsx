"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the Amplify Auth component with SSR disabled.
// This completely solves the React Hydration Error (#423) caused by 
// the Amplify Authenticator attempting to render on the server.
const AmplifyAuthNoSSR = dynamic(() => import("./AmplifyAuth"), {
  ssr: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AmplifyAuthNoSSR>{children}</AmplifyAuthNoSSR>;
}
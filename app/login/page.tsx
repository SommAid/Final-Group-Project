export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Retail Analytics</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Secure login via AWS Cognito (OIDC)
          </p>
        </div>
        
        <a
          href="/api/auth/login"
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 mt-6"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
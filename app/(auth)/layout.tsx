export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-bg relative flex min-h-svh items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-[420px] animate-fade-in">
        {children}
      </div>
    </div>
  );
}

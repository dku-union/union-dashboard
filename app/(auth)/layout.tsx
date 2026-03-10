export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-bg relative flex min-h-svh items-center justify-center p-4 overflow-hidden">
      {/* Geometric grid background */}
      <div className="absolute inset-0 geo-grid" />

      {/* Decorative elements */}
      <div className="absolute top-[15%] left-[10%] w-24 h-24 border border-union/20 rotate-45 animate-float" />
      <div className="absolute bottom-[20%] right-[8%] w-16 h-16 border border-foreground/10 rotate-12 animate-float delay-4" />
      <div className="absolute top-[60%] left-[5%] w-2 h-2 rounded-full bg-union/40" />
      <div className="absolute top-[30%] right-[15%] w-3 h-3 rounded-full bg-union/20" />

      <div className="relative z-10 w-full max-w-[420px] animate-scale-in">
        {children}
      </div>
    </div>
  );
}

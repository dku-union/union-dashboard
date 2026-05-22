import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

// LoginForm 내부에서 useSearchParams 를 사용하므로 prerender 단계에서
// Suspense 경계가 필요. (Next.js 16 / CSR bailout)
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

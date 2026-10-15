import AuthShell, { type AuthMode } from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    mode?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  const mode: AuthMode =
    params.mode === "local" ? "local" : "visitor";

  return (
    <AuthShell mode={mode} type="login">
      <LoginForm mode={mode} />
    </AuthShell>
  );
}
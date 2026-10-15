import AuthShell, { type AuthMode } from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignUpForm";

type SignupPageProps = {
  searchParams: Promise<{
    mode?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  const mode: AuthMode =
    params.mode === "local" ? "local" : "visitor";

  return (
    <AuthShell mode={mode} type="signup">
      <SignupForm mode={mode} />
    </AuthShell>
  );
}
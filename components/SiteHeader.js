import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/current-user";

export default async function SiteHeader() {
  const me = await getCurrentUser();

  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          FixNear
        </Link>

        <nav className="nav" aria-label="Main">
          {me && <Link href="/providers" className="nav-home">Find providers</Link>}
          {me?.role === "CUSTOMER" && <Link href="/bookings">My bookings</Link>}
          {me?.role === "PROVIDER" && <Link href="/provider">Dashboard</Link>}

          <Show when="signed-out">
            <SignInButton>
              <button className="btn btn-ghost btn-sm">Sign in</button>
            </SignInButton>
            <SignUpButton>
              <button className="btn btn-primary btn-sm">Sign up</button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/current-user";
import { CATEGORIES } from "@/lib/constants";

export default async function LandingPage() {
  // Signed-in users skip the landing page
  const { userId } = await auth();
  if (userId) {
    const me = await getCurrentUser();
    if (!me) redirect("/onboarding");
    redirect(me.role === "PROVIDER" ? "/provider" : "/providers");
  }

  return (
    <main>
      <section className="landing-hero">
        <div className="wrap">
          <h1>Book a trusted electrician, plumber or AC technician in your area</h1>
          <p>
            FixNear connects you with local service providers. See their prices before you book,
            pick a time, and pay after the job is done.
          </p>
          <div className="actions" style={{ marginTop: "1.75rem" }}>
            <SignUpButton>
              <button className="btn btn-primary">Create a free account</button>
            </SignUpButton>
            <a href="#how" className="btn btn-ghost">See how it works</a>
          </div>
          <ul className="category-strip" aria-label="Services on FixNear">
            {CATEGORIES.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </section>

      <section id="how" className="wrap landing-section">
        <h2>How it works</h2>
        <ol className="steps">
          <li>
            <h3>Search your area</h3>
            <p>Choose a service and type your area to see providers who work near you.</p>
          </li>
          <li>
            <h3>Compare and book</h3>
            <p>Check each provider&apos;s experience, prices and reviews, then send a booking request for a time that suits you.</p>
          </li>
          <li>
            <h3>Get it fixed</h3>
            <p>Once the provider accepts, you get their phone number. After the job, leave a review to help your neighbours.</p>
          </li>
        </ol>
      </section>

      <section className="wrap landing-section">
        <div className="audience">
          <div className="panel">
            <h2>For customers</h2>
            <ul className="checks">
              <li>Prices are listed before you book, so there are no surprises</li>
              <li>The price you booked at stays fixed, even if the provider changes it later</li>
              <li>Cancel a request any time before it&apos;s accepted</li>
            </ul>
          </div>
          <div className="panel">
            <h2>For service providers</h2>
            <ul className="checks">
              <li>Set up a profile and list your services with your own prices</li>
              <li>Accept or decline each request from your dashboard</li>
              <li>Your number is shared only with customers you accept</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap landing-section">
        <h2>Why the reviews can be trusted</h2>
        <p>
          Only customers whose booking was completed can review a provider, and each booking gets one review.
          No one can post a review for a job that didn&apos;t happen.
        </p>
      </section>

      <section className="landing-cta">
        <div className="wrap">
          <h2>Ready to get started?</h2>
          <p>Sign up to browse providers near you, or to offer your own services.</p>
          <div className="actions">
            <SignUpButton>
              <button className="btn btn-primary">Sign up</button>
            </SignUpButton>
            <SignInButton>
              <button className="btn btn-ghost">I already have an account</button>
            </SignInButton>
          </div>
        </div>
      </section>

      <footer className="wrap site-footer">
        <span>FixNear. Built with Next.js, Prisma and PostgreSQL.</span>
        <Link href="#how">How it works</Link>
      </footer>
    </main>
  );
}

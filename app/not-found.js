import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Page not found</h1>
      <p>We couldn't find what you were looking for.</p>
      <p><Link href="/">← Back to FixNear</Link></p>
    </main>
  );
}
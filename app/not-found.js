import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap page">
      <h1>This page doesn&apos;t exist</h1>
      <p className="muted" style={{ marginTop: "0.5rem" }}>The link may be old, or the provider may have left FixNear.</p>
      <p style={{ marginTop: "1.25rem" }}><Link href="/providers" className="btn btn-primary">Find providers</Link></p>
    </main>
  );
}

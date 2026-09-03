"use client";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="not-found"><div><p className="section-label">Please try again</p><h1>Something went wrong.</h1><button className="button button-primary" onClick={reset}>Try again</button></div></main>; }

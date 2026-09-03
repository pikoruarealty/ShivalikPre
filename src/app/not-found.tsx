import Link from "next/link";
import { Container } from "@/components/layout/container";
export default function NotFound() { return <main className="not-found"><Container><p className="section-label">404</p><h1>Page not found.</h1><Link className="button button-primary" href="/">Return to Présenté</Link></Container></main>; }

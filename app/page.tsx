import { redirect } from "next/navigation";

export default function Home() {
  // Temporary redirect to login page
  // In Week 7 (Authentication), this will check auth status:
  // - If authenticated: redirect to /dashboard
  // - If not authenticated: redirect to /login
  redirect("/login");
}

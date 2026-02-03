import { redirect } from "next/navigation";

export default function Home() {
  // Temporary redirect to login page
  redirect("/login");
}

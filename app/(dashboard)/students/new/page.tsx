import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Add Student - SMMS",
};

export default function NewStudentPage() {
  redirect("/users/new?role=student");
}

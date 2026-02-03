import type { Metadata } from "next";
import UserForm from "./UserForm";

export const metadata: Metadata = {
  title: "Add User - SMMS",
};

export default function NewUserPage() {
  return <UserForm />;
}

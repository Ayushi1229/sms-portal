import type { Metadata } from "next";
import EditUserForm from "./EditUserForm";

export const metadata: Metadata = {
  title: "Edit User - SMMS",
};

export default function EditUserPage({ params }: { params: { id: string } }) {
  return <EditUserForm />;
}

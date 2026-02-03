import type { Metadata } from "next";
import UsersList from "./UsersList";

export const metadata: Metadata = {
  title: "Users - SMMS",
};

export default function UsersPage() {
  return <UsersList />;
}

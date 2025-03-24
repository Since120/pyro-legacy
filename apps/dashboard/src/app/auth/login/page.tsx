import { redirect } from "next/navigation";

export default function LoginPage() {
  // Redirect to the signin page
  redirect("/auth/signin");
}

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const u = await getCurrentUser();
      setUser(u);
    }

    loadUser();
  }, []);

  if (!user) {
    return <p>No user logged in</p>;
  }

  return (
    <div>
      <h2>User Info</h2>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
    </div>
  );
}
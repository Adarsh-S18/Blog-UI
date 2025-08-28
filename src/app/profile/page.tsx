"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Title,
  Card,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }
    api
      .get("/user")
      .then((r) => setUser(r.data))
      .catch(() => {});
  }, []);

  const update = async () => {
    try {
      await api.put("/user", {
        name: user.name,
        password: password || undefined,
      });
      notifications.show({ message: "Updated", color: "green" });
    } catch (e: any) {
      notifications.show({
        message: e.response?.data?.error || "Error",
        color: "red",
      });
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder mx="auto" mt="xl" maw={600}>
      <Stack p="xl" maw={500}>
        <Title order={2}>Profile</Title>
        <TextInput
          label="Name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.currentTarget.value })}
        />
        <TextInput label="Email" value={user.email} disabled />
        <PasswordInput
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Button onClick={update}>Save</Button>
      </Stack>
    </Card>
  );
}

"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Title,
  Text,
  Card,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const submit = async () => {
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("auth-changed"));
      notifications.show({ message: "Logged in", color: "green" });
      if (data.user.role === "admin") {
        router.push("/admin/posts");
      } else {
        router.push("/posts");
      }
    } catch (e: any) {
      notifications.show({
        message: e.response?.data?.error || "Error",
        color: "red",
      });
    }
  };
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder mx="auto" mt="xl" maw={600}>
      <Stack p="xl" maw={600}>
        <Title order={2} style={{ textAlign: "center" }}>
          Welcome back!
        </Title>
        <TextInput
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
        />
        <PasswordInput
          label="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.currentTarget.value })
          }
        />
        <Button onClick={submit}>Login</Button>
        <Text size="sm" c="dimmed" style={{ textAlign: "center" }}>
          Haven't registered yet?{" "}
          <Link href="/register">Click here to register</Link>
        </Text>
      </Stack>
    </Card>
  );
}

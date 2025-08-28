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

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();
  const submit = async () => {
    try {
      await api.post("/auth/register", form);
      notifications.show({
        message: "Registered. Please login",
        color: "green",
      });
      router.push("/login");
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
          Start your journey
        </Title>
        <TextInput
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
        />
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
        <Button onClick={submit}>Register</Button>
        <Text size="sm" c="dimmed" style={{ textAlign: "center" }}>
          Already have an account? <Link href="/login">Login here</Link>
        </Text>
      </Stack>
    </Card>
  );
}

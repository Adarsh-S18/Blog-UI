"use client";
import { Tabs, Container, Title } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    // decode payload (naive, not verifying signature client side)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    } catch {}
  }, []);
  if (role === null) return null;
  if (role !== "admin") return <Container py="xl">Not authorized</Container>;
  return (
    <Container py="xl">
      <Title order={2} mb="lg">
        Admin Panel
      </Title>
      {children}
    </Container>
  );
}

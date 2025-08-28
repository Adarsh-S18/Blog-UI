"use client";

import Link from "next/link";
import {
  Title,
  Text,
  Stack,
  Button,
  Group,
  Paper,
  List,
  ThemeIcon,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

export default function Home() {
  return (
    <Stack p="xl" gap="lg" style={{ minHeight: "80vh", justifyContent: "center" }}>
      <Paper
        radius="xl"
        p="xl"
        shadow="lg"
        withBorder
        style={{
          background: "linear-gradient(135deg,#eaf3ff 0%,#f3f8ff 100%)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Title order={1} mb="sm" style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-1px", color: "#2a2a4a" }}>
            Welcome to BlogApp!
          </Title>
          <Text size="lg" mb="md" c="dimmed" style={{ fontSize: 20 }}>
            Discover, create, and share blog posts with the community.<br />
            Easily manage your profile and posts, and explore content from other users.<br />
            <span style={{ color: "#4f6ef7", fontWeight: 600 }}>Start your blogging journey today!</span>
          </Text>
        </div>
        <Text size="md" mb="md" c="dimmed" style={{ textAlign: "center", fontWeight: 500 }}>
          What you can do as a user:
        </Text>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <List
            spacing="sm"
            size="md"
            icon={
              <ThemeIcon
                size={22}
                radius="xl"
                color="brand"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconCheck size={14} />
              </ThemeIcon>
            }
            mb="lg"
            style={{ maxWidth: 400 }}
          >
            <List.Item>Browse and read blog posts from other users.</List.Item>
            <List.Item>Create your own blog posts and share your ideas.</List.Item>
            <List.Item>Edit or delete your posts anytime.</List.Item>
            <List.Item>See all posts you’ve created in one place.</List.Item>
          </List>
        </div>
        <Group justify="center" mt="xl">
          <Button
            component={Link}
            href="/posts"
            size="lg"
            color="brand"
            variant="gradient"
            gradient={{ from: "brand.5", to: "brand.7" }}
            style={{ boxShadow: "0 2px 12px rgba(80,80,200,0.12)", fontWeight: 700, fontSize: 18, padding: "0.75rem 2rem" }}
          >
            Explore Posts
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}

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
    <Stack p="xl" gap="lg">
      <Paper
        radius="md"
        p="xl"
        shadow="sm"
        withBorder
        style={{
          background: "linear-gradient(135deg,#ffffff,#f3f8ff)",
        }}
      >
        <Title order={1} mb="sm">
          Welcome to BlogApp!
        </Title>
        <Text size="lg" mb="md" c="dimmed">
          Discover, create, and share blog posts with the community. Easily manage your profile and posts, and explore content from other users. Start your blogging journey today!
        </Text>
        <Text size="md" mb="md" c="dimmed">
          What you can do as a user:
        </Text>
        <List
          spacing="sm"
          size="sm"
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
        >
          <List.Item>Register and log in to your account securely.</List.Item>
          <List.Item>Browse and read blog posts from other users.</List.Item>
          <List.Item>Create your own blog posts and share your ideas.</List.Item>
          <List.Item>Edit or delete your posts anytime.</List.Item>
          <List.Item>Search for posts and use pagination to explore more content.</List.Item>
          <List.Item>View and update your profile information.</List.Item>
          <List.Item>See all posts you’ve created in one place.</List.Item>
        </List>
        <Group>
          <Button
            component={Link}
            href="/posts"
            size="md"
            color="brand"
            variant="gradient"
            gradient={{ from: "brand.5", to: "brand.7" }}
          >
            Explore Posts
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}

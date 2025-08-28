"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Skeleton,
  ActionIcon,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000/api";

export default function PostDetail({ params }: any) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/posts/${params.id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <Paper
      maw={900}
      mx="auto"
      p="xl"
      withBorder
      shadow="sm"
      radius="md"
      mt="lg"
    >
      <Group mb="md" justify="space-between">
        <Button
          component={Link}
          href="/posts"
          variant="subtle"
          leftSection={<IconArrowLeft size={18} />}
        >
          Back to posts
        </Button>
      </Group>
      {loading ? (
        <Stack>
          <Skeleton height={34} width="60%" />
          <Skeleton height={16} width="40%" />
          <Skeleton height={200} />
        </Stack>
      ) : !post?.title ? (
        <Text c="red">Post not found</Text>
      ) : (
        <Stack>
          <Title order={2}>{post.title}</Title>
          <Text size="sm" c="dimmed">
            Author: {post.author?.name}
          </Text>
          <Text style={{ lineHeight: 1.6, fontSize: 16, wordBreak: "break-word" }}>{post.content}</Text>
        </Stack>
      )}
    </Paper>
  );
}

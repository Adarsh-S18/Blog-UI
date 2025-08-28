"use client";
import { useState } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Paper,
  Stack,
  Title,
  Center,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (!title.trim() || !content.trim()) {
      notifications.show({
        message: "Title and content required",
        color: "red",
      });
      return;
    }
    setLoading(true);
    try {
      await api.post("/posts", { title, content });
      notifications.show({ message: "Post created", color: "green" });
      router.push("/posts");
    } catch (e: any) {
      notifications.show({
        message: e.response?.data?.error || "Failed to create post",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center style={{ minHeight: "calc(100vh - 72px)" }}>
      <Paper
        maw={700}
        w="100%"
        mx="auto"
        p="xl"
        withBorder
        shadow="sm"
        radius="md"
        style={{ position: "relative" }}
      >
        {loading && (
          <Center
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.65)",
              zIndex: 10,
            }}
          >
            <Loader color="brand" />
          </Center>
        )}
        <Stack>
          <Title order={2}>New Post</Title>
          <TextInput
            label="Title"
            placeholder="Enter a descriptive title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            required
          />
          <Textarea
            label="Content"
            description="Write your post here"
            placeholder="Start writing..."
            minRows={8}
            autosize
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            required
          />
          <Button onClick={submit} disabled={loading} color="brand">
            Publish
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
}

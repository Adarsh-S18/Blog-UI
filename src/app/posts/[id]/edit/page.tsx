"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { notifications } from "@mantine/notifications";
import {
  TextInput,
  Textarea,
  Button,
  Stack,
  Title,
  Paper,
  Center,
  Loader,
} from "@mantine/core";

export default function EditPostPage({ params }: any) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/posts/${params.id}`);
        setForm({ title: res.data.title, content: res.data.content });
      } catch (e: any) {
        notifications.show({
          message: e.response?.data?.error || "Load failed",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      notifications.show({
        message: "Title and content required",
        color: "red",
      });
      return;
    }
    setSaving(true);
    try {
      await api.put(`/posts/${params.id}`, form);
      notifications.show({ message: "Updated", color: "green" });
      router.push(`/posts/${params.id}`);
    } catch (e: any) {
      notifications.show({
        message: e.response?.data?.error || "Update failed",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Center style={{ minHeight: "calc(100vh - 72px)" }}>
        <Loader color="brand" />
      </Center>
    );
  }

  return (
    <Center style={{ minHeight: "calc(100vh - 72px)" }}>
      <Paper maw={700} w="100%" p="xl" withBorder shadow="sm" radius="md">
        <Stack>
          <Title order={2}>Edit Post</Title>
          <TextInput
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.currentTarget.value })}
            required
          />
          <Textarea
            label="Content"
            minRows={8}
            autosize
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.currentTarget.value })
            }
            required
          />
          <Button onClick={save} loading={saving} color="brand">
            Save Changes
          </Button>
          <Button variant="subtle" onClick={() => router.back()}>
            Cancel
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
}

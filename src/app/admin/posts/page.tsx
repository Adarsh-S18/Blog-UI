"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  TextInput,
  Button,
  Table,
  Group,
  ActionIcon,
  Modal,
  Textarea,
  Pagination,
  Badge,
  Stack,
} from "@mantine/core";
import { IconTrash, IconEdit, IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

interface Post {
  _id: string;
  title: string;
  content: string;
  author?: { name: string; email: string };
  createdAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [q, setQ] = useState("");
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const router = useRouter();

  const load = async () => {
    try {
      const { data } = await api.get(
        `/admin/posts?q=${encodeURIComponent(
          q
        )}&page=${page}&pageSize=${pageSize}`
      );
      setPosts(data.data);
      setTotal(data.total);
    } catch (e: any) {
      notifications.show({
        message: e.response?.data?.error || "Load failed",
        color: "red",
      });
    }
  };
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }
    load();
  }, [page]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", content: "" });
    setOpened(true);
  };
  const openEdit = (p: Post) => {
    setEditing(p);
    setForm({ title: p.title, content: p.content });
    setOpened(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    try {
      if (editing) {
        await api.put("/admin/posts", { id: editing._id, ...form });
        notifications.show({ message: "Post updated", color: "green" });
      } else {
        await api.post("/admin/posts", form);
        notifications.show({ message: "Post created", color: "green" });
      }
      setOpened(false);
      load();
    } catch (e: any) {
      notifications.show({
        message: e.response?.data?.error || "Save failed",
        color: "red",
      });
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete post?")) return;
    try {
      await api.delete(`/admin/posts?id=${id}`);
      notifications.show({ message: "Deleted", color: "green" });
      load();
    } catch (e: any) {
      notifications.show({
        message: e.response?.data?.error || "Delete failed",
        color: "red",
      });
    }
  };

  return (
    <Stack>
      <Group justify="space-between" mb="sm">
        <TextInput
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          style={{ flexGrow: 1 }}
        />
        <Button
          onClick={() => {
            setPage(1);
            load();
          }}
        >
          Search
        </Button>
        <Button leftSection={<IconPlus size={16} />} onClick={openNew}>
          New
        </Button>
      </Group>
      <Table striped withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Author</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {posts.map((p) => (
            <Table.Tr key={p._id}>
              <Table.Td>{p.title}</Table.Td>
              <Table.Td>
                {p.author?.name || "—"}{" "}
                <Badge size="xs" ml={4}>
                  {p.author?.email}
                </Badge>
              </Table.Td>
              <Table.Td>{new Date(p.createdAt).toLocaleString()}</Table.Td>
              <Table.Td>
                <Group gap={4} justify="flex-end">
                  <ActionIcon
                    variant="subtle"
                    color="brand"
                    onClick={() => openEdit(p)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => del(p._id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
          {posts.length === 0 && (
            <Table.Tr>
              <Table.Td
                colSpan={4}
                style={{ textAlign: "center", opacity: 0.6 }}
              >
                No posts
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
      <Pagination
        total={Math.ceil(total / pageSize) || 1}
        value={page}
        onChange={setPage}
      />
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? "Edit Post" : "New Post"}
        size="lg"
      >
        <TextInput
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.currentTarget.value })}
          required
          mb="sm"
        />
        <Textarea
          label="Content"
          minRows={6}
          autosize
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.currentTarget.value })}
          required
          mb="md"
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setOpened(false)}>
            Cancel
          </Button>
          <Button onClick={save}>{editing ? "Save" : "Create"}</Button>
        </Group>
      </Modal>
    </Stack>
  );
}

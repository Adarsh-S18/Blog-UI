"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  TextInput,
  Pagination,
  Flex,
  ActionIcon,
  SimpleGrid,
  Skeleton,
  Paper,
  Text,
  Badge,
} from "@mantine/core";
import { api } from "@/lib/api";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const pageSize = 9;

export default function MyPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/posts?q=${encodeURIComponent(
          q
        )}&mine=1&page=${page}&pageSize=${pageSize}`
      );
      setPosts(res.data.data);
      setTotal(res.data.total);
    } catch (e: any) {
      notifications.show({
        message: e.response?.data?.error || "Error loading",
        color: "red",
      });
    } finally {
      setLoading(false);
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

  const del = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
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
    <Stack p="xl" maw={1200} mx="auto" gap="lg">
      <Paper
        withBorder
        p="lg"
        radius="md"
        style={{
          background: "linear-gradient(135deg,#eef5ff,#f5f9ff)",
        }}
      >
        <Group justify="space-between" align="flex-start" mb="sm">
          <div>
            <Title order={2} style={{ marginBottom: 4 }}>
              My Posts
            </Title>
            <Text size="sm" c="dimmed">
              Manage your published thoughts
            </Text>
          </div>
          <Button component={Link} href="/posts/new" color="brand">
            + New Post
          </Button>
        </Group>
        <Flex
          mt="xs"
          gap="sm"
          wrap="wrap"
          align="center"
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          <TextInput
            placeholder="Search my posts..."
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            style={{ flexGrow: 1, minWidth: 320 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                load();
              }
            }}
          />
          <Button
            onClick={() => {
              setPage(1);
              load();
            }}
          >
            Search
          </Button>
        </Flex>
      </Paper>

      {loading && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} withBorder radius="md" shadow="sm" p="md">
              <Skeleton height={22} mb="sm" />
              <Skeleton height={12} style={{ width: "50%" }} mb="md" />
              <Skeleton height={70} />
            </Card>
          ))}
        </SimpleGrid>
      )}

      {!loading && posts.length === 0 && (
        <Card
          withBorder
          shadow="xs"
          radius="md"
          p="xl"
          style={{ textAlign: "center", opacity: 0.8 }}
        >
          You have not created any posts yet.
        </Card>
      )}

      {!loading && posts.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {posts.map((p) => (
            <Card
              key={p._id}
              withBorder
              radius="md"
              shadow="sm"
              p="md"
              style={{ position: "relative" }}
            >
              <Flex direction="column" gap={6} style={{ minHeight: 120 }}>
                <Title order={4} style={{ lineHeight: 1.3 }}>
                  <Link href={`/posts/${p._id}`}>{p.title}</Link>
                </Title>
                <Text size="xs" c="dimmed">
                  {new Date(p.createdAt).toLocaleDateString()}
                </Text>
                <Text size="sm" lineClamp={4} c="dark.6">
                  {p.content?.slice(0, 280) || ""}
                </Text>
                <Group justify="space-between" mt="auto" pt="xs">
                  <Group gap={4}>
                    <ActionIcon
                      variant="subtle"
                      color="brand"
                      onClick={() => router.push(`/posts/${p._id}/edit`)}
                      aria-label="Edit"
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => del(p._id)}
                      aria-label="Delete"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Flex>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Group justify="center">
        <Pagination
          total={Math.ceil(total / pageSize) || 1}
          value={page}
          onChange={setPage}
        />
      </Group>
    </Stack>
  );
}

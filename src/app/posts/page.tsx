"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TextInput,
  Button,
  Group,
  Pagination,
  Card,
  Stack,
  Title,
  Flex,
  Text,
  Badge,
  SimpleGrid,
  Skeleton,
  ActionIcon,
  Paper,
} from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000/api";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 9;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/posts?q=${encodeURIComponent(
          q
        )}&page=${page}&pageSize=${pageSize}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      setPosts(data.data);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [page]);

  const totalPages = Math.ceil(total / pageSize) || 1;

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
        <Title order={2} style={{ marginBottom: 4 }}>
          Posts
        </Title>
        <Text size="sm" c="dimmed">
          Where words spark ideas
        </Text>
        <Flex
          mt="md"
          gap="sm"
          wrap="wrap"
          align="center"
          style={{ marginTop: "1rem" }}
        >
          <TextInput
            placeholder="Search articles..."
            value={q}
            leftSection={<IconSearch size={16} />}
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
              <Skeleton height={12} style={{ width: "60%" }} mb="md" />
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
          No posts found.
        </Card>
      )}

      {!loading && posts.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {posts.map((p) => (
            <Card
              key={p._id}
              withBorder
              radius="md"
              shadow="md"
              p="md"
              style={{
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 12px rgba(80,80,200,0.10)",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.01)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(80,80,200,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(80,80,200,0.1)";
              }}
            >
              <Flex direction="column" gap={8} style={{ minHeight: 100 }}>
                <Title order={4} style={{ lineHeight: 1.3, textAlign: "center" , }}>
                    <Link href={`/posts/${p._id}`} style={{ textDecoration: "none", color: "#1a227ef3" }}>{p.title}</Link>
                </Title>
                <Text size="xs" style={{ textAlign: "center" }}>
                   <span style={{ color: "#f74f4fff", fontWeight: 600 }}>{p.author?.name || "Unknown"}</span>
                </Text>
                <Text size="sm" lineClamp={4} c="dark.6" style={{ textAlign: "center" }}>
                  {p.content?.slice(0, 300) || ""}
                </Text>
              </Flex>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Group justify="center">
        <Pagination total={totalPages} value={page} onChange={setPage} />
      </Group>
    </Stack>
  );
}

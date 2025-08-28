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
  PasswordInput,
  Select,
  Pagination,
  Stack,
  Badge,
} from "@mantine/core";
import { IconTrash, IconEdit, IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [q, setQ] = useState("");
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [page, setPage] = useState(1);
  const pageSize = 50; // simple client side pagination for now
  const router = useRouter();

  const filtered = users.filter(
    (u) =>
      !q ||
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
  );
  const pageCount = Math.ceil(filtered.length / pageSize) || 1;
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const load = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
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
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", email: "", password: "", role: "user" });
    setOpened(true);
  };
  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setOpened(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    try {
      if (editing) {
        await api.put("/admin/users", {
          id: editing._id,
          name: form.name,
          password: form.password || undefined,
          role: form.role,
        });
        notifications.show({ message: "User updated", color: "green" });
      } else {
        await api.post("/admin/users", form);
        notifications.show({ message: "User created", color: "green" });
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
    if (!confirm("Delete user?")) return;
    try {
      await api.delete(`/admin/users?id=${id}`);
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
        <Button onClick={openNew} leftSection={<IconPlus size={16} />}>
          New
        </Button>
      </Group>
      <Table striped withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {visible.map((u) => (
            <Table.Tr key={u._id}>
              <Table.Td>{u.name}</Table.Td>
              <Table.Td>{u.email}</Table.Td>
              <Table.Td>
                <Badge color={u.role === "admin" ? "red" : "gray"}>
                  {u.role}
                </Badge>
              </Table.Td>
              <Table.Td>{new Date(u.createdAt).toLocaleDateString()}</Table.Td>
              <Table.Td>
                <Group gap={4} justify="flex-end">
                  <ActionIcon
                    variant="subtle"
                    color="brand"
                    onClick={() => openEdit(u)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => del(u._id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
          {visible.length === 0 && (
            <Table.Tr>
              <Table.Td
                colSpan={5}
                style={{ textAlign: "center", opacity: 0.6 }}
              >
                No users
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
      <Pagination total={pageCount} value={page} onChange={setPage} />
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? "Edit User" : "New User"}
        size="lg"
      >
        <TextInput
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
          required
          mb="sm"
        />
        <TextInput
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
          required
          mb="sm"
          disabled={!!editing}
        />
        <PasswordInput
          label="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.currentTarget.value })
          }
          placeholder={editing ? "Leave blank to keep" : ""}
          mb="sm"
        />
        <Select
          label="Role"
          data={[
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
          ]}
          value={form.role}
          onChange={(v) => setForm({ ...form, role: v || "user" })}
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

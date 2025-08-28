"use client";

import {
  MantineProvider,
  AppShell,
  Group,
  Anchor,
  Button,
  Container,
  Flex,
  Title,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const check = () => {
        const token = localStorage.getItem("token");
        setAuthed(!!token);
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setIsAdmin(payload.role === "admin");
          } catch {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      };
      check();
      window.addEventListener("auth-changed", check);
      return () => window.removeEventListener("auth-changed", check);
    }
  }, []);
  const logout = () => {
    localStorage.removeItem("token");
    setAuthed(false);
    window.dispatchEvent(new Event("auth-changed"));
    notifications.show({ message: "Logged out", color: "blue" });
    window.location.href = "/login";
  };

  return (
    <html lang="en">
      <body>
        <MantineProvider
          defaultColorScheme="light"
          theme={{
            colors: {
              brand: [
                "#e6f0ff",
                "#cce0ff",
                "#99c2ff",
                "#66a3ff",
                "#3385ff",
                "#0066ff",
                "#0052cc",
                "#003d99",
                "#002966",
                "#001433",
              ],
            },
            primaryColor: "brand",
          }}
        >
          <Notifications position="top-right" />
          <AppShell
            header={{ height: 72 }}
            padding="md"
            styles={{
              main: {
                background: "linear-gradient(135deg,#fdfdfd,#f4fbf9)",
              },
            }}
          >
            <AppShell.Header
              style={{
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid #e3eee9",
                background: "rgba(255,255,255,0.8)",
              }}
            >
              <Container size="lg" h="100%">
                <Flex justify="space-between" align="center" h="100%">
                  <Title
                    order={3}
                    style={{
                      letterSpacing: ".5px",
                      marginRight: 40,
                    }}
                  >
                    <Anchor
                      component={Link}
                      href="/"
                      underline="never"
                      c="brand.7"
                      style={{
                        fontWeight: 700,
                        fontSize: "1.35rem",
                      }}
                    >
                      BlogApp
                    </Anchor>
                  </Title>
                  <Group
                    gap={28}
                    align="center"
                    style={{
                      fontSize: 15,
                    }}
                  >
                    {isAdmin ? (
                      <>
                        <Anchor
                          component={Link}
                          href="/admin/posts"
                          fw={500}
                          underline="never"
                          c="dark.7"
                        >
                          Posts
                        </Anchor>
                        <Anchor
                          component={Link}
                          href="/admin/users"
                          fw={500}
                          underline="never"
                          c="dark.7"
                        >
                          Users
                        </Anchor>
                        <Button
                          size="sm"
                          color="red"
                          variant="light"
                          onClick={logout}
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Anchor
                          component={Link}
                          href="/posts"
                          fw={500}
                          underline="never"
                          style={{ textDecoration: "none" }}
                          c="dark.7"
                        >
                          Posts
                        </Anchor>
                        {authed && (
                          <Anchor
                            component={Link}
                            href="/my-posts"
                            fw={500}
                            underline="never"
                            c="dark.7"
                          >
                            My Posts
                          </Anchor>
                        )}
                        {/* Disabling New Post for now since the button is already shown in the posts page */}
                        {/* {authed && (
                      <Button
                        component={Link}
                        href="/posts/new"
                        size="sm"
                        color="brand"
                        variant="filled"
                      >
                        New Post
                      </Button>
                    )} */}
                        {!authed && (
                          <Button
                            component={Link}
                            href="/login"
                            variant="outline"
                            size="sm"
                            color="brand"
                          >
                            Login
                          </Button>
                        )}
                        {!authed && (
                          <Button
                            component={Link}
                            href="/register"
                            size="sm"
                            color="brand"
                          >
                            Register
                          </Button>
                        )}
                        {authed && (
                          <Anchor
                            component={Link}
                            href="/profile"
                            fw={500}
                            underline="never"
                            c="dark.7"
                          >
                            Profile
                          </Anchor>
                        )}
                        {authed && (
                          <Button
                            size="sm"
                            color="red"
                            variant="light"
                            onClick={logout}
                          >
                            Logout
                          </Button>
                        )}
                      </>
                    )}
                  </Group>
                </Flex>
              </Container>
            </AppShell.Header>
            <AppShell.Main>{children}</AppShell.Main>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}

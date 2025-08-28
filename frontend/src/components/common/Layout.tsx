import React from "react";
import { Container, Box } from "@mui/material";
import Navbar from "./Navbar.tsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 3, mb: 5 }}>
        <Box>{children}</Box>
      </Container>
    </>
  );
}

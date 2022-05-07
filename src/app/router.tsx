
import React from "react";
import {HashRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { AppShell, Container, ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { NavbarSimpleColored } from "./navigation";
import { LightingPage } from "./Pages/Lighting";
import { AboutPage } from "./Pages/About";

function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<div>App Error - no route found</div>} />
        <Route path="main" element={<MainNav />}>
          <Route path="projector" element={<div>Proj</div>} />
          <Route path="sound" element={<div>Sound</div>} />
          <Route path="lighting" element={<LightingPage />} />
          <Route path="help" element={<AboutPage />} />
          <Route path="about" element={<div>About</div>} />
        </Route>
        <Route path="e131sampler" element={<div>Sampling e131</div>} />
      </Routes>
    </HashRouter>
  );
}
function MainNav() {
  const { height, width } = useViewportSize();
  return (
    <AppShell
      navbar={<NavbarSimpleColored />}
      padding={0}
    >
      <ScrollArea style={{ height }} type="auto" offsetScrollbars scrollbarSize={20}>
        <Container fluid px={"md"} py="md">
          <Outlet />
        </Container>
      </ScrollArea>
    </AppShell>
  )
}
export default Router
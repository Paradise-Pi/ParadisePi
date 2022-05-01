
import React from "react";
import {HashRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { AppShell } from '@mantine/core';
import { NavbarSimpleColored } from "./navigation";

function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<div>App Error - no route found</div>} />
        <Route path="main" element={<MainNav />}>
          <Route path="projector" element={<div>Proj</div>} />
          <Route path="sound" element={<div>Sound</div>} />
          <Route path="lighting" element={<div>Lighting</div>} />
          <Route path="help" element={<div>Help</div>} />
          <Route path="about" element={<div>About</div>} />
        </Route>
        <Route path="e131sampler" element={<div>Sampling e131</div>} />
      </Routes>
    </HashRouter>
  );
}
function MainNav() {
  return (
    <AppShell
      navbar={<NavbarSimpleColored />}
      padding="md"
    >
      <Outlet />
    </AppShell>
  )
}
export default Router
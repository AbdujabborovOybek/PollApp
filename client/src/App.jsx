import { memo } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./layout/layout";
import Login from "./pages/login/login";
import Home from "./pages/home/home";
import Crate from "./pages/crate/crate";
import Polls from "./pages/polls/polls";
import Auth from "./pages/login/auth";

const NotFound = () => <h1>404 Not Found</h1>;

export default memo(function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route element={<Auth />}>
          <Route path="create" element={<Crate />} />
          <Route path="polls" element={<Polls />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
});

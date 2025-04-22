import { memo } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./layout/layout";
import Login from "./pages/login/login";
import Home from "./pages/home/home";

const NotFound = () => <h1>404 Not Found</h1>;

export default memo(function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
});

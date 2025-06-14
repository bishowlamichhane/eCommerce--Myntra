import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./routes/App.jsx";
import "./routes/App.css";
import "./index.css";
import Bag from "./routes/Bag.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home.jsx";
import { Provider } from "react-redux";
import myntraStore from "./store/index.js";
import "bootstrap/dist/css/bootstrap.min.css";
import ItemPage from "./components/ItemPage.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/bag",
        element: <Bag />,
      },
      {
        path: "/item/:id",
        element: <ItemPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={myntraStore}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

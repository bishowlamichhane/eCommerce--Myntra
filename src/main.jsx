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
import AddItem from "./components/AddItem.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import { AuthProvider } from "./context/useAuth.jsx";
import Profile from "./routes/Profile.jsx";
import Categories from "./components/categories/Categories.jsx";
import Test from "./routes/Test.jsx";
import EsewaPayment from "./routes/EsewaPayment.jsx";
import Checkout from "./routes/Checkout.jsx";
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
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path:"/profile",
        element:<Profile />

      },

      {
        path: "/bag",
        element: <Bag />,
      },
      {
        path: "/checkout",
        element: <Checkout/>,
      },
      
   
      {
        path: "/category",
        element:<Categories />
      },
      {
        path: "/item/:id",
        element: <ItemPage />,
      },
    ],
  },
  {
    path: "/addItem",
    element: <AddItem />,
  },
 
]);

createRoot(document.getElementById("root")).render(
    <Provider store={myntraStore}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
);

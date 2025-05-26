import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ReactGA from "react-ga4";
import Dashboard from "./pages/dashboard";
import Two from "./pages/two";
import Three from "./pages/three";
import Login from "./pages/login";
import OrderTest from "./pages/order-test";
import { Provider } from 'react-redux';
import { store } from './state/store';
import Home from "./pages/home";
import OrderPage from "./pages/order-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home/>,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/two",
    element: <Two />,
  },
  {
    path: "/three",
    element: <Three />,
  },
  {
    path: "/order-test",
    element: <OrderTest />,
  },
  {
    path: "/order-page",
    element: <OrderPage />,
  },
]);

const GA_ID = import.meta.env.VITE_GA_ID;
ReactGA.initialize(GA_ID);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;

import {
  HomeIcon,
  TableCellsIcon,
  PlusIcon,
  PencilSquareIcon,
  TruckIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import { Home } from "@/pages/dashboard";
import SubCategories from "./pages/dashboard/Subcategory";
import ManageOrders from "./pages/dashboard/ManageOrders";
import ProfileData from "./pages/dashboard/ProfileData";
import ManageProducts from "./pages/dashboard/ManageProducts";
import Category from "./pages/dashboard/Category";
import ManageLocation from "./pages/dashboard/ManageLocation";
import OutOFStock from "./pages/dashboard/OutOfStock";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      // {
      //   icon: <HomeIcon {...icon} />,
      //   name: "dashboard",
      //   path: "/home",
      //   element: <Home />,
      // },
      {
        icon: <PlusIcon {...icon} />,
        name: "Manage Products",
        path: "/manage-products",
        element: <ManageProducts />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Add categories",
        path: "/category",
        element: <Category />,
      },
      {
        icon: <PencilSquareIcon {...icon} />,
        name: "Add Sub categories",
        path: "/sub-category",
        element: <SubCategories />,
      },
      {
        icon: <TruckIcon {...icon} />,
        name: "Manage Delivery Location",
        path: "/manage-location",
        element: <ManageLocation />,
      },
      {
        icon: <ShoppingCartIcon {...icon} />,
        name: "Manage Orders",
        path: "/manage-orders",
        element: <ManageOrders />,
      },
      {
        icon: <ShoppingCartIcon {...icon} />,
        name: "Out Of Stock",
        path: "/out-of-stock",
        element: <OutOFStock />,
      },
    ],
  },
];

export default routes;

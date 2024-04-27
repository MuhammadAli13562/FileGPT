import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      RootLayout
      <Outlet></Outlet>
    </div>
  );
};

export default RootLayout;

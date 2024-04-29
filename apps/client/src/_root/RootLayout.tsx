import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="overflow-hidden apple-font ">
      <Outlet></Outlet>
    </div>
  );
};

export default RootLayout;

import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="overflow-hidden apple-font ">
      <section>
        <Outlet></Outlet>
      </section>
    </div>
  );
};

export default RootLayout;

import { Outlet } from "react-router-dom";
import logo from "../../public/File.png";

const AuthLayout = () => {
  return (
    <div className="w-full h-screen flex-center text-black  bg-[#FAF7F5]">
      <div className="  w-full h-full flex items-center">
        <section className="  w-1/2 flex justify-end">
          <img src={logo} className="h-1/2 " />
        </section>
        <section className="col-center w-1/2  py-10">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;

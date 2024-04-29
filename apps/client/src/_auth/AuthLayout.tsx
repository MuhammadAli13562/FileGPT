import { Outlet } from "react-router-dom";
import logo from "../../public/TaxPro.png";

const AuthLayout = () => {
  return (
    <div className="w-full h-screen flex-center text-black  bg-[#FAF7F5]">
      <div className="flex-center gap-52 w-full h-full ">
        <section className=" col-center">
          <img src={logo} className="h-1/2" />
        </section>
        <section className="flex  justify-center items-center flex-col py-10">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;

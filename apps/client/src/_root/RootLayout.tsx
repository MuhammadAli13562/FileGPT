import { Outlet } from "react-router-dom";
import { useFetchDataFixedCache } from "src/redux/api/user";

const RootLayout = () => {
  const { isSuccess } = useFetchDataFixedCache();

  return (
    <div className="overflow-hidden apple-font ">
      <section>{isSuccess && <Outlet></Outlet>}</section>
    </div>
  );
};

export default RootLayout;

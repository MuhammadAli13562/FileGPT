import { Outlet } from "react-router-dom";
import { useFetchDataQuery } from "src/redux/api/user";

const RootLayout = () => {
  const { isSuccess } = useFetchDataQuery();

  return (
    <div className="overflow-hidden apple-font ">
      <section>{isSuccess && <Outlet></Outlet>}</section>
    </div>
  );
};

export default RootLayout;

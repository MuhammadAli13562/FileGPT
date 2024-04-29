import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "src/redux/store";
import signoutlogo from "../../../public/logout.svg";
import { UserApi } from "src/redux/api/user";

const SignOutButton = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <button
      className=" signout-btn bg-black"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        dispatch(UserApi.util.resetApiState());

        navigate("/sign-in");
        toast.info("User logged out");
      }}
    >
      <img src={signoutlogo} width="40px" className=" rotate-180" />
    </button>
  );
};

export default SignOutButton;

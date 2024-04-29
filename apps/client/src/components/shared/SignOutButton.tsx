import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { store } from "src/redux/store";
import { api } from "src/redux/api";
import signoutlogo from "../../../public/logout.svg";

const SignOutButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className=" signout-btn bg-black"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        store.dispatch(api.util.resetApiState());

        navigate("/sign-in");
        toast.info("User logged out");
      }}
    >
      <img src={signoutlogo} width="40px" className=" rotate-180" />
    </button>
  );
};

export default SignOutButton;

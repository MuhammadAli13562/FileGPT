import { useNavigate } from "react-router-dom";
import homelogo from "../../../public/home.svg";

const SwitchButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className=" signout-btn bg-black"
      onClick={() => {
        navigate("/chat/default");
      }}
    >
      <img alt="sleep" className=" opacity-70" aria-label="sleep" src={homelogo} width="30px" />
    </button>
  );
};

export default SwitchButton;

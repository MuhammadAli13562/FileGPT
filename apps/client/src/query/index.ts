import { queryInputType } from "src/types/user";
import { streamingFetch } from "./generator";
import { AddMessage } from "src/redux/recipies/StreamUpdate";

export const StreamQuery = async (input: queryInputType, dispatch: any) => {
  for await (let chunk of streamingFetch(() =>
    fetch("https://chatapp.ali-98-ec2-backend.click/user/query", {
      method: "POST",
      headers: {
        token: localStorage.getItem("token") as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })
  )) {
    console.log(chunk);

    dispatch(AddMessage({ id: input.id, message: chunk }));
  }
};

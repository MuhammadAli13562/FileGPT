import { ServerEndpoint } from "src/constants";
import { queryInputType } from "src/types/user";
import { streamingFetch } from "./generator";
import { AddMessage } from "src/redux/recipies/resetStore";

export const StreamQuery = async (input: queryInputType, dispatch: any) => {
  for await (let chunk of streamingFetch(() =>
    fetch(ServerEndpoint + "user/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })
  )) {
    console.log(chunk);

    dispatch(AddMessage({ id: input.id, message: chunk }));
  }
};

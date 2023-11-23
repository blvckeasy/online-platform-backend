import { BaseContext } from "@apollo/server";


export const userResolver: BaseContext = {
  Query: {
      user: () => 'hello this is user route',
  },
};
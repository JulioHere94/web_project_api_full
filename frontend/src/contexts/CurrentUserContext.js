import { createContext } from "react";

const CurrentUserContext = createContext({
  currentUser: {},
  handleUpdateUser: () => {},
});

export default CurrentUserContext;

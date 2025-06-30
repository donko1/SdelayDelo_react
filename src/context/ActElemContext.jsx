import { act, createContext, useContext, useState } from 'react';

const ActElemContext = createContext()

export function ActElemContextProvider({ children }) {
  const [actelem, setAct] = useState("myDay");
  console.log(actelem)
  
  return (
    <ActElemContext.Provider value={{ actelem, setAct }}>
      {children}
    </ActElemContext.Provider>
  );
}

export function useActElemContext() {
  return useContext(ActElemContext);
}

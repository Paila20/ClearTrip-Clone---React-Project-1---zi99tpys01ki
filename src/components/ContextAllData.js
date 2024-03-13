import React, { createContext, useContext, useState } from 'react'
const MyContext=createContext();
export function useAuthContext(){
    return useContext(MyContext);
}
export default function ContextAllDataProvider({children}) {
    const [all,setall]=useState({});

  return (
  <MyContext.Provider value={{all,setall}}>
    {children}
  </MyContext.Provider>
  )
}

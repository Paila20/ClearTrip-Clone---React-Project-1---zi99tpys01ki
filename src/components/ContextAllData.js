import React, { createContext, useContext, useState } from 'react'
const MyContext=createContext();
export function useAuthContext(){
    return useContext(MyContext);
}
export default function ContextAllDataProvider({children}) {
    const [all,setall]=useState({});
    const [tokenAvailability, settokenAvailability] = useState();
  const [logincheck, setlogincheck] = useState(false);

 function checklogin() {
        const token = JSON.parse(localStorage.getItem("token")) || [];
       
        if (typeof token == "string") {
            settokenAvailability(true)
        }
        else{
            setlogincheck(true)
        }
    }
  return (
  <MyContext.Provider value={{all,setall,tokenAvailability, settokenAvailability,logincheck, setlogincheck,checklogin}}>
    {children}
  </MyContext.Provider>
  )
}

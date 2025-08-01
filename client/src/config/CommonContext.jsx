import { createContext, useContext, useEffect, useState } from "react";
const MyContext = createContext();

export function ContextApp({children}){
    const [editBlog, setEditBlog] = useState();
    const [MenuSwitch, setMenuSwitch] = useState('newpost');
    const [stared, setStared] =useState();
    const [theme, setTheme] = useState("")
 

    // values provider
    const ContextValues ={
        editBlog, setEditBlog,
        MenuSwitch, setMenuSwitch,
        stared, setStared,
        theme, setTheme
    }
    return(
        <MyContext.Provider value={ContextValues}>
            {children}
        </MyContext.Provider>
    )
}
export const useMyContext =()=>{
    return useContext(MyContext);
};
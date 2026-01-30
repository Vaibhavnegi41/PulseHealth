import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

export const Applayout=()=>{

    return (
        <>
        <div className="applayout">
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
        </>
    )
}
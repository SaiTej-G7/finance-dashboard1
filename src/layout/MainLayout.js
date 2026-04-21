import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

function MainLayout(){

const [sidebarOpen,setSidebarOpen]=useState(false)

return(

<div className="layout">

<Sidebar open={sidebarOpen}  toggleSidebar={setSidebarOpen}/>

<div className="main">

<Topbar toggleSidebar={()=>setSidebarOpen(!sidebarOpen)}/>

<main className="content">

<Outlet/>

</main>

</div>

</div>

)

}

export default MainLayout
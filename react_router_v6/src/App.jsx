import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Applayout } from "./pages/Applayout";
import './app.css'
import  { Login } from "./pages/Login";
import Register from "./pages/Register";
import HealthPrediction from "./pages/HealthPrediction";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import History from "./pages/History";

const App=()=>{


  const router=createBrowserRouter([
    {
      path:"/",
      element:<Applayout/>,
      children:[
          {
            path:"/",
            element:<Home/>
          },
          {
            path:"/about",
            element:<About/>
          },
          {
            path:"/contact",
            element:<Contact/>
          }
      ]
    },
    {
      path:"*",
      element:<div>Error Page </div>
    },
    {
            path:"/login",
            element:<Login/>
    },
    {
            path:"/register",
            element:<Register/>
    },
    {
      path:"/prediction",
      element:(
        <ProtectedRoute>
          <HealthPrediction/>
        </ProtectedRoute>
      )
    },
    {
      path:"/history",
      element:(
          <ProtectedRoute>
              <History/>
          </ProtectedRoute>
      )
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}

export default App;
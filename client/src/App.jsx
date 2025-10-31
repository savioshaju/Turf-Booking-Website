import React from "react"
import { RouterProvider } from "react-router-dom"
import router from "./Routes/Router"
import { ToastContainer } from "react-toastify"

function App() {
    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer theme='light' position='top-center' autoClose={1800} />
        </>
    )
}

export default App

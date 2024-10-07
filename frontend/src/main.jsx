import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
// import Upload1 from './componets/Upload1'
import SecureUpload from './componets/Secure-Upload.jsx'

let router = createBrowserRouter(
    createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='/secure' element={<SecureUpload/>}/>
    </Route>
    ))


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <RouterProvider router={router}/>
)

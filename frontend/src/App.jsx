import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <h1>Video Uploader Application</h1>
      <Link to={'/secure'}>Upload</Link>
      <br />
      <br />
      <Outlet/>
    </div>
  )
}

export default App
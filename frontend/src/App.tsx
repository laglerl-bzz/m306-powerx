import { Route, Routes } from "react-router-dom"
import Navbar from "./components/ui/navbar"
import HomePage from "./components/home-page"
import UploadPage from "./components/upload-page"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </>
  )
}

export default App

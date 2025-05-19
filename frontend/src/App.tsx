import { ChartComp } from "./components/chart"

function App() {
  return (
    <>
      <nav className="bg-zinc-500 text-white flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2"></div>
          <img src="/logo.png" alt="Logo" className="h-10" />
        </div>
        <ul className="flex space-x-4 ">
          <li>
            <a href="#" className="hover:text-gray-400 flex items-center space-x-1 font-bold">
              <span>Home</span>
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400 flex items-center space-x-1 font-bold">
              <span>Chart</span>
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400 flex items-center space-x-1 font-bold">
              <span>Upload</span>
            </a>
          </li>
        </ul>
      </nav >
      <div className="h-screen justify-center flex items-center">
          <ChartComp />
      </div>
    </>
  )
}

export default App

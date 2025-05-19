import { ChartComp } from "./components/chart"
import { Card } from "./components/ui/card"

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
        <div className="w-10/12 flex flex-row gap-4">
          <ChartComp />
          <Card className=" w-2/12">
            {/* legend */}
            <div className="flex flex-col justify-between p-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 mr-2" />
                <span>Desktop</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 mr-2" />
                <span>Mobile</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default App

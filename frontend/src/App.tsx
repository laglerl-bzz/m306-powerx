import { ChartComp } from "./components/chart"
import { Card } from "./components/ui/card"
import Navbar from "./components/ui/navbar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"

function App() {
  return (
    <>
      <Navbar /> 
      <div className="h-screen justify-center flex items-center">
        <div className="w-10/12 flex flex-row gap-4">
          <ChartComp />
          <Card className=" w-2/12">
            <div className="flex flex-col justify-between px-4">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchaseHighTariff">Purchase high tariff</SelectItem>
                  <SelectItem value="purchaseLowTariff">Purchase low tariff</SelectItem>
                  <SelectItem value="feedInHighTariff">Feed-in high tariff</SelectItem>
                  <SelectItem value="feedInLowTariff">Feed-in low tariff</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="feedIn">Feed-in</SelectItem>
                  <SelectItem value="consumptionChart">Consumption chart</SelectItem>
                  <SelectItem value="meterReadingChart">Meter reading chart</SelectItem>
                </SelectContent>
              </Select>
                <h3 className="font-semibold text-lg mt-4 mb-2">Legende</h3>
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

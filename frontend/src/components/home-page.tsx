import { useState } from "react"
import { ChartComp } from "./chart"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./ui/select"

export default function HomePage() {
    const [preset, setPreset] = useState<string>("")

    const handlePresetChange = (value: string) => {
        setPreset(value)
    }

    return (
        <div className="h-screen justify-center flex items-center">
            <div className="w-10/12 flex flex-row gap-4">
                <ChartComp preset={preset} />
                <Card className="w-2/12 h-full">
                    <CardHeader>
                        <CardTitle>Chart Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select value={preset} onValueChange={handlePresetChange}>
                            <SelectTrigger className="w-full mb-4">
                                <SelectValue placeholder="Select Preset" />
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
                        </Select>                        <div className="mt-6">
                            <h3 className="font-semibold text-sm mb-2">Legend</h3>
                            <div className="flex items-center mb-2">
                                <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))] mr-2" />
                                <span className="text-sm">Power Consumption</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))] mr-2" />
                                <span className="text-sm">Power Production</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
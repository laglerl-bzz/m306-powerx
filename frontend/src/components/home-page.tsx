import { useState } from "react"
import { ChartComp, obisConfig, sdatConfig } from "./chart"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./ui/select"

type ChartConfig = {
    [key: string]: {
      label: string
      color: string
    }
  }

export default function HomePage() {
    const [preset, setPreset] = useState<string>("")
    const [currentTimespan, setCurrentTimespan] = useState<string>("month")
    const [currentConfig, setCurrentConfig] = useState<ChartConfig>(sdatConfig);

    const handlePresetChange = (value: string) => {
        setPreset(value)
    }

    const handleTimespanChange = (timespan: string) => {
        setCurrentTimespan(timespan)
    }

    const handleConfigChange = (config: ChartConfig) => {
        setCurrentConfig(config);
    }

    return (<div className="h-screen justify-center flex items-center">
        <div className="w-10/12 flex flex-row gap-4">
            <ChartComp preset={preset} onTimespanChange={handleTimespanChange} onConfigChange={handleConfigChange} />
            <Card className="w-2/12 h-full">
                <CardHeader>
                    <CardTitle>Diagramm-Optionen</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={preset} onValueChange={handlePresetChange}>
                        <SelectTrigger className="w-full mb-4">
                            <SelectValue placeholder="Preset auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="purchaseHighTariff">Einkauf Hochtarif</SelectItem>
                            <SelectItem value="purchaseLowTariff">Einkauf Niedertarif</SelectItem>
                            <SelectItem value="feedInHighTariff">Einspeisung Hochtarif</SelectItem>
                            <SelectItem value="feedInLowTariff">Einspeisung Niedertarif</SelectItem>
                            <SelectItem value="purchase">Einkauf</SelectItem>
                            <SelectItem value="feedIn">Einspeisung</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="mt-6">
                        <h3 className="font-semibold text-sm mb-2">Legende</h3>
                        {Object.entries(currentConfig).map(([key, config]) => (
                            <div key={key} className="flex items-center mb-2">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: config.color }}
                                />
                                <span className="text-sm">{config.label}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
    )
}

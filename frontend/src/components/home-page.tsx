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
                                <SelectItem value="consumptionChart">Verbrauchsdiagramm</SelectItem>
                                <SelectItem value="meterReadingChart">Zählerstandsdiagramm</SelectItem>
                            </SelectContent>
                        </Select>                        <div className="mt-6">
                            <h3 className="font-semibold text-sm mb-2">Legende</h3>
                            <div className="flex items-center mb-2">
                                <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))] mr-2" />
                                <span className="text-sm">Stromverbrauch</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))] mr-2" />
                                <span className="text-sm">Stromproduktion</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

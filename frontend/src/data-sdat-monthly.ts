
// Sample SDAT data for multiple days to demonstrate monthly aggregation
// In a real scenario, this would be loaded from multiple SDAT files
export const sdatMonthlyData = {
  "sdat-data": [
    // Day 1 - April 8, 2020
    {
      "documentID": "ID735", // Bezug
      "interval": {
        "startDateTime": "2020-04-08T22:00:00Z",
        "endDateTime": "2020-04-09T22:00:00Z"
      },
      "resolution": 15,
      "totalDaily": 42.5 // kWh consumed for the day
    },
    {
      "documentID": "ID742", // Einspeisung
      "interval": {
        "startDateTime": "2020-04-08T22:00:00Z",
        "endDateTime": "2020-04-09T22:00:00Z"
      },
      "resolution": 15,
      "totalDaily": 28.3 // kWh fed into grid for the day
    },
    // Day 2 - April 9, 2020
    {
      "documentID": "ID735",
      "interval": {
        "startDateTime": "2020-04-09T22:00:00Z",
        "endDateTime": "2020-04-10T22:00:00Z"
      },
      "resolution": 15,
      "totalDaily": 38.7
    },
    {
      "documentID": "ID742",
      "interval": {
        "startDateTime": "2020-04-09T22:00:00Z",
        "endDateTime": "2020-04-10T22:00:00Z"
      },
      "resolution": 15,
      "totalDaily": 31.2
    },
    // Day 3 - April 10, 2020 (Weekend)
    {
      "documentID": "ID735",
      "interval": {
        "startDateTime": "2020-04-10T22:00:00Z",
        "endDateTime": "2020-04-11T22:00:00Z"
      },
      "resolution": 15,
      "totalDaily": 35.1 // Lower consumption on weekend
    },
    {
      "documentID": "ID742",
      "interval": {
        "startDateTime": "2020-04-10T22:00:00Z",
        "endDateTime": "2020-04-11T22:00:00Z"
      },
      "resolution": 15,
      "totalDaily": 26.8
    },
    // Day 4 - April 11, 2020 (Weekend)
    {
      "documentID": "ID735",
      "interval": {
        "startDateTime": "2020-04-11T22:00:00Z",
        "endDateTime": "2020-04-12T22:00:00Z"
      },
      "resolution": 15,
      "totalDaily": 33.4
    },
    {
      "documentID": "ID742",
      "interval": {
        "startDateTime": "2020-04-11T22:00:00Z",
        "endDateTime": "2020-04-12T22:00:00Z"
      },
      "resolution": 15,
      "totalDaily": 29.6
    },
    // Additional sample days would continue here...
    // For demonstration, we'll generate the rest programmatically
  ]
}

// Function to get realistic daily totals for a full month
export const generateMonthlySDATTotals = () => {
  const monthlyData: any[] = []
  
  // Generate 30 days of realistic SDAT daily totals
  for (let day = 1; day <= 30; day++) {
    const baseDate = new Date(2020, 3, day) // April 2020
    const isWeekend = baseDate.getDay() === 0 || baseDate.getDay() === 6
    
    // Realistic consumption patterns
    const baseConsumption = isWeekend ? 35 : 45
    const seasonalFactor = 1 + 0.2 * Math.sin((day / 30) * 2 * Math.PI)
    const dailyVariation = 0.85 + 0.3 * Math.random()
    const dailyBezug = Math.round(baseConsumption * seasonalFactor * dailyVariation * 100) / 100
    
    // Solar production (feed-in)
    const baseSolar = isWeekend ? 25 : 30
    const weatherFactor = 0.6 + 0.7 * Math.random() // Weather variability
    const dailyEinspeisung = Math.round(baseSolar * seasonalFactor * weatherFactor * 100) / 100
    
    const dayLabel = baseDate.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit"
    })
    
    monthlyData.push({
      month: dayLabel,
      time: dayLabel,
      timestamp: baseDate.getTime(),
      bezug: dailyBezug,
      einspeisung: dailyEinspeisung,
      date: baseDate.toISOString().split('T')[0] // For reference
    })
  }
  
  return monthlyData
}

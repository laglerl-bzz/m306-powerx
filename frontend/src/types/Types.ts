type DataSource = 'sdat' | 'esl';

type SdatDataType = 'ID742' | 'ID735'; // Bezug / Einspeisung (15-Minuten-Daten)
type EslDataType =
  | '1-1:1.8.1' // Bezug HT
  | '1-1:1.8.2' // Bezug NT
  | '1-1:2.8.1' // Einspeisung HT
  | '1-1:2.8.2'; // Einspeisung NT

type TimeRange =
  | 'day' // Tagesdaten
  | 'week'
  | 'month' // Bis 3 Monate (sdat)
  | 'quarter'
  | 'year'; // Ab 3 Monate (esl)

type ChartType = 'verbrauchsdiagramm' | 'zaehlerstandsdiagramm';

type DataPoint = {
  timestampId: string; // Timestamps werden als ID verwendet
  value: number;
};

type SdatData = {
  source: 'sdat';
  type: SdatDataType;
  dataPoints: DataPoint[];
};

type EslData = {
  source: 'esl';
  type: EslDataType;
  dataPoints: DataPoint[];
};

type ChartPreset = {
  chartType: ChartType;
  timeRange: TimeRange;
  allowedSources: DataSource[];
};

type VisualizationConfig = {
  selectedPreset: ChartPreset;
  data: (SdatData | EslData)[];
};

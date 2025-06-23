import xml.etree.ElementTree as ET
from typing import List, Dict, Any

# Only these OBIS codes are allowed in ESL data
ALLOWED_OBIS = {"1-1:2.8.1", "1-1:2.8.2", "1-1:1.8.1", "1-1:1.8.2"}

def parse_sdat_file(xml_string: str) -> Dict[str, Any]:
    ns = {"rsm": "http://www.strom.ch"}
    root = ET.fromstring(xml_string)

    document_id = root.findtext(".//rsm:DocumentID", namespaces=ns)
    start = root.findtext(".//rsm:Interval/rsm:StartDateTime", namespaces=ns)
    end = root.findtext(".//rsm:Interval/rsm:EndDateTime", namespaces=ns)
    resolution = int(
        root.findtext(".//rsm:Resolution/rsm:Resolution", default="15", namespaces=ns)
    )

    observations: List[Dict[str, Any]] = []
    for obs in root.findall(".//rsm:Observation", ns):
        seq = obs.findtext("rsm:Position/rsm:Sequence", namespaces=ns)
        volume = obs.findtext("rsm:Volume", namespaces=ns)
        if seq is not None and volume is not None:
            try:
                observations.append({
                    "sequence": int(seq),
                    "volume": float(volume)
                })
            except ValueError:
                continue

    return {
        "documentID": document_id,
        "interval": {"startDateTime": start, "endDateTime": end},
        "resolution": resolution,
        "data": observations
    }

def parse_esl_file(xml_string: str) -> Dict[str, Any]:
    root = ET.fromstring(xml_string)
    entries: List[Dict[str, Any]] = []

    for timeperiod in root.findall(".//TimePeriod"):
        month = timeperiod.attrib.get("end")
        values: List[Dict[str, Any]] = []
        for valuerow in timeperiod.findall("ValueRow"):
            obis = valuerow.attrib.get("obis")
            val = valuerow.attrib.get("value")
            # only include allowed OBIS codes
            if obis not in ALLOWED_OBIS:
                continue
            try:
                value = float(val) if val is not None else None
            except ValueError:
                continue
            if value is not None:
                values.append({"obis": obis, "value": value})

        # include each month with filtered data (even if empty)
        entries.append({"month": month, "data": values})

    return {"esl-data": entries}

def is_valid_sdat_entry(entry: Dict[str, Any]) -> bool:
    """
    Returns True if parse_sdat_file found a valid documentID and interval.
    Filters out empty or null parses.
    """
    if not entry.get("documentID"):
        return False
    iv = entry.get("interval", {})
    if not iv.get("startDateTime") or not iv.get("endDateTime"):
        return False
    return True

def convert_input(input_data: Dict[str, Any]) -> Dict[str, List[Dict[str, Any]]]:
    result: Dict[str, List[Dict[str, Any]]] = {}
    file_type = input_data.get("type")

    if file_type == "sdat":
        result["sdat-data"] = []
        for file in input_data.get("files", []):
            content = file.get("content")
            if content:
                parsed = parse_sdat_file(content)
                if is_valid_sdat_entry(parsed):
                    result["sdat-data"].append(parsed)
    elif file_type == "esl":
        result["esl-data"] = []
        for file in input_data.get("files", []):
            content = file.get("content")
            if content:
                # extend with only allowed OBIS data
                result["esl-data"].extend(parse_esl_file(content)["esl-data"])
    else:
        raise ValueError(f"Unsupported file type: {file_type}")

    print(result)
    return result

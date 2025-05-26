import xml.etree.ElementTree as ET
from typing import List, Dict, Any


def parse_sdat_file(xml_string: str) -> Dict[str, Any]:
    ns = {"rsm": "http://www.strom.ch"}
    root = ET.fromstring(xml_string)

    document_id = root.findtext(".//rsm:DocumentID", namespaces=ns)
    start = root.findtext(".//rsm:Interval/rsm:StartDateTime", namespaces=ns)
    end = root.findtext(".//rsm:Interval/rsm:EndDateTime", namespaces=ns)
    resolution = int(root.findtext(".//rsm:Resolution/rsm:Resolution", default="15", namespaces=ns))

    observations = []
    for obs in root.findall(".//rsm:Observation", ns):
        seq = obs.findtext("rsm:Position/rsm:Sequence", namespaces=ns)
        volume = obs.findtext("rsm:Volume", namespaces=ns)
        if seq is not None and volume is not None:
            observations.append({
                "sequence": int(seq),
                "volume": float(volume)
            })

    return {
        "documentID": document_id,
        "interval": {
            "startDateTime": start,
            "endDateTime": end
        },
        "resolution": resolution,
        "data": observations
    }


def parse_esl_file(xml_string: str) -> Dict[str, Any]:
    root = ET.fromstring(xml_string)
    entries = []
    for timeperiod in root.findall(".//TimePeriod"):
        month = timeperiod.attrib.get("end")
        values = []
        for valuerow in timeperiod.findall("ValueRow"):
            obis = valuerow.attrib.get("obis")
            value = float(valuerow.attrib.get("value"))
            values.append({"obis": obis, "value": value})
        entries.append({"month": month, "data": values})
    return {"esl-data": entries}


def convert_input(input_data: Dict[str, Any]) -> Dict[str, List[Dict[str, Any]]]:
    result = {}
    file_type = input_data.get("type")

    if file_type == "sdat":
        result["sdat-data"] = []
        for file in input_data.get("files", []):
            content = file.get("content")
            if content:
                result["sdat-data"].append(parse_sdat_file(content))
    elif file_type == "esl":
        result["esl-data"] = []
        for file in input_data.get("files", []):
            content = file.get("content")
            if content:
                result["esl-data"].extend(parse_esl_file(content)["esl-data"])
    else:
        raise ValueError("Unsupported file type: " + str(file_type))

    print(result)
    return result

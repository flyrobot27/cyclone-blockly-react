import axios from "axios";
import { IRRow, NIRRow, CounterRow, WFRow, ResultViewProps } from "./resultView/resultView";
import { Dispatch } from "react";
const Endpoint = "https://sbeve.mooo.com/api/cyclone/";

export function postToSimphony(data: any, setResultProps: Dispatch<ResultViewProps>) {
    let intrinsicResult: IRRow[] = [];
    let nonintrinsicResult: NIRRow[] = [];
    let counterResult: CounterRow[] = [];
    let waitingFileResult: WFRow[] = [];
    let terminationReason: string = "";

    axios.post(Endpoint, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        let data = response.data;

        terminationReason = data["terminationReason"];

        let intrinsicResultJson = new Map(Object.entries(data["intrinsicResult"]));
        let nonintrinsicResultJson = new Map(Object.entries(data["nonIntrinsicResult"]));
        let counterResultJson = new Map(Object.entries(data["counterResult"]));
        let waitingFileResultJson = new Map(Object.entries(data["waitingFileResult"]));

        intrinsicResultJson.forEach((element: any, key: string) => {
            let elementMap = new Map(Object.entries(element));
            intrinsicResult.push({
                elementName: key,
                min: elementMap.get("min") as number,
                max: elementMap.get("max") as number,
                mean: elementMap.get("mean") as number,
                stdDev: elementMap.get("stdDev") as number,
                current: elementMap.get("current") as number
            });
        });

        nonintrinsicResultJson.forEach((element: any, key: string) => {
            let elementMap = new Map(Object.entries(element));
            nonintrinsicResult.push({
                elementName: key,
                min: elementMap.get("min") as number,
                max: elementMap.get("max") as number,
                mean: elementMap.get("mean") as number,
                stdDev: elementMap.get("stdDev") as number,
                observationCount: elementMap.get("observationCount") as number
            });
        });

        counterResultJson.forEach((element: any, key: string) => {
            let elementMap = new Map(Object.entries(element));
            counterResult.push({
                elementName: key,
                finalCount: elementMap.get("finalCount") as number,
                productionRate: elementMap.get("productionRate") as number,
                averageInterArrivalTime: elementMap.get("averageInterArrivalTime") as number,
                firstArrival: elementMap.get("firstArrival") as number,
                lastArrival: elementMap.get("lastArrival") as number
            });
        });

        waitingFileResultJson.forEach((element: any, key: string) => {
            let elementMap = new Map(Object.entries(element));
            waitingFileResult.push({
                elementName: key,
                averageLength: elementMap.get("averageLength") as number,
                stdDev: elementMap.get("stdDev") as number,
                maxLength: elementMap.get("maxLength") as number,
                currentLength: elementMap.get("currentLength") as number,
                avgWaitTime: elementMap.get("avgWaitTime") as number
            });
        });

        setResultProps({
            data: {
                intrinsicResult: intrinsicResult,
                nonIntrinsicResult: nonintrinsicResult,
                counterResult: counterResult,
                waitingFileResult: waitingFileResult,
                terminationReason: terminationReason
            }
        });
    }).catch((error: any) => {
        alert(error);
    });
}


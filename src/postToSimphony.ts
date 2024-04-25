import axios from "axios";
import { IRRow, NIRRow, CounterRow, WFRow, ResultViewProps } from "./resultView/resultView";
import { Dispatch } from "react";
import env from "react-dotenv";

let url = String(env.API_URL);
url += url.endsWith("/") ? "" : "/";
const Endpoint = `${url}api/cyclone/`;

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
            min: elementMap.get("min") as string,
            max: elementMap.get("max") as string,
            mean: elementMap.get("mean") as string,
            stdDev: elementMap.get("stdDev") as string,
            current: elementMap.get("current") as string
            });
        });

        nonintrinsicResultJson.forEach((element: any, key: string) => {
            let elementMap = new Map(Object.entries(element));
            nonintrinsicResult.push({
            elementName: key,
            min: elementMap.get("min") as string,
            max: elementMap.get("max") as string,
            mean: elementMap.get("mean") as string,
            stdDev: elementMap.get("stdDev") as string,
            observationCount: elementMap.get("observationCount") as string
            });
        });

        counterResultJson.forEach((element: any, key: string) => {
            let elementMap = new Map(Object.entries(element));
            counterResult.push({
            elementName: key,
            finalCount: elementMap.get("finalCount") as string,
            productionRate: elementMap.get("productionRate") as string,
            averageInterArrivalTime: elementMap.get("averageInterArrivalTime") as string,
            firstArrival: elementMap.get("firstArrival") as string,
            lastArrival: elementMap.get("lastArrival") as string
            });
        });

        waitingFileResultJson.forEach((element: any, key: string) => {
            let elementMap = new Map(Object.entries(element));
            waitingFileResult.push({
            elementName: key,
            averageLength: elementMap.get("averageLength") as string,
            stdDev: elementMap.get("stdDev") as string,
            maxLength: elementMap.get("maxLength") as string,
            currentLength: elementMap.get("currentLength") as string,
            avgWaitTime: elementMap.get("avgWaitTime") as string
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


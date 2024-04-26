import axios from "axios";
import { Dispatch } from "react";
import { storageOverride } from "../blocklyEditor/serialization";

let url = String(import.meta.env.VITE_API_URL);
url += url.endsWith("/") ? "" : "/";

export function getModelList(setModelList: Dispatch<string[]>) {
    let endpoint = `${url}api/models/list`;

    axios.get(endpoint).then((response) => {
        let data = response.data;
        setModelList(data["processNames"]);
    });
}

export function loadModel(modelName: string, setIsLoading: Dispatch<boolean>) {
    let endpoint = `${url}api/models`;

    axios.get(endpoint, {
        params: {
            processName: modelName
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        let data = response.data;
        // Load and override the workspace
        storageOverride(data["workspace"], data["currentWarnings"]);
        window.location.reload();
    }).finally(() => {
        setIsLoading(false);
    });
}
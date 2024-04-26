import axios from "axios";
import { Dispatch } from "react";
import { storageOverride } from "../blocklyEditor/serialization";

let url = String(import.meta.env.VITE_API_URL);
url += url.endsWith("/") ? "" : "/";

const PROCESS_NAME = "processName";

export function getModelList(setModelList: Dispatch<Set<string>>) {
    let endpoint = `${url}api/models/list`;

    axios.get(endpoint).then((response) => {
        let data = response.data;
        setModelList(new Set<string>(data[PROCESS_NAME]));
    });
}

export function loadModel(modelName: string, setIsLoading: Dispatch<boolean>) {
    let endpoint = `${url}api/models`;

    axios.get(endpoint, {
        params: {
            [PROCESS_NAME]: modelName
        }
    }).then((response) => {
        let data = response.data;
        // Load and override the workspace
        storageOverride(data["workspace"], data["currentWarnings"]);
        window.location.reload();
    }).catch((error) => {
        alert("Error loading model: " + error);
    }).finally(() => {
        setIsLoading(false);
    });
}

export function deleteModel(modelName: string, setModelList: Dispatch<Set<string>>) {
    let endpoint = `${url}api/models`;

    axios.delete(endpoint, {
        params: {
            [PROCESS_NAME]: modelName
        }
    }).then((_response) => {
        getModelList(setModelList);
    }).catch((error) => {
        alert("Error deleting model: " + error);
    });
}

export async function saveModeltoDb(modelName: string, workspaceData: string, warnings: any, overwrite: boolean = false) {
    let endpoint = `${url}api/models`;

    let data = {
        [PROCESS_NAME]: modelName,
        workspaceData: workspaceData,
        warnings: warnings
    };

    let responseCode = 0;
    try {
        responseCode = (await axios.post(endpoint, data, {
            params: {
                overwriteExisting: overwrite
            },
            headers: {
                "Content-Type": "application/json"
            }
        })).status;
        return responseCode;
    } catch (error: any) {
        return error.response.status;
    }
}

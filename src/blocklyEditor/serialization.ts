/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import { saveAs } from 'file-saver';

const workspaceStorageKey = 'mainWorkspace';
const warningStorageKey = 'workspaceWarnings';

const workspaceDataTag = "workspaceData";
const warningsTag = "warnings";

export interface FileJson {
  [workspaceDataTag]: string;
  [warningsTag]: Map<string, string | null>;
}

/**
 * Saves the state of the workspace and warnings to browser's local storage.
 * @param workspace Blockly workspace to save.
 * @param current_warnings current warnings in the workspace
 */
export const save = function(workspace: Blockly.Workspace, current_warnings: Map<string, string | null>) {
  const data = Blockly.serialization.workspaces.save(workspace);
  window.localStorage?.setItem(workspaceStorageKey, JSON.stringify(data));
  window.localStorage?.setItem(warningStorageKey, JSON.stringify(Object.fromEntries(current_warnings)));
};

/**
 * Overwrite the existing workspace data with a given workspace data and warnings
 * @param workspaceData the workspace data string
 * @param current_warnings current warnings in the workspace 
 */
export const storageOverride = function(workspaceData: string, current_warnings: any) {
  window.localStorage?.setItem(workspaceStorageKey, workspaceData);
  if (current_warnings instanceof Map) {
    window.localStorage?.setItem(warningStorageKey, JSON.stringify(Object.fromEntries(current_warnings)));
  }
  else {
    window.localStorage?.setItem(warningStorageKey, JSON.stringify(current_warnings));
  }
}

/**
 * Save the state of the workspace to a file
 * @param workspace The workspace
 * @param current_warnings current warnings in the workspace
 * @param filename name of the file
 */
export const saveFile = function(workspace: Blockly.WorkspaceSvg, current_warnings: Map<string, string | null>, filename: string) {
  const data = Blockly.serialization.workspaces.save(workspace);
  const fileJson: FileJson = {
    [workspaceDataTag]: JSON.stringify(data),
    [warningsTag]: current_warnings
  };

  const blob = new Blob([JSON.stringify(fileJson)], {type: "application/json;charset=utf-8"});
  saveAs(blob, filename);
}

/**
 * Loads saved state from local storage into the given workspace.
 * @param workspace Blockly workspace to load into.
 * @returns A tuple. First is a boolean. True if data was loaded successfully, false otherwise. Second is a map of warnings.
 */
export const load = function(workspace: Blockly.Workspace): [boolean, Map<string, string | null>]{
  try {
    const data = window.localStorage?.getItem(workspaceStorageKey);
    if (!data) return [false, new Map<string, string | null>()];
    var current_warnings_string = window.localStorage?.getItem(warningStorageKey);
    if (!current_warnings_string) current_warnings_string = '{}';
    var current_warnings: Map<string, string | null> = new Map(Object.entries(JSON.parse(current_warnings_string)))
  
    // Don't emit events during loading.
    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(JSON.parse(data), workspace, undefined);
    Blockly.Events.enable();
  
    return [true, current_warnings];
  }
  catch (e) {
    if (e instanceof Error) {
      alert("Error loading previous workspace: " + e);
    }
    return [false, new Map<string, string | null>()];
  }
};

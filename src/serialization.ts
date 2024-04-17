/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

const workspaceStorageKey = 'mainWorkspace';
const warningStorageKey = 'workspaceWarnings';
/**
 * Saves the state of the workspace and warnings to browser's local storage.
 * @param workspace Blockly workspace to save.
 */
export const save = function(workspace: Blockly.Workspace, current_warnings: Map<string, string | null>) {
  const data = Blockly.serialization.workspaces.save(workspace);
  window.localStorage?.setItem(workspaceStorageKey, JSON.stringify(data));
  window.localStorage?.setItem(warningStorageKey, JSON.stringify(Object.fromEntries(current_warnings)));
};

/**
 * Loads saved state from local storage into the given workspace.
 * @param workspace Blockly workspace to load into.
 * @returns A tuple. First is a boolean. True if data was loaded successfully, false otherwise. Second is a map of warnings.
 */
export const load = function(workspace: Blockly.Workspace): [boolean, Map<string, string | null>]{
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
};

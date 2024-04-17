import Blockly from "blockly";
import { load, save } from "../serialization";
import BlockNames from "./blocks/names";
import { cycloneGenerator } from "./generators/cyclone";
import { Dispatch } from "react";

// workspace
export const workspaceHandler = (ws: Blockly.WorkspaceSvg, runButtonId: string, setGeneratedCodeList: Dispatch<Array<string>>) => {
    const runButton = document.getElementById(runButtonId);
    const MIN_LABEL = 0;

    // Load previous workspace
    var [successLoad, current_warnings] = load(ws)

    // keep tract of the labels
    var label_lookup = new Map<String, String>();
    var label_type_lookup = new Map<String, String>();

    var label_c_set = new Array<[string, string]>();
    var label_n_set = new Array<[string, string]>();
    var label_q_set = new Array<[string, string]>();
    var label_fn_set = new Array<[string, string]>();

    type DropdownOptions = Array<[string, string]>;
    type RefDropdownBlock = Blockly.BlockSvg & { dropdownOptions: DropdownOptions, selectedOption: string };

    label_c_set.push(['none', 'none']);
    label_n_set.push(['none', 'none']);
    label_q_set.push(['none', 'none']);
    label_fn_set.push(['none', 'none']);

    var current_label = MIN_LABEL;

    // Load the main block first if not a success load
    if (!successLoad || ws.getAllBlocks().length === 0) {
        var xmlText = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="main_block" x="25" y="20"><field name="PROCESS_NAME">process name</field><field name="length_of_run">1</field><field name="no_of_cycles">1</field></block></xml>';
        var xml = Blockly.utils.xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(xml, ws);
    }


    /**
     * Enable or disable the run button based on the presence of warnings
     * @param runButton The run button element
     * @param warnings The map of warnings
     * @returns whether a warning is set
     */
    const enableDisableRunButton = (runButton: HTMLButtonElement, warnings: Map<string, string | null>): boolean => {
        for (const [_, value] of warnings.entries()) {
            if (value) {
                // warnings exist
                runButton.disabled = true;
                runButton.title = "Fix the warning before generating code: " + value;
                return true;
            }
        }
        return false;
    };

    /**
     * Update the current_label to the max value in the workspace
     * @returns None
     */
    const updateMaxLabel = (): void => {
        // update current label to the max value in the workspace
        current_label = Math.max(MIN_LABEL, ...Array.from(label_lookup.values()).map(Number));
    }

    /**
     * Automatically sets the new label value to be the current max value + 1
     * @param block The block to set the label value for
     * @returns True if the label value was successfully set, false otherwise
     */
    const auto_set_new_label_value = (block: Blockly.BlockSvg): boolean => {
        current_label += 1;
        switch (block.type) {
            case BlockNames.CombiInputStatement.Type:
                label_c_set.push([String(current_label), String(current_label)]);
                label_c_set.sort()
                block.setFieldValue(current_label, BlockNames.CombiInputStatement.Label);
                break;
            case BlockNames.NormalTaskInput.Type:
                label_n_set.push([String(current_label), String(current_label)]);
                label_n_set.sort()
                block.setFieldValue(current_label, BlockNames.NormalTaskInput.Label);
                break;
            case BlockNames.QueueInputStatement.Type:
                label_q_set.push([String(current_label), String(current_label)]);
                label_q_set.sort()
                block.setFieldValue(current_label, BlockNames.QueueInputStatement.Label);
                break;
            case BlockNames.FunctionConsolidateInput.Type:
                label_fn_set.push([String(current_label), String(current_label)]);
                label_fn_set.sort()
                block.setFieldValue(current_label, BlockNames.FunctionConsolidateInput.Label);
                break;
            case BlockNames.FunctionCounterInput.Type:
                label_fn_set.push([String(current_label), String(current_label)]);
                label_fn_set.sort()
                block.setFieldValue(current_label, BlockNames.FunctionCounterInput.Label);
                break;
            default:
                // Not a network statement block
                current_label -= 1;
                return false;
        }

        // store the label id and the block
        label_lookup.set(block.id, String(current_label));
        label_type_lookup.set(String(current_label), block.type);

        updateMaxLabel();

        return true;
    }

    /**
     * Delete the label value from the lookup and its set
     * @param block_id The block id to delete the label value for
     * @returns True if the label value was successfully deleted, false otherwise
     */
    const delete_block_label_value = (block_id: String): boolean => {
        // get block label and type
        var block_label = label_lookup.get(block_id);
        if (block_label === undefined) return false;
        var block_type = label_type_lookup.get(block_label);
        if (block_type === undefined) return false;

        // delete lookup entry
        label_lookup.delete(block_id);
        label_type_lookup.delete(block_label);

        updateMaxLabel();

        // delete label from set
        switch (block_type) {
            case BlockNames.CombiInputStatement.Type:
                label_c_set = label_c_set.filter((value) => value[0] !== block_label);
                return true;
            case BlockNames.NormalTaskInput.Type:
                label_n_set = label_n_set.filter((value) => value[0] !== block_label);
                return true;
            case BlockNames.QueueInputStatement.Type:
                label_q_set = label_q_set.filter((value) => value[0] !== block_label);
                return true;
            case BlockNames.FunctionConsolidateInput.Type:
            case BlockNames.FunctionCounterInput.Type:
                label_fn_set = label_fn_set.filter((value) => value[0] !== block_label);
                return true;
            default:
                return false;
        }
    }

    /**
     * get the block id from the block json
     * @param block_json the block json
     * @returns the block id
     */
    const getEventBlockId = (block_json: any): string => {
        if (block_json.hasOwnProperty('blockId') && block_json.blockId != null) {
            return block_json.blockId;
        }
        else if (block_json.hasOwnProperty('id') && block_json.id != null) {
            return block_json.id;
        }
        else if (block_json.hasOwnProperty('ids') && block_json.ids.length > 0) {
            return block_json.ids[0];
        }
        else return '';
    }

    /**
     * Get the label of the block
     * @param block the block to get the label from
     * @returns the label of the block
     */
    const getBlockLabel = (block: Blockly.Block): string => {
        switch (block.type) {
            case BlockNames.CombiInputStatement.Type:
                return block.getFieldValue(BlockNames.CombiInputStatement.Label)?.toString();
            case BlockNames.NormalTaskInput.Type:
                return block.getFieldValue(BlockNames.NormalTaskInput.Label)?.toString();
            case BlockNames.QueueInputStatement.Type:
                return block.getFieldValue(BlockNames.QueueInputStatement.Label)?.toString();
            case BlockNames.FunctionConsolidateInput.Type:
                return block.getFieldValue(BlockNames.FunctionConsolidateInput.Label)?.toString();
            case BlockNames.FunctionCounterInput.Type:
                return block.getFieldValue(BlockNames.FunctionCounterInput.Label)?.toString();
            default:
                return '';
        }
    }

    /**
     * Update the dropdown options of the reference block
     * @param block the reference block to update
     * @param labels the new dropdown options
     */
    const updateRefBlockLabels = (block: RefDropdownBlock, labels: DropdownOptions): void => {
        var dropdown = block.getInput(BlockNames.RefStatements.Dropdown);
        // get selected option and preserve it
        var selectedOption = (block.getField(BlockNames.RefStatements.DropdownLabel) as any).selectedOption[0];

        // reset to new dropdown option
        dropdown?.removeField(BlockNames.RefStatements.DropdownLabel, true);
        dropdown?.appendField(new Blockly.FieldDropdown(labels) as Blockly.Field<string | undefined>, BlockNames.RefStatements.DropdownLabel);

        // set the selected option to previous value (Will default to 'none' if not found in new options)
        block.setFieldValue(selectedOption, BlockNames.RefStatements.DropdownLabel);

        // Pass to mutator
        block.dropdownOptions = labels;
        block.selectedOption = selectedOption;
    }

    /**
     * Update the label lookup and its set
     * @param block the block to update
     * @param block_id the block id
     * @param block_label the new block label
     */
    const UpdateLabelLookup = (block: Blockly.BlockSvg, block_id: string, block_label: string): void => {
        // delete the old id
        delete_block_label_value(block_id);

        // set the new id
        label_lookup.set(block_id, block_label);
        label_type_lookup.set(block_label, block.type);

        // Update set
        switch (block.type) {
            case BlockNames.CombiInputStatement.Type:
                label_c_set.push([block_label, block_label]);
                label_c_set.sort()
                break;
            case BlockNames.NormalTaskInput.Type:
                label_n_set.push([block_label, block_label]);
                label_n_set.sort()
                break;
            case BlockNames.QueueInputStatement.Type:
                label_q_set.push([block_label, block_label]);
                label_q_set.sort()
                break;
            case BlockNames.FunctionConsolidateInput.Type:
            case BlockNames.FunctionCounterInput.Type:
                label_fn_set.push([block_label, block_label]);
                label_fn_set.sort()
                break;
        }
        // Update the max label available
        updateMaxLabel();
    }

    /**
     * count the length of the statement block chain
     * @param block the starting block to count from
     * @returns the length of the chain
     */
    const countRefLength = (block: Blockly.Block | null): number => {
        if (block == null) return 0;
        var count = 1;
        var pointer = block.getNextBlock();
        while (pointer) {
            count += 1;
            pointer = pointer.getNextBlock();
        }
        return count;
    }

    /**
     * check if a reference dropdown is selected. Set a warning if not.
     * @param block the reference block
     * @returns None
     */
    const checkIfRefDropdownSelected = (block: Blockly.Block | null): void => {
        if (block == null) return;
        var dropdownValue = block.getFieldValue(BlockNames.RefStatements.DropdownLabel);
        if (dropdownValue == 'none') {
            setBlockWarning(block, "Must select a label", "dropdown_none_warning");
            return;
        }
        else {
            setBlockWarning(block, null, "dropdown_none_warning");
            return;
        }
    }

    /**
     * Check if the reference statement stack has unique labels
     * @param block The parent block holding the reference statement stack
     * @returns None
     */
    const checkIfRefLabelsUnique = (block: Blockly.Block | null): void => {
        if (block == null) return;
        var dropdownValue = block.getFieldValue(BlockNames.RefStatements.DropdownLabel);
        var labelSet = new Set<string>();

        // generate existing set of labels
        var pointer = block.previousConnection?.targetBlock();
        while (pointer) {
            var nextValue = pointer.getFieldValue(BlockNames.RefStatements.DropdownLabel);
            labelSet.add(nextValue);
            pointer = pointer.previousConnection?.targetBlock();
        }

        if (labelSet.has(dropdownValue)) {
            setBlockWarning(block, "Label already referenced!", "dropdown_reference_warning");
            return;
        }
        else {
            setBlockWarning(block, null, "dropdown_reference_warning");
            return;
        }
    }

    /**
     * Check if the follower and preceder blocks are valid
     * @param block The network input block to check
     * @returns None
     */
    const checkFollowerPreceder = (block: Blockly.BlockSvg): void => {
        var followersHead = block.getInputTargetBlock(BlockNames.CombiInputStatement.Followers)
            || block.getInputTargetBlock(BlockNames.NormalTaskInput.Followers)
            || block.getInputTargetBlock(BlockNames.FunctionConsolidateInput.Followers)
            || block.getInputTargetBlock(BlockNames.FunctionCounterInput.Followers);

        var precedersHead = block.getInputTargetBlock(BlockNames.CombiInputStatement.Preceders)

        switch (block.type) {
            // Explicit fall through
            //@ts-ignore
            case BlockNames.CombiInputStatement.Type:
                var preceedersCount = countRefLength(precedersHead);

                if (preceedersCount < 2) {
                    setBlockWarning(block, "Must be preceded by at least 2 QUEUE references", "block_preceeders_warning");
                }
                else {
                    setBlockWarning(block, null, "block_preceeders_warning");
                }
            default:
                checkIfRefDropdownSelected(followersHead);
                checkIfRefDropdownSelected(precedersHead);
                checkIfRefLabelsUnique(followersHead);
                checkIfRefLabelsUnique(precedersHead);
        }
    }

    /**
     * Update the current warnings list
     * @returns None
     */
    const updateCurrentWarnings = (): void => {
        for (const [key, _] of current_warnings.entries()) {
            // Remove key if no longer exists in workspace
            var currentBlock = ws.getBlockById(key.toString())
            if (currentBlock == null) {
                current_warnings.delete(key);
            }
        }
    }

    /**
     * Set the block warning text and update the current warnings list
     * @param block The block to set the warning for
     * @param warningText The warning text to set
     * @param warningName The warning name to set
     * @returns None
     */
    const setBlockWarning = (block: Blockly.BlockSvg | Blockly.Block, warningText: string | null, warningName: string): void => {
        block.setWarningText(warningText, warningName);
        current_warnings.set(block.id, warningText);

        // Update all the warnings
        updateCurrentWarnings();
        if (runButton instanceof HTMLButtonElement) {
            var haveWarnings = enableDisableRunButton(runButton, current_warnings);
            if (haveWarnings) return;

            // all warnings are cleared
            runButton.disabled = false;
            current_warnings.clear();
        }
    }

    /**
     * Update the reference labels for all reference blocks
     * @returns None
     */
    const updateRefLabels = (): void => {
        var allBlocks = ws.getAllBlocks();
        allBlocks.forEach((block) => {
            switch (block.type) {
                case BlockNames.RefStatements.Type.Queue:
                    updateRefBlockLabels(block as RefDropdownBlock, label_q_set);
                    break;
                case BlockNames.RefStatements.Type.Combi:
                    updateRefBlockLabels(block as RefDropdownBlock, label_c_set);
                    break;
                case BlockNames.RefStatements.Type.Normal:
                    updateRefBlockLabels(block as RefDropdownBlock, label_n_set);
                    break;
                case BlockNames.RefStatements.Type.Function:
                    updateRefBlockLabels(block as RefDropdownBlock, label_fn_set);
                    break;
            }
        });
    }

    /**
     * Validate all network input blocks
     * @returns None
     */
    const validateNetworkBlocks = (): void => {
        var allBlocks = ws.getAllBlocks();
        allBlocks.forEach((block) => {
            if (block.type === BlockNames.CombiInputStatement.Type
                || block.type === BlockNames.NormalTaskInput.Type
                || block.type === BlockNames.FunctionConsolidateInput.Type
                || block.type === BlockNames.FunctionCounterInput.Type) {
                checkFollowerPreceder(block);
            }

            if (block.type === BlockNames.CombiInputStatement.Type || block.type === BlockNames.NormalTaskInput.Type) {
                // check if set is connected
                var setBlock = block.getInputTargetBlock(BlockNames.CombiInputStatement.SetNumber)
                    || block.getInputTargetBlock(BlockNames.NormalTaskInput.SetNumber);
                if (!setBlock) {
                    setBlockWarning(block, "Set block is not connected", "set_warning");
                }
                else {
                    setBlockWarning(block, null, "set_warning");
                }
            }
        });
    }

    /**
     * Handles the ON_CREATE event
     * @param event_props the event properties as JSON
     * @returns None
     */
    const handleCreateEvent = (event_props: any): void => {
        var block_id = getEventBlockId(event_props);
        var block = ws.getBlockById(block_id);

        if (block === null) return;
        // Auto increment the label value when new Network Input block is placed
        // Remove label value from the set when block is deleted
        auto_set_new_label_value(block)

        // Update reference labels
        updateRefLabels();
    }

    /**
     * Handles the ON_DELETE event
     * @param event_props the event properties as JSON
     * @returns None
     */
    const handleDeleteEvent = (event_props: any): void => {
        // cannot get block from ws because it no longer exists.
        var block_id = getEventBlockId(event_props);

        // check if the block has a label
        if (!label_lookup.has(block_id)) return;
        // delete block from lookup
        delete_block_label_value(block_id)

        // Modify label references
        updateRefLabels();
    }

    /**
     * Handles the ON_FIELD_CHANGE event
     * @param event_props the event properties as JSON
     * @returns None
     */
    const handleFieldChangeEvent = (event_props: any): void => {
        // Filter for label changes
        if (String(event_props.name).startsWith('label_')) {
            var block_id = getEventBlockId(event_props);
            if (!label_lookup.has(block_id)) return;

            // get the new input label
            var block = ws.getBlockById(block_id);
            if (block === null) return;
            var block_label = getBlockLabel(block);
            if (label_type_lookup.has(block_label)) {
                setBlockWarning(block, `Label '${block_label}' already exists`, "label_warning");
            }
            else {
                setBlockWarning(block, null, "label_warning");
                // update the label value
                UpdateLabelLookup(block, block_id, block_label);

                // update reference labels
                updateRefLabels();
            }
        }
    }

    /**
     * Find the parent connection of the block
     * @param block the block to find the parent connection for
     * @returns the parent connection
     */
    const findParentConnection = (block: Blockly.BlockSvg): Blockly.RenderedConnection | null => {
        var previous_connection = block.previousConnection || block.outputConnection;
        var previous_block = previous_connection?.targetBlock();

        while (previous_block?.type.startsWith('ref_')) {
            previous_connection = previous_block?.previousConnection || block.outputConnection;
            previous_block = previous_connection?.targetBlock();
        }

        return previous_connection?.targetConnection;
    }

    /**
     * Recursively set the enabled state of all child blocks
     * @param block the block to set the enabled state for
     * @param enabled the state to set the block to
     * @returns None
     */
    const setEnableAllChildBlock = (block: Blockly.BlockSvg | null, enabled: boolean): void => {
        block?.setEnabled(enabled);

        // set all next connections to be enabled
        var pointer: Blockly.BlockSvg | null = block;
        while (pointer) {
            pointer = pointer.nextConnection?.targetBlock();
            setEnableAllChildBlock(pointer, enabled);
        }
    }

    /**
     * Handles the ON_BLOCK_MOVE event
     * @param event_props the event properties as JSON
     * @returns None
     */
    const handleBlockMoveEvent = (event_props: any): void => {
        var block_id = getEventBlockId(event_props);
        var block = ws.getBlockById(block_id);
        if (!block) return;
        if (block.type.startsWith('ref_')) {
            var parentConnection = findParentConnection(block);
            var parentCheck = parentConnection?.getCheck();
            if (parentConnection != null && parentCheck != null) {
                if (!parentCheck.includes(block.type)) {
                    block.previousConnection.disconnect();
                }
                updateRefLabels();

                var parentBlock = parentConnection.sourceBlock_;
                if (parentBlock != null) {
                    // Also check the follower / preceeder restraint for the parent block
                    checkFollowerPreceder(parentBlock);
                    // check if dropdown other than none is selected
                    checkIfRefDropdownSelected(block);
                    // check if dropdown selected is unique
                    checkIfRefLabelsUnique(block);
                }
            }
        }

        // Disable block if the block isn't connected to hte main block, or the block is unconnected, or the connected block is also disabled
        if (!(block.type === BlockNames.MainBlock.Type)) {
            var parentConnection = findParentConnection(block);
            if (!parentConnection) setEnableAllChildBlock(block, false);
            else if (parentConnection.sourceBlock_.type === BlockNames.MainBlock.Type) setEnableAllChildBlock(block, true);
            else if (block.previousConnection?.targetBlock()?.isEnabled() === false) setEnableAllChildBlock(block, false);
            else setEnableAllChildBlock(block, true);
        }
    }

    /**
     * Handles the ON_BLOCK_CHANGE event
     * @param event_props the event properties as JSON
     * @returns None
     */
    const handleBlockChangeEvent = (event_props: any): void => {
        var block_id = getEventBlockId(event_props);
        var block = ws.getBlockById(block_id);
        if (block?.type.startsWith('ref_')) {
            // Check if dropdown other than none is selected
            checkIfRefDropdownSelected(block);
            // Check if reference is unique within the parent block
            checkIfRefLabelsUnique(block);
        }

        // validate all network input blocks
        validateNetworkBlocks();
    }

    /**
     * Validate the main block
     * @returns None
     */
    const validateMainBlock = (): void => {
        var allBlocks = ws.getAllBlocks();
        var mainBlocks = allBlocks.filter((block) => block.type === BlockNames.MainBlock.Type);
        for (var i = 0; i < mainBlocks.length; i++) {
            var block = mainBlocks[i];
            var processName = block.getFieldValue(BlockNames.MainBlock.ProcessName);
            if (processName == null || processName.match(/^ *$/) !== null) {
                setBlockWarning(block, "Process name cannot be empty", "main_block_warning");
            }
            else {
                setBlockWarning(block, null, "main_block_warning");
            }

            var NetworkBlocks = block.getInputTargetBlock(BlockNames.MainBlock.NetworkInput);
            if (countRefLength(NetworkBlocks) < 1) {
                setBlockWarning(block, "Must have at least 1 network input block", "main_block_network_warning");
            }
            else {
                setBlockWarning(block, null, "main_block_network_warning");
            }
        }
    }

    /**
     * Validate all blocks
     * @returns None
     */
    const validateBlocks = (): void => {
        // Always validate blocks after each event
        validateNetworkBlocks();

        // Validate main block
        validateMainBlock();

        // Validate Duration Input Block
        var stationaryInputBlocks = [...ws.getBlocksByType(BlockNames.StationaryInputConnector.Type), ...ws.getBlocksByType(BlockNames.NonStationaryInputConnector.Type)]
        stationaryInputBlocks.forEach((block) => {
            var distributionInput = block.getInput(BlockNames.StationaryInputConnector.Distribution) || block.getInput(BlockNames.NonStationaryInputConnector.Distribution);
            var distribution = distributionInput?.connection?.targetBlock();
            if (!distribution) {
                setBlockWarning(block, "Missing distribution", "distribution_warning");
            }
            else {
                setBlockWarning(block, null, "distribution_warning");
            }
        });
    }

    // Event listeners
    ws.addChangeListener((e) => {
        var event_props = e.toJson();
        switch (e.type) {
            case Blockly.Events.BLOCK_CREATE:
                handleCreateEvent(event_props);
                break;
            case Blockly.Events.BLOCK_DELETE:
                handleDeleteEvent(event_props);
                break;
            case Blockly.Events.BLOCK_FIELD_INTERMEDIATE_CHANGE:
                handleFieldChangeEvent(event_props);
                break;
            case Blockly.Events.BLOCK_MOVE:
                handleBlockMoveEvent(event_props);
                break;
            case Blockly.Events.BLOCK_CHANGE:
                handleBlockChangeEvent(event_props);
                break;
        }

        // Validate all blocks
        validateBlocks();

        // Update warning lists
        updateCurrentWarnings();

        // Save workspace temporarily
        save(ws, current_warnings)
    });

    // Run button on click, generate code and display on the side.
    // Only generate code if there are no warnings
    // Only starts from the main block
    if (runButton) {
        runButton.onclick = function () {
            var mainBlock = ws.getBlocksByType(BlockNames.MainBlock.Type);
            var codes = new Array<string>();

            for (var i = 0; i < mainBlock.length; i++) {
                var code = cycloneGenerator.blockToCode(mainBlock[i]) as string;
                codes.push(code);
            }
            
            setGeneratedCodeList(codes);
        }
    }

    // Update reference labels on load
    var allBlocks = ws.getAllBlocks();
    allBlocks.forEach((block) => {
        var blockLabel = getBlockLabel(block)
        UpdateLabelLookup(block, block.id, blockLabel)
    })
    updateRefLabels();
    // Validate all blocks on load
    validateBlocks();
}

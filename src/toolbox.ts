/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/

import BlockNames from "./blocks/names";

export const toolbox = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: 'Main',
            colour: "#5C81A6",
            contents: [
                {
                    kind: 'block',
                    type: BlockNames.MainBlock.Type
                }
            ],
        },
        {
            kind: 'category',
            name: 'Network Input Block',
            colour: "#5C81A6",
            contents: [
                {
                    kind: 'block',
                    type: BlockNames.CombiInputStatement.Type
                },
                {
                    kind: 'block',
                    type: BlockNames.NormalTaskInput.Type
                },
                {
                    kind: 'block',
                    type: BlockNames.QueueInputStatement.Type
                },
                {
                    kind: 'block',
                    type: BlockNames.FunctionConsolidateInput.Type
                },
                {
                    kind: 'block',
                    type: BlockNames.FunctionCounterInput.Type
                }
            ],
        },
        {
            kind: 'category',
            name: 'Network Input Reference',
            colour: "#5C81A6",
            contents: [
                {
                    kind: 'block',
                    type: BlockNames.RefStatements.Type.Combi
                },
                {
                    kind: 'block',
                    type: BlockNames.RefStatements.Type.Queue
                },
                {
                    kind: 'block',
                    type: BlockNames.RefStatements.Type.Normal
                },
                {
                    kind: 'block',
                    type: BlockNames.RefStatements.Type.Function
                }
            ]
        },
        {
            kind: 'category',
            name: 'Resource Input Block',
            colour: "#5C81A6",
            contents: [ 
                {
                    kind: 'block',
                    type: BlockNames.ResourceInputStatement.Type
                },
                {
                    kind: 'block',
                    type: BlockNames.VariableCostStatement.Type
                },
                {
                    kind: 'block',
                    type: BlockNames.FixedCostStatement.Type
                }
            ]
        },
        {
            kind: 'category',
            name: 'Duration Input Block',
            colour: "#5C81A6",
            contents: [
                {
                    kind: 'block',
                    type: BlockNames.StationaryInputConnector.Type
                },
                {
                    kind: 'block',
                    type: BlockNames.NonStationaryInputConnector.Type
                },
                {
                    kind: 'block',
                    type: BlockNames.Distribution.Type
                }
            ]
        },
        {
            kind: 'category',
            name: 'Description',
            colour: "#5C81A6",
            contents: [
                {
                    kind: 'block',
                    type: BlockNames.Description.Type
                }
            ]
        }
    ],
};

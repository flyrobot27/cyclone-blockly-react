/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import { string } from 'blockly/core/utils';
import BlockNames from './names';

// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.
const mainBlock = {
  "type": BlockNames.MainBlock.Type,
  "message0": "PROCESS NAME %1 LENGTH %2 CYCLES %3 %4 %5",
  "args0": [
    {
      "type": "field_input",
      "name": BlockNames.MainBlock.ProcessName,
      "text": "process name"
    },
    {
      "type": "field_number",
      "name": BlockNames.MainBlock.LengthOfRun,
      "value": 1,
      "min": 1,
      "precision": 1
    },
    {
      "type": "field_number",
      "name": BlockNames.MainBlock.NoOfCycles,
      "value": 1,
      "min": 1,
      "precision": 1
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": BlockNames.MainBlock.NetworkInput,
      "check": ["network_input_statement"]
    }
  ],
  "colour": 330,
  "tooltip": "Main program block",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/Index.html"
};

const combiInput = {
  "type": BlockNames.CombiInputStatement.Type,
  "message0": "COMBI %2 LABEL %1 SET %3 DESCRIPTION (optional) %4 FOLLOWERS %5 PRECEDERS %6",
  "args0": [
    {
      "type": "field_number",
      "name": BlockNames.CombiInputStatement.Label,
      "value": 0,
      "min": 0,
      "precision": 1,
    },
    {
      "type": "input_dummy",
      "align": "LEFT"
    },
    {
      "type": "input_value",
      "name": BlockNames.CombiInputStatement.SetNumber,
      "check": ["set_input"],
      "align": "LEFT",
    },
    {
      "type": "input_value",
      "name": BlockNames.CombiInputStatement.Description,
      "check": ["description"],
    },
    {
      "type": "input_statement",
      "name": BlockNames.CombiInputStatement.Followers,
      "check": ["ref_queue", "ref_normal", "ref_function"],
      "align": "LEFT"
    },
    {
      "type": "input_statement",
      "name": BlockNames.CombiInputStatement.Preceders,
      "check": ["ref_queue"],
      "align": "LEFT"
    },
  ],
  "previousStatement": ["network_input_statement"],
  "nextStatement": ["network_input_statement"],
  "inputsInline": false,
  "colour": 170,
  "tooltip": "This is a COMBI network input statement. SET should be a Duration Input statement. FOLLOWERS are precursers to this statement. PRECEDEERS are statements that come after this statement. FOLLOWERS and PRECEDEERS must be Network Input Labels.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc71.htm"
};

const normalTask = {
  "type": BlockNames.NormalTaskInput.Type,
  "message0": "NORMAL %2 LABEL %1 SET %3 DESCRIPTION (optional) %4 %5 FOLLOWERS %6",
  "args0": [
    {
      "type": "field_number",
      "name": BlockNames.NormalTaskInput.Label,
      "value": 0,
      "min": 0,
      "precision": 1
    },
    {
      "type": "input_dummy",
      "align": "LEFT"
    },
    {
      "type": "input_value",
      "name": BlockNames.NormalTaskInput.SetNumber,
      "check": ["set_input"],
      "align": "LEFT"
    },
    {
      "type": "input_value",
      "name": BlockNames.NormalTaskInput.Description,
      "check": ["description"]
    },
    {
      "type": "input_dummy",
      "align": "LEFT"
    },
    {
      "type": "input_statement",
      "name": BlockNames.NormalTaskInput.Followers,
      "check": ["ref_queue", "ref_normal", "ref_function"],
      "align": "LEFT"
    }
  ],
  "previousStatement": ["network_input_statement"],
  "nextStatement": ["network_input_statement"],
  "inputsInline": false,
  "colour": 180,
  "tooltip": "This is a NORMAL network input statement. SET should be a Duration Input statement. FOLLOWERS are precursers to this statement. FOLLOWERS must be Network Input Labels.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc72.htm"
};

const queue = {
  "type": BlockNames.QueueInputStatement.Type,
  "message0": "QUEUE LABEL %1 %2 DESCRIPTION (optional) %3 GENERATE %4 %5 RESOURCE (optional) %6",
  "args0": [
    {
      "type": "field_number",
      "name": BlockNames.QueueInputStatement.Label,
      "value": 0,
      "min": 0,
      "precision": 1
    },
    {
      "type": "input_dummy",
      "align": "LEFT"
    },
    {
      "type": "input_value",
      "name": BlockNames.QueueInputStatement.Description,
      "check": ["description"],
    },
    {
      "type": "field_number",
      "name": BlockNames.QueueInputStatement.NumberToBeGenerated,
      "value": 1,
      "min": 1,
      "precision": 1
    },
    {
      "type": "input_dummy",
      "align": "LEFT"
    },
    {
      "type": "input_value",
      "name": BlockNames.QueueInputStatement.ResourceInput,
      "check": ["resource_input"],
      "align": "LEFT"
    }
  ],
  "previousStatement": ["network_input_statement"],
  "nextStatement": ["network_input_statement"],
  "inputsInline": false,
  "colour": 190,
  "tooltip": "This is a QUEUE network input statement. RESOURCE should be a Resource Input statement.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc73.htm"
};

const function_consolidate = {
  "type": BlockNames.FunctionConsolidateInput.Type,
  "message0": "FUNCTION CONSOLIDATE LABEL %1 %2 CONSOLIDATE %3 %4 DESCRIPTION (optional) %5 FOLLOWERS %6",
  "args0": [
    {
      "type": "field_number",
      "name": BlockNames.FunctionConsolidateInput.Label,
      "value": 0,
      "min": 0,
      "precision": 1
    },
    {
      "type": "input_dummy",
      "align": "LEFT"
    },
    {
      "type": "field_number",
      "name": BlockNames.FunctionConsolidateInput.NumberToConsolidate,
      "value": 0,
      "min": 0,
      "precision": 1
    },
    {
      "type": "input_dummy",
      "align": "LEFT"
    },
    {
      "type": "input_value",
      "name": BlockNames.FunctionConsolidateInput.Description,
      "check": ["description"]
    },
    {
      "type": "input_statement",
      "name": BlockNames.FunctionConsolidateInput.Followers,
      "check": ["ref_queue", "ref_normal", "ref_function"],
    }
  ],
  "previousStatement": ["network_input_statement"],
  "nextStatement": ["network_input_statement"],
  "inputsInline": false,
  "colour": 200,
  "tooltip": "This is a FUNCTION network input statement, defining CONSOLIDATE.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc74.htm"
};

const function_counter = {
  "type": BlockNames.FunctionCounterInput.Type,
  "message0": "FUNCTION COUNTER LABEL %1 %2 QUANTITY %3 %4 DESCRIPTION (optional) %5 FOLLOWERS %6",
  "args0": [
    {
      "type": "field_number",
      "name": BlockNames.FunctionCounterInput.Label,
      "value": 0,
      "min": 0,
      "precision": 1
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_number",
      "name": BlockNames.FunctionCounterInput.Quantity,
      "value": 0,
      "min": 0,
      "precision": 1
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": BlockNames.FunctionConsolidateInput.Description,
      "check": ["description"]
    },
    {
      "type": "input_statement",
      "name": "followers",
      "check": ["ref_queue", "ref_normal", "ref_function"],
    }
  ],
  "previousStatement": ["network_input_statement"],
  "nextStatement": ["network_input_statement"],
  "inputsInline": false,
  "colour": 210,
  "tooltip": "This is a FUNCTION network input statement, defining CONSOLIDATE.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc74.htm"
};

const resource_input = {
  "type": BlockNames.ResourceInputStatement.Type,
  "message0": "UNIT COUNT %1 %2 DESCRIPTION %3 COST (optional) %4",
  "args0": [
    {
      "type": "field_number",
      "name": BlockNames.ResourceInputStatement.NoOfUnit,
      "value": 0,
      "min": 0,
      "precision": 1
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": BlockNames.ResourceInputStatement.Description,
      "check": ["description"]
    },
    {
      "type": "input_statement",
      "name": BlockNames.ResourceInputStatement.Cost,
      "check": ["resource_cost"]
    }
  ],
  "output": ["resource_input"],
  "inputsInline": false,
  "colour": 230,
  "tooltip": "This is a RESOURCE INPUT statement. It is optional to add a UNIT COST. Must be connected to a QUEUE Network Input. COST is optional",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc9.htm"
}

const variable_cost = {
  "type": BlockNames.VariableCostStatement.Type,
  "message0": "VARIABLE %1",
  "args0": [
    {
      "type": "field_number",
      "name": BlockNames.VariableCostStatement.VariableCost,
      "value": 0,
      "min": 0
    }
  ],
  "previousStatement": ["resource_cost"],
  "nextStatement": ["resource_cost"],
  "colour": 250,
  "tooltip": " The variable cost associated with this unit (hourly). Must be connected to a RESOURCE INPUT statement. If multiple VARIABLE costs are present, the sum of all VARIABLE costs is used.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc9.htm"
}

const fixed_cost = {
  "type": BlockNames.FixedCostStatement.Type,
  "message0": "FIXED %1",
  "args0": [
    {
      "type": "field_number",
      "name": BlockNames.FixedCostStatement.FixedCost,
      "value": 0,
      "min": 0
    }
  ],
  "previousStatement": ["resource_cost"],
  "nextStatement": ["resource_cost"],
  "colour": 250,
  "tooltip": " The fixed cost associated with this unit (converted to an hourly basis). Must be connected to a RESOURCE INPUT statement. If multiple FIXED costs are present, the sum of all FIXED costs is used.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc9.htm"
}

const ref_queue = {
  "type": BlockNames.RefStatements.Type.Queue,
  "implicitAlign0": "RIGHT",
  "message0": "REF QUEUE LABEL %1",
  "args0": [
    {
      "type": "input_dummy",
      "name": BlockNames.RefStatements.Dropdown
    },
  ],
  "previousStatement": ["ref_label", "ref_queue"],
  "mutator": ["dropdown_mutator"],
  "nextStatement": "ref_label",
  "colour": 230,
  "tooltip": "A reference to a QUEUE Network Input Block.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc73.htm"
}

const ref_combi = {
  "type": BlockNames.RefStatements.Type.Combi,
  "implicitAlign0": "RIGHT",
  "message0": "REF COMBI LABEL %1",
  "args0": [
    {
      "type": "input_dummy",
      "name": BlockNames.RefStatements.Dropdown
    },
  ],
  "previousStatement": ["ref_label", "ref_combi"],
  "mutator": ["dropdown_mutator"],
  "nextStatement": "ref_label",
  "colour": 230,
  "tooltip": "A reference to a COMBI Network Input Block.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc73.htm"
}

const ref_normal = {
  "type": BlockNames.RefStatements.Type.Normal,
  "implicitAlign0": "RIGHT",
  "message0": "REF NORMAL LABEL %1",
  "args0": [
    {
      "type": "input_dummy",
      "name": BlockNames.RefStatements.Dropdown
    },
  ],
  "previousStatement": ["ref_label", "ref_normal"],
  "mutator": ["dropdown_mutator"],
  "nextStatement": "ref_label",
  "colour": 230,
  "tooltip": "A reference to a NORMAL Network Input Block.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc71.htm"
}

const ref_function = {
  "type": BlockNames.RefStatements.Type.Function,
  "implicitAlign0": "RIGHT",
  "message0": "REF FUNCTION LABEL %1",
  "args0": [
    {
      "type": "input_dummy",
      "name": BlockNames.RefStatements.Dropdown
    },
  ],
  "previousStatement": ["ref_label", "ref_function"],
  "mutator": ["dropdown_mutator"],
  "nextStatement": "ref_label",
  "colour": 230,
  "tooltip": "A reference to a FUNCTION Network Input Block.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc74.htm"
}

const description_multiline = {
  "type": BlockNames.Description.Type,
  "message0": "%1",
  "args0": [
    {
      "type": "field_multilinetext",
      "name": BlockNames.Description.Description,
      "text": "description"
    }
  ],
  "output": ["description"],
  "colour": 230,
  "tooltip": "This is a description field. Can connect to a Network Input statement.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/Index.html"
}

// Define types for reference dropdown
type DropdownOptions = Array<[string, string]>;

type DropDownMutatorType = typeof DROPDOWN_MUTATOR;
interface DropDownMutator extends DropDownMutatorType { dropdownOptions: DropdownOptions, selectedOption: string }
type RefDropdownBlock = Blockly.Block & DropDownMutator;

const DROPDOWN_EXTENSION = function (this: RefDropdownBlock) {
  if (!this.dropdownOptions) {
    this.dropdownOptions = [['none', 'none']];
  }
  if (!this.selectedOption) {
    this.selectedOption = 'none';
  }
  this.updateShape_(this.dropdownOptions, this.selectedOption)
}

const DROPDOWN_MUTATOR = {
  mutationToDom: function (this: RefDropdownBlock) {
    // Save the dropdown options, to make sure they are still available when the workspace is loaded.
    var mutationXml = document.createElement('mutation');
    if (!this.dropdownOptions) {
      this.dropdownOptions = [['none', 'none']];
    }
    var dropdownOptionsAsJson = JSON.stringify(this.dropdownOptions);
    mutationXml.setAttribute('dropdown_options', dropdownOptionsAsJson);
    mutationXml.setAttribute('selected_option', this.selectedOption);
    return mutationXml;
  },

  domToMutation: function (this: RefDropdownBlock, xmlElement: Element) {
    // Load the saved dropdown field options into this block
    var dropdownOptionsAsJson = xmlElement.getAttribute('dropdown_options');
    var selectedOption = xmlElement.getAttribute('selected_option');
    if (!dropdownOptionsAsJson) {
      dropdownOptionsAsJson = '[[\'none\', \'none\']]';
    };
    if (!selectedOption) {
      selectedOption = 'none';
    }
    var dropdownOptions = JSON.parse(dropdownOptionsAsJson)
    this.updateShape_(dropdownOptions, selectedOption);
  },

  updateShape_: function (this: RefDropdownBlock, dropdownOptions: DropdownOptions, selectedOption: string) {
    var dropdown = this.getInput(BlockNames.RefStatements.Dropdown);
    dropdown?.removeField(BlockNames.RefStatements.DropdownLabel, true);
    dropdown?.appendField(new Blockly.FieldDropdown(dropdownOptions) as Blockly.Field<string | undefined>, BlockNames.RefStatements.DropdownLabel);
    this.setFieldValue(selectedOption, BlockNames.RefStatements.DropdownLabel);
  }
};

Blockly.Extensions.registerMutator("dropdown_mutator", DROPDOWN_MUTATOR, DROPDOWN_EXTENSION);

const stationary_input_connector = {
  "type": BlockNames.StationaryInputConnector.Type,
  "message0": "STATIONARY %1",
  "args0": [
    {
      "type": "input_value",
      "name": BlockNames.StationaryInputConnector.Distribution,
      "check": "distribution"
    }
  ],
  "output": "set_input",
  "colour": 130,
  "tooltip": "This is a stationary input. Needs to be connected to a distribution block.",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc81.htm"
}

const non_stationary_input_connector = {
  "type": BlockNames.NonStationaryInputConnector.Type,
  "message0": "NST CATEGORY %1 %2",
  "message1": "INCREMENT %1 %2",
  "args0": [
    {
      "type": "field_dropdown",
      "name": BlockNames.NonStationaryInputConnector.Category,
      "options": [
        [
          "first",
          BlockNames.NonStationaryInputConnector.CategoryFirst
        ],
        [
          "second",
          BlockNames.NonStationaryInputConnector.CategorySecond
        ]
      ]
    },
    {
      "type": "input_value",
      "name": BlockNames.NonStationaryInputConnector.Distribution,
      "check": "distribution"
    }
  ],
  "args1": [
    {
      "type": "field_number",
      "name": BlockNames.NonStationaryInputConnector.Increment,
      "value": 0,
      "min": 0
    },
    {
      "type": "input_dummy",
      "name": BlockNames.NonStationaryInputConnector.CategoryInput
    }
  ],
  "mutator": "non_stationary_mutator",
  "inputsInline": false,
  "output": "set_input",
  "colour": 140,
  "tooltip": "This is a non stationary input. Needs to be connected to a distribution block. INCREMENT: Represents the value by which the distribution should be incremented. This parameter should be defined in case of both categories. REALIZATION NUMBER: Represents the realization number after which the distribution parameters should be modified. This parameter should be defined in case of the first category",
  "helpUrl": "https://engineering.purdue.edu/CEM/people/Personal/Halpin/Sim/MicroCYCLONE/mc82.htm"
}

// Define type of nonstationary input type
type NonStationaryBlock = Blockly.Block & NonStationaryMixin;
interface NonStationaryMixin extends NonStationaryMixinType { };
type NonStationaryMixinType = typeof NON_STATIONARY_MUTATOR_MIXIN;

const NON_STATIONARY_MUTATOR_MIXIN = {

  mutationToDom: function (this: NonStationaryBlock): Element {
    const container = Blockly.utils.xml.createElement('mutation');
    const categoryInput = this.getFieldValue('CATEGORY');
    container.setAttribute('current_category', String(categoryInput));
    return container;
  },

  domToMutation: function (this: NonStationaryBlock, xmlElement: Element) {
    const categoryInput = xmlElement.getAttribute('current_category');
    this.updateShape_(String(categoryInput));
  },

  updateShape_: function (this: NonStationaryBlock, categoryInput: string) {
    var category_input = this.getInput(BlockNames.NonStationaryInputConnector.CategoryInput);
    if (!category_input) {
      category_input = this.appendValueInput(BlockNames.NonStationaryInputConnector.CategoryInput);
    }

    // remove existing fields
    category_input.removeField(BlockNames.NonStationaryInputConnector.RealizationNumber, true);
    category_input.removeField(BlockNames.NonStationaryInputConnector.Seed, true);
    category_input.removeField(BlockNames.NonStationaryInputConnector.RealizationNumberText, true);
    category_input.removeField(BlockNames.NonStationaryInputConnector.SeedText, true);

    if (categoryInput === BlockNames.NonStationaryInputConnector.CategorySecond) {
      category_input.appendField('REALIZATION NUMBER', BlockNames.NonStationaryInputConnector.RealizationNumberText);
      category_input.appendField(new Blockly.FieldNumber(0, 0), BlockNames.NonStationaryInputConnector.RealizationNumber);
      category_input.appendField('SEED', BlockNames.NonStationaryInputConnector.SeedText);
      category_input.appendField(new Blockly.FieldNumber(0, 0, 999999999, 1), BlockNames.NonStationaryInputConnector.Seed);
    }
  }
}

const NON_STATIONARY_EXTENSION = function (this: NonStationaryBlock) {
  this.getField('CATEGORY')!.setValidator(function (this: Blockly.FieldDropdown, option: string) {
    (this.getSourceBlock() as NonStationaryBlock).updateShape_(option);
  });
}

Blockly.Extensions.registerMutator('non_stationary_mutator', NON_STATIONARY_MUTATOR_MIXIN, NON_STATIONARY_EXTENSION);

const distribution = {
  "type": BlockNames.Distribution.Type,
  "message0": "DIST %1 %2 PARAMETERS",
  "args0": [
    {
      "type": "field_dropdown",
      "name": BlockNames.Distribution.Distribution,
      "options": [
        ["deterministic", BlockNames.Distribution.Deterministic.Type],
        ["exponential", BlockNames.Distribution.Exponential.Type],
        ["uniform", BlockNames.Distribution.Uniform.Type],
        ["normal", BlockNames.Distribution.Normal.Type],
        ["triangular", BlockNames.Distribution.Triangular.Type],
        ["lognormal", BlockNames.Distribution.Lognormal.Type],
        ["beta", BlockNames.Distribution.Beta.Type]
      ]
    },
    {
      'type': 'input_dummy',
    },
  ],
  "output": "distribution",
  "mutator": "distribution_mutator",
  "colour": 270,
  "tooltip": "Select a distribution.",
  "helpUrl": ""
}

// Define type of distribution block
type DistributionBlock = Blockly.Block & DistributionMixin;
interface DistributionMixin extends DistributionMixinType { }
type DistributionMixinType = typeof DISTRIBUTION_FIELD_MUTATOR_MIXIN;

// Create mutators that addes different input fields based on the distribution
const DISTRIBUTION_FIELD_MUTATOR_MIXIN = {

  mutationToDom: function (this: DistributionBlock): Element {
    const container = Blockly.utils.xml.createElement('mutation');
    const distributionInput = this.getFieldValue(BlockNames.Distribution.Distribution);
    container.setAttribute('current_distribution', String(distributionInput));
    return container;
  },

  domToMutation: function (this: DistributionBlock, xmlElement: Element) {
    const distribution_Input = xmlElement.getAttribute('current_distribution');
    this.updateShape_(String(distribution_Input));
  },

  updateShape_: function (this: DistributionBlock, distribution_Input: string) {
    this.removeInput(BlockNames.Distribution.ParametersInput, true);
    var parameters_input = this.appendDummyInput(BlockNames.Distribution.ParametersInput);
    switch (distribution_Input) {
      case BlockNames.Distribution.Deterministic.Type:
        parameters_input.appendField(BlockNames.Distribution.Deterministic.ConstantField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Deterministic.Constant);
        break;
      case BlockNames.Distribution.Exponential.Type:
        parameters_input.appendField(BlockNames.Distribution.Exponential.MeanField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Exponential.Mean);
        break;
      case BlockNames.Distribution.Uniform.Type:
        parameters_input.appendField(BlockNames.Distribution.Uniform.LowField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Uniform.Low);
        parameters_input.appendField(BlockNames.Distribution.Uniform.HighField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Uniform.High);
        break;
      case BlockNames.Distribution.Normal.Type:
        parameters_input.appendField(BlockNames.Distribution.Normal.MeanField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Normal.Mean);
        parameters_input.appendField(BlockNames.Distribution.Normal.VarianceField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Normal.Variance);
        break;
      case BlockNames.Distribution.Triangular.Type:
        parameters_input.appendField(BlockNames.Distribution.Triangular.LowField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Triangular.Low);
        parameters_input.appendField(BlockNames.Distribution.Triangular.HighField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Triangular.High);
        parameters_input.appendField(BlockNames.Distribution.Triangular.ModeField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Triangular.Mode);
        break;
      case BlockNames.Distribution.Lognormal.Type:
        parameters_input.appendField(BlockNames.Distribution.Lognormal.LowField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Lognormal.Low);
        parameters_input.appendField(BlockNames.Distribution.Lognormal.ScaleField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Lognormal.Scale);
        parameters_input.appendField(BlockNames.Distribution.Lognormal.ShapeField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Lognormal.Shape);
        break;
      case BlockNames.Distribution.Beta.Type:
        parameters_input.appendField(BlockNames.Distribution.Beta.LowField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Beta.Low);
        parameters_input.appendField(BlockNames.Distribution.Beta.HighField);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Beta.High);
        parameters_input.appendField(BlockNames.Distribution.Beta.Shape1Field);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Beta.Shape1);
        parameters_input.appendField(BlockNames.Distribution.Beta.Shape2Field);
        parameters_input.appendField(new Blockly.FieldNumber(0), BlockNames.Distribution.Beta.Shape2);
        break;
    }
  }
}

const DISTRIBUTION_FIELD_EXTENSION = function (this: DistributionBlock) {
  this.getField(BlockNames.Distribution.Distribution)!.setValidator(function (this: Blockly.FieldDropdown, option: string) {
    (this.getSourceBlock() as DistributionBlock).updateShape_(option);
  });
}

Blockly.Extensions.registerMutator('distribution_mutator', DISTRIBUTION_FIELD_MUTATOR_MIXIN, DISTRIBUTION_FIELD_EXTENSION);

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(
  [
    mainBlock,
    combiInput,
    normalTask,
    queue,
    function_consolidate,
    function_counter,
    resource_input,
    variable_cost,
    fixed_cost,
    ref_queue,
    ref_combi,
    ref_normal,
    ref_function,
    description_multiline,
    stationary_input_connector,
    non_stationary_input_connector,
    distribution,
  ]
);

/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order } from 'blockly/javascript';
import * as Blockly from 'blockly/core';
import BlockNames from '../blocks/names';

export const cycloneGenerator = new Blockly.CodeGenerator('cyclone');
export const forBlock = Object.create(null);

// Append the next block's code connected to this block
const appendNextBlockIfAny = (block: Blockly.Block, generator: Blockly.CodeGenerator, code: string) => {
  var next_block = block.getNextBlock();
  if (next_block) {
    var code_next = generator.blockToCode(next_block);
    code = code + '\n,\n' + code_next;
  }
  return code;
}

// Override the default statementToCode method to wrap the code in JSON list
cycloneGenerator['statementToCode'] = function (
  block: Blockly.Block,
  name: string
) {
  return '[' + Blockly.CodeGenerator.prototype['statementToCode'].call(this, block, name) + ']';
};


forBlock[BlockNames.MainBlock.Type] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var text_process_name = block.getFieldValue(BlockNames.MainBlock.ProcessName);
  var number_length_of_run = block.getFieldValue(BlockNames.MainBlock.LengthOfRun);
  var number_no_of_cycles = block.getFieldValue(BlockNames.MainBlock.NoOfCycles);
  var statements_network_input = generator.statementToCode(block, BlockNames.MainBlock.NetworkInput);
  var code = JSON.stringify({
    "type": "MAIN",
    "processName": text_process_name,
    "lengthOfRun": number_length_of_run,
    "noOfCycles": number_no_of_cycles,
    "networkInput": JSON.parse(statements_network_input)
  }, null, 2)

  return code;
};


forBlock[BlockNames.CombiInputStatement.Type] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var label = block.getFieldValue(BlockNames.CombiInputStatement.Label);
  var value_set_number = generator.valueToCode(block, BlockNames.CombiInputStatement.SetNumber, Order.ATOMIC);
  var value_description = generator.valueToCode(block, BlockNames.CombiInputStatement.Description, Order.ATOMIC);
  var statements_followers = generator.statementToCode(block, BlockNames.CombiInputStatement.Followers);
  var statements_precedeers = generator.statementToCode(block, BlockNames.CombiInputStatement.Preceders);

  // TODO: Assemble javascript into code variable.
  var code = JSON.stringify({
    "type": "COMBI",
    "label": label,
    "set": JSON.parse(value_set_number),
    "description": value_description,
    "followers": JSON.parse(statements_followers),
    "preceders": JSON.parse(statements_precedeers)
  }, null, 2)

  code = appendNextBlockIfAny(block, generator, code);
  return code;
};

forBlock[BlockNames.NormalTaskInput.Type] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var label_n = block.getFieldValue(BlockNames.NormalTaskInput.Label);
  var value_set_number = generator.valueToCode(block, BlockNames.NormalTaskInput.SetNumber, Order.ATOMIC);
  var description = generator.valueToCode(block, BlockNames.NormalTaskInput.Description, Order.ATOMIC);
  var statements_followers = generator.statementToCode(block, BlockNames.NormalTaskInput.Followers);

  var code = JSON.stringify({
    "type": "NORMAL",
    "label": label_n,
    "set": JSON.parse(value_set_number),
    "description": description,
    "followers": JSON.parse(statements_followers)
  }, null, 2);

  code = appendNextBlockIfAny(block, generator, code);
  return code;
};

forBlock[BlockNames.QueueInputStatement.Type] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var label_q = block.getFieldValue(BlockNames.QueueInputStatement.Label);
  var text_description = generator.valueToCode(block, BlockNames.QueueInputStatement.Description, Order.ATOMIC);
  var number_number_to_be_generated = block.getFieldValue(BlockNames.QueueInputStatement.NumberToBeGenerated);
  var value_resource_input = generator.valueToCode(block, BlockNames.QueueInputStatement.ResourceInput, Order.ATOMIC);

  var codeJson: any = {
    "type": "QUEUE",
    "label": label_q,
    "description": text_description,
    "numberToBeGenerated": number_number_to_be_generated,
  }

  if (value_resource_input) {
    codeJson["resourceInput"] = JSON.parse(value_resource_input)
  }

  var code = JSON.stringify(codeJson, null, 2);

  code = appendNextBlockIfAny(block, generator, code);
  return code;
}

forBlock[BlockNames.FunctionConsolidateInput.Type] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var label_fn = block.getFieldValue(BlockNames.FunctionConsolidateInput.Label);
  var number_number_to_consolidate = block.getFieldValue(BlockNames.FunctionConsolidateInput.NumberToConsolidate);
  var followers = generator.statementToCode(block, BlockNames.FunctionConsolidateInput.Followers);
  var description = generator.valueToCode(block, BlockNames.FunctionConsolidateInput.Description, Order.ATOMIC);

  var code = JSON.stringify({
    "type": "FUNCTION_CONSOLIDATE",
    "label": label_fn,
    "numberToConsolidate": number_number_to_consolidate,
    "followers": JSON.parse(followers),
    "description": description
  }, null, 2);

  code = appendNextBlockIfAny(block, generator, code);
  return code;
}

forBlock[BlockNames.FunctionCounterInput.Type] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var number_label_fn = block.getFieldValue(BlockNames.FunctionCounterInput.Label);
  var number_quantity = block.getFieldValue(BlockNames.FunctionCounterInput.Quantity);
  var statements_followers = generator.statementToCode(block, BlockNames.FunctionCounterInput.Followers);
  var description = generator.valueToCode(block, BlockNames.FunctionCounterInput.Description, Order.ATOMIC);

  var code = JSON.stringify({
    "type": "FUNCTION_COUNTER",
    "label": number_label_fn,
    "quantity": number_quantity,
    "followers": JSON.parse(statements_followers),
    "description": description
  }, null, 2);

  code = appendNextBlockIfAny(block, generator, code);
  return code;
}

forBlock[BlockNames.RefStatements.Type.Queue] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var dropdown_option = block.getFieldValue(BlockNames.RefStatements.DropdownLabel);
  var code = JSON.stringify(
    {
      "type": "REF_QUEUE",
      "value": Number(dropdown_option)
    }, null, 2
  )

  code = appendNextBlockIfAny(block, generator, code);
  return code;
}

forBlock[BlockNames.RefStatements.Type.Combi] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var dropdown_option = block.getFieldValue(BlockNames.RefStatements.DropdownLabel);
  var code = JSON.stringify(
    {
      "type": "REF_COMBI",
      "value": Number(dropdown_option)
    }, null, 2
  )

  code = appendNextBlockIfAny(block, generator, code);
  return code;
}

forBlock[BlockNames.RefStatements.Type.Normal] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var dropdown_option = block.getFieldValue(BlockNames.RefStatements.DropdownLabel);
  var code = JSON.stringify(
    {
      "type": "REF_NORMAL",
      "value": Number(dropdown_option)
    }, null, 2
  )

  code = appendNextBlockIfAny(block, generator, code);
  return code;
}

forBlock[BlockNames.RefStatements.Type.Function] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var dropdown_option = block.getFieldValue(BlockNames.RefStatements.DropdownLabel);
  var code = JSON.stringify(
    {
      "type": "REF_FUNCTION",
      "value": Number(dropdown_option)
    }, null, 2
  )

  code = appendNextBlockIfAny(block, generator, code);
  return code;
}

forBlock[BlockNames.ResourceInputStatement.Type] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var number_no_of_unit = block.getFieldValue(BlockNames.ResourceInputStatement.NoOfUnit);
  var text_description = generator.valueToCode(block, BlockNames.ResourceInputStatement.Description, Order.ATOMIC);
  var statements_cost = generator.statementToCode(block, BlockNames.ResourceInputStatement.Cost);

  // aggregate all variable and fixed cost
  var cost_list = JSON.parse(statements_cost)
  var cost_type_value = new Map<string, number>();

  // Update the cost type value
  for (var i = 0; i < cost_list.length; i++) {
    var cost: any = cost_list[i];
    var cost_type: string = cost.type;
    var cost_value: number = cost.value;
    cost_type_value.set(cost_type, (cost_type_value.get(cost_type) || 0) + cost_value);
  }

  // convert to JSON array
  var aggregated_cost = new Array<any>();
  for (const [key, value] of cost_type_value.entries()) {
    aggregated_cost.push({
      "type": key,
      "value": value
    })
  }

  var codeJson: any = {
    "type": "RESOURCE",
    "noOfUnit": number_no_of_unit,
    "description": text_description,
  };

  if (aggregated_cost.length > 0) {
    codeJson["cost"] = aggregated_cost;
  }

  return [JSON.stringify(codeJson, number_no_of_unit, 2), Order.ATOMIC];
};

forBlock[BlockNames.VariableCostStatement.Type] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var number_variable_cost = block.getFieldValue(BlockNames.VariableCostStatement.VariableCost);
  var code = JSON.stringify({
    "type": "VC",
    "value": Number(number_variable_cost)
  }, null, 2);

  code = appendNextBlockIfAny(block, generator, code);
  return code;
}

forBlock[BlockNames.FixedCostStatement.Type] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var number_fixed_cost = block.getFieldValue(BlockNames.FixedCostStatement.FixedCost);
  var code = JSON.stringify({
    "type": "FC",
    "value": Number(number_fixed_cost)
  }, null, 2);

  code = appendNextBlockIfAny(block, generator, code);
  return code;
}

forBlock[BlockNames.StationaryInputConnector.Type] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var value_distribution = JSON.parse(generator.valueToCode(block, BlockNames.StationaryInputConnector.Distribution, Order.ATOMIC));
  var code = JSON.stringify(
    {
      "type": "STATIONARY",
      "distribution": value_distribution
    },
    null, 2
  )
  return [code, Order.ATOMIC];
}

forBlock[BlockNames.NonStationaryInputConnector.Type] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  var value_distribution = JSON.parse(generator.valueToCode(block, BlockNames.NonStationaryInputConnector.Distribution, Order.ATOMIC));
  var category = block.getFieldValue(BlockNames.NonStationaryInputConnector.Category);
  var number_par1 = block.getFieldValue(BlockNames.NonStationaryInputConnector.Increment);

  var codeJson: any = {
    "type": "NST",
    "distribution": value_distribution,
    "category": category,
    "par1": number_par1
  }

  if (category === BlockNames.NonStationaryInputConnector.CategorySecond) {
    var number_par2 = block.getFieldValue(BlockNames.NonStationaryInputConnector.RealizationNumber);
    var number_seed = block.getFieldValue(BlockNames.NonStationaryInputConnector.Seed);
    codeJson["par2"] = number_par2;
    codeJson["seed"] = number_seed;
  }

  var code = JSON.stringify(codeJson, null, 2);
  return [code, Order.ATOMIC];
};

// Description blocks returns raw string
forBlock[BlockNames.Description.Type] = function (
  block: Blockly.Block,
  _generator: Blockly.CodeGenerator
) {
  var text_description = block.getFieldValue(BlockNames.Description.Description);
  return [text_description, Order.ATOMIC];
}

forBlock[BlockNames.Distribution.Type] = function (
  block: Blockly.Block,
  _generator: Blockly.CodeGenerator
) {
  var distributionName = block.getFieldValue(BlockNames.Distribution.Distribution);
  var codeJson: any = {
    "type": distributionName
  }

  switch (distributionName) {
    case BlockNames.Distribution.Deterministic.Type:
      codeJson[BlockNames.Distribution.Deterministic.Constant] = block.getFieldValue(BlockNames.Distribution.Deterministic.Constant);
      break;
    case BlockNames.Distribution.Exponential.Type:
      codeJson[BlockNames.Distribution.Exponential.Mean] = block.getFieldValue(BlockNames.Distribution.Exponential.Mean);
      break;
    case BlockNames.Distribution.Uniform.Type:
      codeJson[BlockNames.Distribution.Uniform.Low] = block.getFieldValue(BlockNames.Distribution.Uniform.Low);
      codeJson[BlockNames.Distribution.Uniform.High] = block.getFieldValue(BlockNames.Distribution.Uniform.High);
      break;
    case BlockNames.Distribution.Normal.Type:
      codeJson[BlockNames.Distribution.Normal.Mean] = block.getFieldValue(BlockNames.Distribution.Normal.Mean);
      codeJson[BlockNames.Distribution.Normal.Variance] = block.getFieldValue(BlockNames.Distribution.Normal.Variance);
      break;
    case BlockNames.Distribution.Triangular.Type:
      codeJson[BlockNames.Distribution.Triangular.Low] = block.getFieldValue(BlockNames.Distribution.Triangular.Low);
      codeJson[BlockNames.Distribution.Triangular.High] = block.getFieldValue(BlockNames.Distribution.Triangular.High);
      codeJson[BlockNames.Distribution.Triangular.Mode] = block.getFieldValue(BlockNames.Distribution.Triangular.Mode);
      break;
    case BlockNames.Distribution.Lognormal.Type:
      codeJson[BlockNames.Distribution.Lognormal.Low] = block.getFieldValue(BlockNames.Distribution.Lognormal.Low);
      codeJson[BlockNames.Distribution.Lognormal.Scale] = block.getFieldValue(BlockNames.Distribution.Lognormal.Scale);
      codeJson[BlockNames.Distribution.Lognormal.Shape] = block.getFieldValue(BlockNames.Distribution.Lognormal.Shape);
      break;
    case BlockNames.Distribution.Beta.Type:
      codeJson[BlockNames.Distribution.Beta.Low] = block.getFieldValue(BlockNames.Distribution.Beta.Low);
      codeJson[BlockNames.Distribution.Beta.High] = block.getFieldValue(BlockNames.Distribution.Beta.High);
      codeJson[BlockNames.Distribution.Beta.Shape1] = block.getFieldValue(BlockNames.Distribution.Beta.Shape1);
      codeJson[BlockNames.Distribution.Beta.Shape2] = block.getFieldValue(BlockNames.Distribution.Beta.Shape2);
      break;
  }

  var code = JSON.stringify(codeJson, null, 2);
  return [code, Order.ATOMIC];
}
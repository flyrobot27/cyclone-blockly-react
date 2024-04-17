import { BlocklyWorkspace } from 'react-blockly';
import { forBlock, cycloneGenerator } from './blocklyEditor/generators/cyclone';
import { blocks } from './blocklyEditor/blocks/text';
import { toolbox } from './blocklyEditor/toolbox';
import Blockly from "blockly";
import { workspaceHandler } from './blocklyEditor/workspaceHandlers';
import './App.css'

function App() {
  Blockly.common.defineBlocks(blocks);
  Object.assign(cycloneGenerator.forBlock, forBlock);
  function setWorkspaceHandler(workspace: Blockly.WorkspaceSvg) {
    workspaceHandler(workspace);
  }

  return (
    <div>
      <BlocklyWorkspace
        toolboxConfiguration={toolbox}
        className="fill-height"
        workspaceConfiguration={{
          grid: {
            spacing: 20,
            length: 3,
            colour: "#ccc",
            snap: true
          }
        }}
        onInject={setWorkspaceHandler}
      />
    </div>
  )
}

export default App

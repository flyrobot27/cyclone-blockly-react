import { BlocklyWorkspace } from 'react-blockly';
import { forBlock, cycloneGenerator } from './generators/cyclone';
import { blocks } from './blocks/text';
import { toolbox } from './toolbox';
import Blockly from "blockly";
import { workspaceHandler } from './workspaceHandlers';
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

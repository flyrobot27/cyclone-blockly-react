import { BlocklyWorkspace } from 'react-blockly';
import { forBlock, cycloneGenerator } from './generators/cyclone';
import { blocks } from './blocks/text';
import { toolbox } from './toolbox';
import Blockly from "blockly";
import { workspaceHandler } from './workspaceHandlers';
import './App.css'

function App() {

  const initialXml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="main_block" x="25" y="20"><field name="PROCESS_NAME">process name</field><field name="length_of_run">1</field><field name="no_of_cycles">1</field></block></xml>';

  Blockly.common.defineBlocks(blocks);
  Object.assign(cycloneGenerator.forBlock, forBlock);
  function setWorkspaceHandler(workspace: Blockly.WorkspaceSvg) {
    workspaceHandler(workspace);
  }

  return (
    <div>
      <BlocklyWorkspace
        toolboxConfiguration={toolbox}
        initialXml={initialXml}
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

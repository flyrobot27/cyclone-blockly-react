import { BlocklyWorkspace } from 'react-blockly';
import { forBlock, cycloneGenerator } from './blocklyEditor/generators/cyclone';
import { blocks } from './blocklyEditor/blocks/text';
import { toolbox } from './blocklyEditor/toolbox';
import Blockly from "blockly";
import { workspaceHandler } from './blocklyEditor/workspaceHandlers';
import './App.css'
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { FileJson, save, saveFile, storageOverride } from './blocklyEditor/serialization';
import { styled } from '@mui/material/styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function TopTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  Blockly.common.defineBlocks(blocks);
  Object.assign(cycloneGenerator.forBlock, forBlock);

  const [generatedCodeList, setGeneratedCodeList] = useState(Array<string>());
  const [value, setValue] = useState(0);

  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);

  const [currentWarnings, setCurrentWarnings] = useState(new Map<string, string | null>());

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function setWorkspaceHandler(workspace: Blockly.WorkspaceSvg) {
    setWorkspace(workspace);
    workspaceHandler(workspace, "RunCode", setGeneratedCodeList, setCurrentWarnings);
  }

  function workspaceChange(workspace: Blockly.WorkspaceSvg) {
    setWorkspace(workspace);
  }

  function onSaveWorkspaceClicked() {
    if (!workspace){
      alert("No workspace to save");
      return;
    };
    saveFile(workspace, currentWarnings, "model.json");
  }

  function fileLoaded() {
    const inputElement = document.getElementById("ModelUpload") as HTMLInputElement;
    if (!inputElement.files) return;

    const file = inputElement.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (_e) {
        if (reader.result) {
          const fileJson: FileJson = JSON.parse(reader.result as string);
          storageOverride(fileJson.workspaceData, fileJson.warnings);
          window.location.reload();
        }
      };
    }
  }

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Blockly Editor" {...a11yProps(0)} />
          <Tab label="Result View" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TopTabPanel value={value} index={0}>
        <Button id="RunCode">Simulate Model</Button>
        <Button component="label" onClick={onSaveWorkspaceClicked}>Save Model as file</Button>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
        >Load Model from file
          <VisuallyHiddenInput type="file" accept="application/JSON" id="ModelUpload" onChange={fileLoaded} />
        </Button>
        <p />
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
          onWorkspaceChange={workspaceChange}
        />
      </TopTabPanel>
      <TopTabPanel value={value} index={1}>
      </TopTabPanel>
    </div>
  )
}

export default App

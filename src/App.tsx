import { BlocklyWorkspace } from 'react-blockly';
import { forBlock, cycloneGenerator } from './blocklyEditor/generators/cyclone';
import { blocks } from './blocklyEditor/blocks/text';
import { toolbox } from './blocklyEditor/toolbox';
import Blockly from "blockly";
import { workspaceHandler } from './blocklyEditor/workspaceHandlers';
import './App.css'
import { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { FileJson, saveFile, storageOverride } from './blocklyEditor/serialization';
import { styled } from '@mui/material/styles';
import ResultView from './resultView/resultView';
import { postToSimphony } from './postToSimphony';
import { ResultViewProps } from './resultView/resultView';

Blockly.common.defineBlocks(blocks);
Object.assign(cycloneGenerator.forBlock, forBlock);

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

  const [generatedCodeList, setGeneratedCodeList] = useState(Array<string>());
  const [value, setValue] = useState(0);

  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);
  const [currentWarnings, setCurrentWarnings] = useState(new Map<string, string | null>());
  const [runButtonDisabled, setRunButtonDisabled] = useState(false);
  const [runButtonTitle, setRunButtonTitle] = useState("Simulate Model");
  const [runButtonClicked, setRunButtonClicked] = useState(false);

  const [simphonyResultProps, setSimphonyResultProps] = useState<ResultViewProps | null>(null);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function setWorkspaceHandler(workspace: Blockly.WorkspaceSvg) {
    setWorkspace(workspace);
    workspaceHandler(workspace, "RunCode", setGeneratedCodeList, setCurrentWarnings, setRunButtonDisabled, setRunButtonTitle, setRunButtonClicked);
  }

  function workspaceChange(workspace: Blockly.WorkspaceSvg) {
    setWorkspace(workspace);
  }

  function onSaveWorkspaceClicked() {
    if (!workspace) {
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

  // Detect if run button is clicked
  useEffect(() => {
    if (runButtonClicked === false) return;
    // Clear previous result
    setSimphonyResultProps(null);
    // Change page
    setValue(1);
    setRunButtonClicked(false);

    // Post to simphony
    if (generatedCodeList.length === 0) return;
    let code = generatedCodeList[0];
    let data = JSON.parse(code);
    postToSimphony(data, setSimphonyResultProps);
  }, [runButtonClicked]);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Blockly Editor" {...a11yProps(0)} />
          <Tab label="Result View" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TopTabPanel value={value} index={0}>
        <Button id="RunCode" className="bg-blue-500 text-white mb-6 mr-4" disabled={runButtonDisabled} title={runButtonTitle}>Simulate Model</Button>
        <Button component="label" className="bg-green-600 text-white mb-6 mr-4" onClick={onSaveWorkspaceClicked}>Save Model as file</Button>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          className='bg-red-600 text-white mb-6 mr-4'
        >Load Model from file
          <VisuallyHiddenInput type="file" accept="application/JSON" id="ModelUpload" onChange={fileLoaded} />
        </Button>
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
        <ResultView data={simphonyResultProps?.data}></ResultView>
      </TopTabPanel>
    </>
  )
}

export default App

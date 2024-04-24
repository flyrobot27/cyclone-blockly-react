import { BlocklyWorkspace } from 'react-blockly';
import { forBlock, cycloneGenerator } from './blocklyEditor/generators/cyclone';
import { blocks } from './blocklyEditor/blocks/text';
import { toolbox } from './blocklyEditor/toolbox';
import Blockly from "blockly";
import { workspaceHandler, generateCode } from './blocklyEditor/workspaceHandlers';
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
import { CycloneView } from './cycloneView/cycloneView';
import * as React from 'react';

Blockly.common.defineBlocks(blocks);
Object.assign(cycloneGenerator.forBlock, forBlock);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

class TabIds {
  static Editor = 0;
  static Result = 1;
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

function checkIfWarningEmpty(warnings: Map<string, string | null>) {
  let hasWarnings = false;
  warnings.forEach((value) => {
    if (value) {
      hasWarnings = true;
    }
  });

  return hasWarnings;
}

function App() {

  const [generatedCodeList, setGeneratedCodeList] = useState(Array<string>());
  const [value, setValue] = useState(0);

  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);
  const [currentWarnings, setCurrentWarnings] = useState(new Map<string, string | null>());

  const [runButtonDisabled, setRunButtonDisabled] = useState(false);

  const [runButtonTitle, setRunButtonTitle] = useState("Simulate Model");
  const [runButtonClicked, setRunButtonClicked] = useState(false);
  const [sentToSimphony, setSentToSimphony] = useState(false);
  const [simphonyResultProps, setSimphonyResultProps] = useState<ResultViewProps | null>(null);

  const [showCycloneView, setShowCycloneView] = useState(false);

  const toggleCycloneView = (open: boolean) => () => {
    let hasWarnings = checkIfWarningEmpty(currentWarnings);

    if (workspace && !hasWarnings) {
      setGeneratedCodeList(generateCode(workspace));
    }
    else {
      setGeneratedCodeList([]);
    }
    setShowCycloneView(open);
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function onWorkspaceInject(workspace: Blockly.WorkspaceSvg) {
    setWorkspace(workspace);
    workspaceHandler(workspace, "RunCode", setGeneratedCodeList, setCurrentWarnings, setRunButtonDisabled, setRunButtonTitle, setRunButtonClicked);
  }

  function workspaceChange(workspace: Blockly.WorkspaceSvg) {
    setWorkspace(workspace);

    // check if workspace have no blocks
    if (workspace.getAllBlocks().length === 0) {
      setRunButtonDisabled(true);
      setRunButtonTitle("No blocks to simulate");
    }
  }

  // Save workspace to file
  function onSaveWorkspaceClicked() {
    if (!workspace) {
      alert("No workspace to save");
      return;
    };
    saveFile(workspace, currentWarnings, "model.json");
  }

  // read file
  function fileLoaded() {
    const inputElement = document.getElementById("ModelUpload") as HTMLInputElement;
    if (!inputElement.files) return;

    const file = inputElement.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (_e) {
        if (reader.result) {
          // store to storage key. Reload page to apply changes
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
    // Change page to result
    setValue(TabIds.Result);
    setRunButtonClicked(false);

    // Post to simphony
    if (generatedCodeList.length === 0) return;
    let code = generatedCodeList[0];
    let data = JSON.parse(code);
    postToSimphony(data, setSimphonyResultProps);
    setSentToSimphony(true);
  }, [runButtonClicked]);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Blockly Editor" {...a11yProps(TabIds.Editor)} />
          <Tab label="Result View" {...a11yProps(TabIds.Result)} />
        </Tabs>
      </Box>
      <TopTabPanel value={value} index={TabIds.Editor}>
        <Button id="RunCode"
          variant="contained"
          className={
            runButtonDisabled ? "bg-gray-500 text-white mb-6 mr-4" : "bg-blue-500 text-white mb-6 mr-4"
          } disabled={runButtonDisabled} title={runButtonTitle}>Simulate Model</Button>
        <Button component="label"
          variant="contained"
          className="bg-green-600 text-white mb-6 mr-4" onClick={onSaveWorkspaceClicked}>Save Model as file</Button>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          className='bg-red-600 text-white mb-6 mr-4'
        >Load Model from file
          <VisuallyHiddenInput type="file" accept="application/JSON" id="ModelUpload" onChange={fileLoaded} />
        </Button>
        <Button onClick={toggleCycloneView(true)}
          variant="contained"
          className='bg-orange-500 text-white mb-6 mr-4'>
          Open Cyclone Diagram View
        </Button>
        <BlocklyWorkspace
          toolboxConfiguration={toolbox}
          className="h-[80vh]"
          workspaceConfiguration={{
            grid: {
              spacing: 20,
              length: 3,
              colour: "#ccc",
              snap: true
            },
            zoom:
            {
              controls: true,
              wheel: true,
              startScale: 1.0,
              maxScale: 3,
              minScale: 0.3,
              scaleSpeed: 1.1,
              pinch: true,
            }
          }}
          onInject={onWorkspaceInject}
          onWorkspaceChange={workspaceChange}
        />
      </TopTabPanel>
      <React.Fragment>
        <CycloneView codeList={generatedCodeList} showCycloneView={showCycloneView} toggleCycloneView={toggleCycloneView} />
      </React.Fragment>
      <TopTabPanel value={value} index={TabIds.Result}>
        {sentToSimphony && (
          <ResultView data={simphonyResultProps?.data}></ResultView>
        )}
      </TopTabPanel>
    </>
  )
}

export default App

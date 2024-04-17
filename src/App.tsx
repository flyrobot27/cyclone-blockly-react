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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
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

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function setWorkspaceHandler(workspace: Blockly.WorkspaceSvg) {
    workspaceHandler(workspace, "RunCode", setGeneratedCodeList);
  }

  console.log(generatedCodeList);
  
  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Blockly Editor" {...a11yProps(0)} />
          <Tab label="Result View" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Button id="RunCode">Simulate Model</Button>
        <p/>
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
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
      </CustomTabPanel>
    </div>
  )
}

export default App

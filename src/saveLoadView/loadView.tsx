import { Drawer, Box, List, ListItem, Button, Stack, ListItemText, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getModelList, loadModel, deleteModel } from "../http/dbCRUD";
import { Item } from "../resultView/resultView";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export function ConfirmDialog(props: {
  isOpen: boolean,
  alertTitle: string,
  alertBody: string
  handleClose: () => void,
  onConfirm: () => void,
  onDeny: () => void
}) {

  const handleDenyClose = () => {
    props.onDeny();
    props.handleClose();
  }

  const handleConfirmClose = () => {
    props.onConfirm();
    props.handleClose();
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {props.alertTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.alertBody}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDenyClose}>NO</Button>
        <Button onClick={handleConfirmClose} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}


export function LoadView(props: { showLoadView: boolean, toggleLoadView: (open: boolean) => () => void }) {

  const [modelList, setModelList] = useState(new Set<string>());
  const [isLoading, setIsLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertBody, setAlertBody] = useState("");

  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    // Load model from axios
    getModelList(setModelList);
  }, [props.showLoadView]);

  return (
    <React.Fragment>
      <Drawer open={props.showLoadView} onClose={props.toggleLoadView(false)} anchor="right">
        {
          isLoading ?
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
              <Stack direction="column">
                <Item><h2>Waiting for Results</h2></Item>
                <Item><CircularProgress /></Item>
              </Stack>
            </div>
            :
            <Box sx={{ width: "25vw", overflow: "hidden", height: "100vh", display: "flex", justifyContent: "center" }}>
              {
                modelList.size === 0 ?
                  <h3>(No models saved)</h3>
                  :
                  <List sx={{ width: '100%', maxWidth: 480, bgcolor: 'background.paper', margin: 2 }}>
                    {
                      Array.from(modelList)?.map((value) => {
                        return (
                          <ListItem
                            key={value}
                            sx={{ border: '1px solid blue', marginBottom: 2, borderRadius: '12px', color: 'blue', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }}
                            secondaryAction={
                              <Stack spacing={1} direction="row">
                                <Button sx={{ color: 'green', border: '1px solid green', backgroundColor: 'white', "&:hover": { backgroundColor: 'white' } }}
                                  component="label"
                                  variant="contained"
                                  onClick={() => {
                                    loadModel(value, setIsLoading);
                                  }}>load</Button>

                                <Button sx={{ color: 'red', border: '1px solid red', backgroundColor: 'white', "&:hover": { backgroundColor: 'white' } }}
                                  component="label"
                                  variant="contained"
                                  onClick={() => {
                                    setAlertOpen(true);
                                    setAlertTitle("Delete Model");
                                    setAlertBody(`Are you sure you want to delete "${value}"?`);
                                    setSelectedModel(value);
                                  }}>delete</Button>
                              </Stack>
                            }>
                            <ListItemText
                              primary={value}
                              primaryTypographyProps={{ style: { whiteSpace: "normal" } }} />
                          </ListItem>
                        )
                      })
                    }
                  </List>
              }
            </Box>
        }
      </Drawer>
      <ConfirmDialog
        isOpen={alertOpen}
        alertTitle={alertTitle}
        alertBody={alertBody}
        handleClose={() => setAlertOpen(false)}
        onConfirm={() => {
          console.log("here", selectedModel);
          // Delete model
          if (!selectedModel) return;
          deleteModel(selectedModel, setModelList);
        }}
        onDeny={() => {
          // Do nothing
        }}
        />
    </React.Fragment>
  );
}
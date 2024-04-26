import { Drawer, Box, List, ListItem, Button, Stack, ListItemText, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { getModelList, loadModel } from "../http/dbCRUD";
import { Item } from "../resultView/resultView";


export function LoadView(props: { showLoadView: boolean, toggleLoadView: (open: boolean) => () => void }) {

  const [modelList, setModelList] = useState(new Set<string>());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load model from axios
    getModelList(setModelList);
  }, [props.showLoadView]);

  return (
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
                                  console.log("delete model");
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
  );
}
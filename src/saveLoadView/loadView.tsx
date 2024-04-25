import { Drawer, Box, List, ListItem, Button, Stack, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";


export function LoadView(props: { showLoadView: boolean, toggleLoadView: (open: boolean) => () => void }) {

  const [modelList, setModelList] = useState(new Set<string>());

  useEffect(() => {
    // Load model from axios
    
  }, [props.showLoadView]);

  return (
    <Drawer open={props.showLoadView} onClose={props.toggleLoadView(false)} anchor="right">
      <Box sx={{ width: "25vw", overflow: "hidden", height: "100vh", display: "flex", justifyContent: "center" }}>
        {
          modelList.size === 0 ?
            <h3>(No models saved)</h3>
            :
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', marginTop: 2 }}>
              {
                Array.from(modelList)?.map((value) => {
                  return (
                    <ListItem
                      key={value}
                      sx={{ border: '1px solid blue', marginBottom: 2, borderRadius: '12px', color: 'blue', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }}
                      secondaryAction={
                        <Stack spacing={1} direction="row">
                          <Button sx={{ color: 'green', border: '1px solid green', backgroundColor: 'white' }}
                            component="label"
                            variant="contained"
                            onClick={() => {
                              console.log("load model");
                            }}>load</Button>

                          <Button sx={{ color: 'red', border: '1px solid red', backgroundColor: 'white' }}
                            component="label"
                            variant="contained"
                            onClick={() => {
                              console.log("delete model");
                            }}>delete</Button>
                        </Stack>
                      }>
                      <ListItemText>
                        {value}
                      </ListItemText>
                    </ListItem>
                  )
                })
              }
            </List>
        }
      </Box>
    </Drawer>
  );
}
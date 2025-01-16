import { Box, Button, createTheme, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const callAPI = async () => {
  // const deviceIds = [1, 2, 3];
  // const statusDict = await getDevicesOnlineStatus(deviceIds);
  // console.log(statusDict.length);
  // console.log(statusDict);
  // for (var i = 0; i < deviceIds.length; i++) {
  //     console.log(statusDict[deviceIds[i]]);
  // }
};

const theme = createTheme({
  palette: {
    dummyColor: "#00FF00"
  }
});

export default function () {
  // const data = useLoaderData();

  useEffect(() => {}, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: theme.palette.dummyColor,
          padding: "24px"
        }}
      >
        <Button variant="contained" color="primary">
          Click me!
        </Button>
      </Box>
    </ThemeProvider>
  );
}

export function loader() {
  // const jwt =
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3YW5sb2siLCJleHAiOjE3MjAwODc1MTl9.tcEhS4lM5gEvu9nZAbXaKPzhW_dmzSkQXZNqwlay3fQ";
  // return API.get_gwin(jwt);
  return "";
}

import { Box, Button, Card, createTheme, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
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
  palette: {}
});

export default function () {
  // const data = useLoaderData();

  useEffect(() => {}, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 8, backgroundColor: "#EEEEEE" }}>
        <Card elevation={2} sx={{ p: 4 }}>
          Hello World
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export function loader() {
  return "";
}

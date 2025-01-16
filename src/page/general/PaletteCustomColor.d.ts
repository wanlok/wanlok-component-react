import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    dummyColor: string;
  }
  interface PaletteOptions {
    dummyColor?: string;
  }
}

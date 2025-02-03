"use client";
import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(38 38 38)"
    }
  },
  typography: {
    fontFamily: "var(--font-forma)",
    body1: {
      color: "#fff"
    }
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#fffff"
        }
      }
    }
  }
});

import { createTheme } from "@mui/material/styles";

/**
 * College-ERP design system (MUI theme)
 * -------------------------------------
 * Violet  -> primary actions / brand
 * Pink    -> secondary accents / highlights
 * Blue    -> informational
 * Green   -> success / active
 * Orange  -> warnings / pending
 * Red     -> errors / danger
 * Neutrals -> backgrounds, text, borders
 */
const theme = createTheme({
  palette: {
    primary: {
      main: "#7c3aed",
      light: "#a78bfa",
      dark: "#6d28d9",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ec4899",
      light: "#f9a8d4",
      dark: "#db2777",
      contrastText: "#ffffff",
    },
    info: { main: "#3b82f6", contrastText: "#ffffff" },
    success: { main: "#22c55e", contrastText: "#ffffff" },
    warning: { main: "#f59e0b", contrastText: "#ffffff" },
    error: { main: "#ef4444", contrastText: "#ffffff" },
    background: {
      default: "#faf8ff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    divider: "#e8e4f2",
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingLeft: 20,
          paddingRight: 20,
          transition:
            "transform 0.15s ease, box-shadow 0.2s ease, background-color 0.2s ease",
          "&:hover": {
            boxShadow: "0 10px 24px rgba(124, 58, 237, 0.25)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #efeafb",
          boxShadow: "0 4px 18px rgba(30, 41, 59, 0.06)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: "0 18px 44px rgba(30, 41, 59, 0.16)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
        },
      },
    },
  },
});

export default theme;

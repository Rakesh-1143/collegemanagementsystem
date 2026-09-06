import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5", // Indigo-600
      light: "#818cf8", // Indigo-400
      dark: "#3730a3", // Indigo-800
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#64748b", // Slate-500
      light: "#94a3b8", // Slate-400
      dark: "#334155", // Slate-700
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444", // Red-500
    },
    warning: {
      main: "#f59e0b", // Amber-500
    },
    info: {
      main: "#3b82f6", // Blue-500
    },
    success: {
      main: "#10b981", // Emerald-500
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b", // Slate-800
      secondary: "#64748b", // Slate-500
    },
    divider: "#e2e8f0",
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          transition: "background-color 0.15s ease, border-color 0.15s ease",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#4338ca", // Indigo-700
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: 8,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e2e8f0", // Slate-200
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cbd5e1", // Slate-300
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6366f1", // Indigo-500
            borderWidth: "1px",
            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#475569", // Slate-600
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 600,
          color: "#1e293b",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: "#475569", // Slate-600
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        },
        body: {
          color: "#334155",
          borderBottom: "1px solid #f1f5f9",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
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
  },
});

export default theme;

import {
  AppBar,
  Box,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

// Base layout for the application
// Provides the top navigation bar and content container

interface AppLayoutProps {
  activeTab: number;
  onTabChange: (newTab: number) => void;
  children: ReactNode;
}

function AppLayout({ activeTab, onTabChange, children }: AppLayoutProps) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top navigation bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Stock Portfolio
          </Typography>
          <Tabs
            value={activeTab}
            onChange={(_event, newValue) => onTabChange(newValue)}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Portfolio" />
            <Tab label="Charts" />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Main content area */}
      <Container maxWidth="lg" sx={{ py: 3, flexGrow: 1 }}>
        {children}
      </Container>
    </Box>
  );
}

export default AppLayout;

import { useState } from "react";
import AppLayout from "./components/common/AppLayout";
import PortfolioPage from "./pages/PortfolioPage";
import ChartsPage from "./pages/ChartsPage";

// Main application component
// Manages the active tab and renders the appropriate page

function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 0 ? <PortfolioPage /> : <ChartsPage />}
    </AppLayout>
  );
}

export default App;

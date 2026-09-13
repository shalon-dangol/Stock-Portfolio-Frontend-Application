import { lazy, Suspense, useState } from "react";
import AppLayout, { type TabId } from "./components/common/AppLayout";
import PortfolioPage from "./pages/PortfolioPage";

const ChartsPage = lazy(() => import("./pages/ChartsPage"));

// Main application component
// Manages the active tab and renders the appropriate page

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("portfolio");

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div id={activeTab === "portfolio" ? "portfolio-panel" : "charts-panel"} role="tabpanel" aria-labelledby={activeTab === "portfolio" ? "tab-portfolio" : "tab-charts"}>
        {activeTab === "portfolio" ? (
          <PortfolioPage />
        ) : (
          <Suspense fallback={<div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">Loading charts...</div>}>
            <ChartsPage />
          </Suspense>
        )}
      </div>
    </AppLayout>
  );
}

export default App;

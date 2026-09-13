import type { ReactNode } from "react";
import ThemeToggle from "./ThemeToggle";

export type TabId = "portfolio" | "charts";

interface AppLayoutProps {
  activeTab: TabId;
  onTabChange: (newTab: TabId) => void;
  children: ReactNode;
}

function AppLayout({ activeTab, onTabChange, children }: AppLayoutProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      onTabChange(activeTab === "portfolio" ? "charts" : "portfolio");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[64px] items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M3 17L9 11L13 15L21 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 7H21V13"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  Stock Portfolio
                </h1>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                  Wealth Manager
                </p>
              </div>
            </div>

            {/* Right: Tabs + Theme Toggle */}
            <div className="flex items-center gap-3">
              <nav className="flex items-center gap-1 rounded-full bg-slate-100 p-1 dark:bg-slate-800" role="tablist" aria-label="Portfolio sections" onKeyDown={handleKeyDown}>
                <button
                  role="tab"
                  aria-selected={activeTab === "portfolio"}
                  aria-controls="portfolio-panel"
                  id="tab-portfolio"
                  onClick={() => onTabChange("portfolio")}
                  className={`rounded-full px-5 py-[7px] text-sm font-semibold transition-all ${
                    activeTab === "portfolio"
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-slate-700 dark:text-white dark:ring-slate-600"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  Portfolio
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === "charts"}
                  aria-controls="charts-panel"
                  id="tab-charts"
                  onClick={() => onTabChange("charts")}
                  className={`rounded-full px-5 py-[7px] text-sm font-semibold transition-all ${
                    activeTab === "charts"
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-slate-700 dark:text-white dark:ring-slate-600"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  Charts
                </button>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        © 2026 Stock Portfolio · Built with precision
      </footer>
    </div>
  );
}

export default AppLayout;

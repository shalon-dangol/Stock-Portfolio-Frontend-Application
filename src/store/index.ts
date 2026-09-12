import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import portfolioReducer from "./portfolioSlice";

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
  },
});

// For tests: factory to create isolated store
export function createTestStore(preloadedStocks?: import("../types/stock").Stock[]) {
  return configureStore({
    reducer: { portfolio: portfolioReducer },
    ...(preloadedStocks ? { preloadedState: { portfolio: { stocks: preloadedStocks } } } : {}),
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

import { create } from "zustand";
import type { Action, RectangleData, RectState } from "../types";

interface RectangleStore {
  rectData: RectangleData;
  append: (item: RectState) => void;
  remove: (id: number) => void;
  update: (item: RectState) => void;
  undo: () => void;
  redo: () => void;
}

const applyAction = (rect: RectState[], action: Action): RectState[] => {
  switch (action.type) {
    case "append":
      return [...rect, action.item];
    case "remove":
      return rect.filter((r) => r.id !== action.item.id);
    case "update":
      return rect.map((r) => (r.id === action.item.id ? action.item : r));
    default:
      return rect;
  }
};

function reverseAction(action: Action, currentRect: RectState[]): Action {
  switch (action.type) {
    case "append":
      return { type: "remove", item: action.item };
    case "remove":
      return { type: "append", item: action.item };
    case "update": {
      const prev = currentRect.find((r) => r.id === action.item.id);
      return prev ? { type: "update", item: prev } : action;
    }
    default:
      return action; 
  }
}

const useRectangleStore = create<RectangleStore>((set) => ({
  rectData: {
    rect: [],
    history: {
      past: [],
      future: [],
    },
  },

  append: (item) => {
    set((state) => {
      const { rect, history } = state.rectData;
      const action: Action = { type: "append", item };
      return {
        rectData: {
          rect: applyAction(rect, action),
          history: {
            past: [...history.past, action],
            future: [], 
          },
        },
      };
    });
  },

  remove: (id) => {
    set((state) => {
      const { rect, history } = state.rectData;
      console.log(rect)
      const existing = rect.find((r) => r.id === id);
      console.log("hehe");
      if (!existing) return state;

      const action: Action = { type: "remove", item: existing };
      return {
        rectData: {
          rect: applyAction(rect, action),
          history: {
            past: [...history.past, action],
            future: [], 
          },
        },
      };
    });
  },

  update: (item) => {
    set((state) => {
      const { rect, history } = state.rectData;
      const prev = rect.find((r) => r.id === item.id);
      if (!prev) return state;

      const action: Action = { type: "update", item: prev };
      return {
        rectData: {
          rect: rect.map((value) => (value.id === item.id ? item : value)),
          history: {
            past: [...history.past, action],
            future: [], 
          },
        },
      };
    });
  },

  undo: () => {
    set((state) => {
      const { rect, history } = state.rectData;
      if (history.past.length === 0) return state;

      const past = [...history.past];
      const lastAction = past.pop()!;
      
      const reverseActionToApply = reverseAction(lastAction, rect);

      return {
        rectData: {
          rect: applyAction(rect, reverseActionToApply),
          history: {
            past,
            future: [lastAction, ...history.future],
          },
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      const { rect, history } = state.rectData;
      if (history.future.length === 0) return state;

      const future = [...history.future];
      const actionToRedo = future.shift()!;

      return {
        rectData: {
          rect: applyAction(rect, actionToRedo),
          history: {
            past: [...history.past, actionToRedo],
            future,
          },
        },
      };
    });
  },
}));

export default useRectangleStore;
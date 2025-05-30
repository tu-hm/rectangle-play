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
      const existing = rect.find((r) => r.id === id);
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

      const action: Action = { type: "update", item };
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

  undo: () => {
    set((state) => {
      const { rect, history } = state.rectData;
      const past = [...history.past];
      const action = past.pop();
      if (!action) return state;

      const reverse = reverseAction(action, rect);
      return {
        rectData: {
          rect: applyAction(rect, reverse),
          history: {
            past,
            future: [action, ...history.future],
          },
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      const { rect, history } = state.rectData;
      const future = [...history.future];
      const action = future.shift();
      if (!action) return state;

      return {
        rectData: {
          rect: applyAction(rect, action),
          history: {
            past: [...history.past, action],
            future,
          },
        },
      };
    });
  },
}));

export default useRectangleStore;

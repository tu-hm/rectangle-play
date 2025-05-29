import { create } from "zustand";
import type { Action, RectangleData, RectState } from "../types";

interface RectangleStore {
  rectData: RectangleData;
  append: (item: RectState) => void;
  remove: (item: RectState) => void;
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


function reverseAction(action: Action): Action {
  switch (action.type) {
    case "append":
      return { type: "remove", item: action.item };
    case "remove":
      return { type: "append", item: action.item };
    case "update":
      return { type: "update", item: action.item }; 
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
      return {
        rectData: {
          rect: [...rect, item],
          history: {
            past: [...history.past, { type: "remove", item }],
            future: [],
          },
        },
      };
    });
  },

  remove: (item) => {
    set((state) => {
      const { rect, history } = state.rectData;
      const existing = rect.find((r) => r.id === item.id);
      if (!existing) return state;

      return {
        rectData: {
          rect: rect.filter((r) => r.id !== item.id),
          history: {
            past: [...history.past, { type: "append", item: existing }],
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

      return {
        rectData: {
          rect: rect.map((r) => (r.id === item.id ? item : r)),
          history: {
            past: [...history.past, { type: "update", item: prev }],
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
      const future = [...history.future];
      const action = past.pop();

      if (!action) return state;

      return {
        rectData: {
          rect: applyAction(rect, action),
          history: {
            past,
            future: [reverseAction(action), ...future],
          },
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      const { rect, history } = state.rectData;
      const past = [...history.past];
      const future = [...history.future];
      const action = future.shift();

      if (!action) return state;

      return {
        rectData: {
          rect: applyAction(rect, action),
          history: {
            past: [...past, reverseAction(action)],
            future,
          },
        },
      };
    });
  },
}));

export default useRectangleStore;

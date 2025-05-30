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
      const itemToRemove = rect.find((r) => r.id === id);
      if (!itemToRemove) return state; 

      const action: Action = { type: "remove", item: itemToRemove };
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
      const prevItem = rect.find((r) => r.id === item.id);
      if (!prevItem) return state; 


      const forwardAction: Action = { type: "update", item: item };

      const actionForHistory: Action = { type: "update", item: prevItem };

      return {
        rectData: {
          rect: applyAction(rect, forwardAction), 
          history: {
            past: [...history.past, actionForHistory], 
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

      const newPast = [...history.past];
      const prevAction = newPast.pop()!;

      let action: Action;
      let futureAction: Action; 

      switch (prevAction.type) {
        case "update":
          action = prevAction;
          const item = rect.find(r => r.id === prevAction.item.id)!;
          futureAction = { type: "update", item: item };
          break;
        case "append":
          action = { type: "remove", item: prevAction.item };
          futureAction = prevAction;
          break;
        case "remove":
          action = { type: "append", item: prevAction.item };
          futureAction = prevAction;
          break;
        default:
          return state;
      }

      return {
        rectData: {
          rect: applyAction(rect, action),
          history: {
            past: newPast,
            future: [futureAction, ...history.future],
          },
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      const { rect, history } = state.rectData;
      if (history.future.length === 0) return state;

      const newFuture = [...history.future];
      const action = newFuture.shift()!;

      let prevAction: Action;

      switch (action.type) {
        case "update":
          const prevItem = rect.find(r => r.id === action.item.id)!;
          prevAction = { type: "update", item: prevItem };
          break;
        case "append":
        case "remove":
          prevAction = action;
          break;
        default:
          return state; 
      }
      
      return {
        rectData: {
          rect: applyAction(rect, action), 
          history: {
            past: [...history.past, prevAction],
            future: newFuture,
          },
        },
      };
    });
  },
}));

export default useRectangleStore;
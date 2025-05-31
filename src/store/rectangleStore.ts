import { create } from 'zustand';

import type { Action, RectangleData, RectState } from '../types';

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
    case 'append':
      return [...rect, action.item];
    case 'remove':
      return rect.filter((r) => r.id !== action.item.id);
    case 'update':
      return rect.map((r) =>
        r.id === action.payload.newItem.id ? action.payload.newItem : r,
      );
    default:
      return rect;
  }
};

const applyReverseAction = (rect: RectState[], action: Action): RectState[] => {
  switch (action.type) {
    case 'append':
      return rect.filter((r) => r.id !== action.item.id);
    case 'remove':
      return [...rect, action.item];
    case 'update':
      return rect.map((r) =>
        r.id === action.payload.prevItem.id ? action.payload.prevItem : r,
      );
  }
};

const useRectangleStore = create<RectangleStore>((set) => ({
  rectData: {
    rect: [],
    history: [],
    historyIndex: 0,
  },

  append: (item) => {
    set((state) => {
      const { rect, history, historyIndex } = state.rectData;
      const action: Action = { type: 'append', item };

      const newRects = applyAction(rect, action);
      const newHistory = history.slice(0, historyIndex);

      return {
        rectData: {
          rect: newRects,
          history: [...newHistory, action],
          historyIndex: newHistory.length + 1,
        },
      };
    });
  },

  remove: (id) => {
    set((state) => {
      const { rect, history, historyIndex } = state.rectData;
      const itemToRemove = rect.find((r) => r.id === id);
      if (!itemToRemove) return state;

      const action: Action = { type: 'remove', item: itemToRemove };

      const newRects = applyAction(rect, action);
      const newHistory = history.slice(0, historyIndex);

      return {
        rectData: {
          rect: newRects,
          history: [...newHistory, action],
          historyIndex: newHistory.length + 1,
        },
      };
    });
  },

  update: (item) => {
    set((state) => {
      const { rect, history, historyIndex } = state.rectData;
      const prevItem = rect.find((r) => r.id === item.id);
      if (!prevItem) return state;

      const action: Action = {
        type: 'update',
        payload: {
          prevItem,
          newItem: item,
        },
      };

      const newRects = applyAction(rect, action);
      const newHistory = history.slice(0, historyIndex);

      return {
        rectData: {
          rect: newRects,
          history: [...newHistory, action],
          historyIndex: newHistory.length + 1,
        },
      };
    });
  },

  undo: () => {
    set((state) => {
      const { rect, history, historyIndex } = state.rectData;

      const undoAction = history[historyIndex - 1];
      const newRectangles = applyReverseAction(rect, undoAction);

      return {
        rectData: {
          rect: newRectangles,
          history,
          historyIndex: historyIndex - 1,
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      const { rect, history, historyIndex } = state.rectData;

      const redoAction = history[historyIndex];
      const newRectangles = applyAction(rect, redoAction);

      return {
        rectData: {
          rect: newRectangles,
          history,
          historyIndex: historyIndex + 1,
        },
      };
    });
  },
}));

export default useRectangleStore;

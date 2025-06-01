import { create } from 'zustand';

import type { Action, RectangleData, RectState } from '../types';

interface RectangleStore {
  rectData: RectangleData;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  append: (item: RectState) => void;
  remove: (id: number) => void;
  update: (item: RectState) => void;
  undo: () => void;
  redo: () => void;
}

const applyAction = (
  rectMap: Map<number, RectState>,
  action: Action,
): Map<number, RectState> => {
  const newMap = new Map(rectMap);

  switch (action.type) {
    case 'append':
      newMap.set(action.item.id, action.item);
      return newMap;
    case 'remove':
      newMap.delete(action.item.id);
      return newMap;
    case 'update':
      newMap.set(action.payload.newItem.id, action.payload.newItem);
      return newMap;
    default:
      return newMap;
  }
};

const applyReverseAction = (
  rectMap: Map<number, RectState>,
  action: Action,
): Map<number, RectState> => {
  const newMap = new Map(rectMap);

  switch (action.type) {
    case 'append':
      newMap.delete(action.item.id);
      return newMap;
    case 'remove':
      newMap.set(action.item.id, action.item);
      return newMap;
    case 'update':
      newMap.set(action.payload.prevItem.id, action.payload.prevItem);
      return newMap;
  }
};

const useRectangleStore = create<RectangleStore>((set) => ({
  rectData: {
    rect: new Map<number, RectState>(),
    history: [],
    historyIndex: 0,
  },
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),

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
      const itemToRemove = rect.get(id);
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
      const prevItem = rect.get(item.id);
      if (!prevItem || JSON.stringify(prevItem) === JSON.stringify(item)) {
        return state;
      }

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
      const newRects = applyReverseAction(rect, undoAction);

      return {
        rectData: {
          rect: newRects,
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
      const newRects = applyAction(rect, redoAction);

      return {
        rectData: {
          rect: newRects,
          history,
          historyIndex: historyIndex + 1,
        },
      };
    });
  },
}));

export default useRectangleStore;

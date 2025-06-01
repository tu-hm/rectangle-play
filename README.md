# Rectangle Editor

A interactive React application that allows users to create, manipulate, and manage rectangles on a canvas with full undo/redo functionality.

![image](https://github.com/user-attachments/assets/9e9cc4a2-7c8f-4e6d-baf7-a53bcf1cafec)


## Features

### Core Functionality
- **Create Rectangles**: Generate new rectangles with random colors, positions, and sizes
- **Delete Rectangles**: Remove selected rectangles from the canvas
- **Drag & Drop**: Move rectangles around the canvas by dragging
- **Resize**: Resize rectangles using corner handles when selected
- **Selection**: Click to select/deselect rectangles with visual feedback
- **Undo/Redo**: Full history management with undo and redo capabilities

### Interactive Controls
- **Visual Selection**: Selected rectangles display a blue border and resize handles
- **Resize Handles**: Four corner handles (top-left, top-right, bottom-left, bottom-right) with appropriate cursors
- **Minimum Size Constraints**: Rectangles maintain minimum dimensions (50x50px)
- **Click Outside to Deselect**: Automatic deselection when clicking outside rectangles

## Technology Stack

- **React 18** with TypeScript
- **Zustand** for state management
- **CSS Modules** for styling
- **Vite** for build tooling
- **clsx** for conditional CSS classes

## Project Structure

```
src/
├── component/
│   ├── ButtonList/          # Control buttons (Create, Delete, Undo, Redo)
│   ├── Canvas/              # Main drawing area
│   ├── Playground/          # Main container component
│   └── Rectangle/           # Individual rectangle component
├── store/
│   └── rectangleStore.ts    # Zustand store for state management
├── types.ts                 # TypeScript type definitions
├── utils.ts                 # Utility functions
├── constant.ts              # Application constants
└── App.tsx                  # Root component
```

## Key Components

### Rectangle Component
- Handles mouse interactions for dragging and resizing
- Manages selection state and visual feedback
- Provides corner resize handles with proper cursor indicators
- Enforces minimum size constraints during resize operations

### ButtonList Component
- Provides Create, Delete, Undo, and Redo buttons
- Buttons are disabled when actions are not available
- Each button has distinct styling for easy identification

### Canvas Component
- Renders all rectangles in a relative positioned container
- Manages rectangle selection state
- Handles rectangle updates from drag/resize operations

### Rectangle Store (Zustand)
- Manages rectangle state with Map-based storage
- Implements command pattern for undo/redo functionality
- Maintains action history for state management
- Supports append, remove, and update operations

## State Management

The application uses a sophisticated state management system with:

- **Rectangle Map**: Efficient storage using `Map<number, RectState>`
- **Action History**: Array of actions for undo/redo functionality
- **History Index**: Tracks current position in history
- **Command Pattern**: Actions are reversible for proper undo/redo

### Action Types
- `append`: Add new rectangle
- `remove`: Delete existing rectangle  
- `update`: Modify rectangle properties (position, size)

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Creating Rectangles**: Click the "Create" button to add a new rectangle with random properties
2. **Selecting Rectangles**: Click on any rectangle to select it (blue border appears)
3. **Moving Rectangles**: Drag selected rectangles to new positions
4. **Resizing Rectangles**: Use the corner handles on selected rectangles to resize
5. **Deleting Rectangles**: Select a rectangle and click the "Delete" button
6. **Undo/Redo**: Use the respective buttons to navigate through action history

## Technical Highlights

### Performance Optimizations
- Efficient Map-based rectangle storage
- Minimal re-renders through proper state management
- Optimized event handling with proper cleanup

### User Experience
- Smooth animations and transitions
- Intuitive mouse interactions
- Visual feedback for all interactions
- Proper cursor indicators for different operations

### Code Quality
- TypeScript for type safety
- Modular component architecture
- CSS Modules for scoped styling
- Proper separation of concerns

## Browser Compatibility

Modern browsers supporting:
- ES6+ features
- CSS Grid/Flexbox
- Mouse events
- React 18

## Future Enhancements

Potential improvements could include:
- Multi-selection support
- Copy/paste functionality
- Keyboard shortcuts
- Export/import capabilities
- Grid snapping
- Color picker for rectangles
- Layer management (z-index controls)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

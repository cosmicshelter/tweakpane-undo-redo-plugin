# Tweakpane plugin to add Undo/Redo feature to your panes

## Installation

```bash
npm install github:cosmicshelter/tweakpane-undo-redo-plugin
```

## Usage

```bash
import addUndoRedoFeature from 'tweakpane-undo-redo-plugin';
import * as Tweakpane from 'tweakpane';

addUndoRedoFeature(Tweakpane);
```

If needed, you can call clear to empty the action history stack : 

```bash
const undoRedoFeature = addUndoRedoFeature(Tweakpane);
undoRedoFeature.clear();
```

You can also call destroy to clear the history and remove the keydown event listener :

```bash
const undoRedoFeature = addUndoRedoFeature(Tweakpane);
undoRedoFeature.destroy();
```

## Disclamer

I had to make my way around the official Tweakpane API to make this work, using internal methods etc...
It might not work properly for Tweakpane versions other than v4.0.5.

## Roadmap

- More testing
- Handle blades
- Handle other plugins

export default function addUndoRedoFeature(Tweakpane) {
  let undoStack = [];
  let redoStack = [];

  function undo() {
      if (undoStack.length === 0) return;
          
      const undoData = undoStack.pop();
      undoData.binding.isUndoAction = true;
      undoData.binding.controller.value.setRawValue(undoData.value);
  }

  function redo() {
      if (redoStack.length === 0) return;
          
      const redoData = redoStack.pop();
      redoData.binding.isRedoAction = true;
      redoData.binding.controller.value.setRawValue(redoData.value);
  }

  function bindingUndoRedoMiddleware(binding, options) {
      binding.isReadOnly = options[2] && options[2].readonly;

      if (binding.isReadOnly) return binding;

      binding.previousValues = [];

      binding.controller.value.emitter.on('beforechange', (e) => {
      const previousValue = e.sender.rawValue;
      binding.previousValues.push(previousValue);
      });

      binding.on('change', (e) => {
      if (!e.last) return;

      if (binding.isUndoAction) {
          redoStack.push({ binding, value: binding.previousValues[0] });
          binding.isUndoAction = false;
      } else if (binding.isRedoAction) {
          undoStack.push({ binding, value: binding.previousValues[0] });
          binding.isRedoAction = false;
      } else {
          redoStack = [];
          undoStack.push({ binding, value: binding.previousValues[0] });
      }

      binding.previousValues = [];
      });

      return binding;
  }

  function keydownHandler(e) {
      const cmd = e.metaKey || e.ctrlKey;
      const z = e.key === 'z';
      const Z = e.key === 'Z';

      if (cmd && z) undo();
      else if (cmd && Z) redo();
  }

  window.addEventListener('keydown', keydownHandler);

  Object.assign(Tweakpane.TabPageApi.prototype, {
      addBinding: function(...options) {
      const binding = this.rackApi_.addBinding(...options);    
      return bindingUndoRedoMiddleware(binding, options);
      },
  });

  Object.assign(Tweakpane.FolderApi.prototype, {
      addBinding: function(...options) {
      const binding = this.rackApi_.addBinding(...options);    
      return bindingUndoRedoMiddleware(binding, options);
      },
  });

  return {
    clear() {
        redoStack = [];
        undoStack = [];
    },
    destroy: () => {
        redoStack = [];
        undoStack = [];
        window.removeEventListener('keydown', keydownHandler);
    }
  }
}
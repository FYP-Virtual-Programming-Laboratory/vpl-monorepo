import { AwarenessState } from "@/components/y-objects-provider";
import { TinyColor } from "@ctrl/tinycolor";
import { editor, Position, Range, Selection } from "monaco-editor";

function normaliseCssSelector(selector: string) {
  return selector.replace(" ", "_");
}

function cursorToDecoration(cursor: Position, username: string) {
  return {
    range: new Range(
      cursor.lineNumber,
      cursor.column,
      cursor.lineNumber,
      cursor.column
    ),
    options: {
      className: `my-cursor my-cursor-${normaliseCssSelector(username)}`,
      after: {
        content: username,
      },
    },
  } satisfies editor.IModelDeltaDecoration;
}

function selectionToDecoration(selection: Selection, username: string) {
  return {
    range: new Range(
      selection.startLineNumber,
      selection.startColumn,
      selection.endLineNumber,
      selection.endColumn
    ),
    options: {
      className: `my-selection my-selection-${username}`,
    },
  } satisfies editor.IModelDeltaDecoration;
}

export function renderDecorations(
  decorationsCollection: editor.IEditorDecorationsCollection,
  decorations: editor.IModelDeltaDecoration[]
) {
  decorationsCollection.clear();
  return decorationsCollection.set(decorations);
}

export function awarenessToDecorations(
  states: AwarenessState[]
): editor.IModelDeltaDecoration[] {
  return states.flatMap((state) => {
    const { cursor, selection, user } = state;

    const modelDecorations = [];

    if (cursor) modelDecorations.push(cursorToDecoration(cursor, user.name));
    if (selection)
      modelDecorations.push(selectionToDecoration(selection, user.name));

    return modelDecorations;
  });
}

export function awarenessToStyle(states: AwarenessState[]) {
  const decorationStyles: string[] = [];

  states.forEach((state) => {
    const { user, cursor, selection } = state;

    const colour = new TinyColor(user.colour);
    const cursorTextColour = colour.isLight() ? "black" : "white";
    const baseBgColour = colour.brighten(30).toHexString();
    const activeBgColour = user.colour;

    if (cursor) {
      decorationStyles.push(
        `.my-cursor-${normaliseCssSelector(
          user.name
        )} { position: relative; background-color: ${activeBgColour}; color: ${cursorTextColour}; z-index: 1; }`
      );
      decorationStyles.push(
        `.my-cursor-${normaliseCssSelector(
          user.name
        )}::after { position: absolute; top: 1.4em; content: '${
          user.name
        }'; white-space: nowrap; font-size: 0.8em; background-color: ${baseBgColour}; border-radius: 0.4em; padding: 0px 0.2em; }`
      );
      decorationStyles.push(
        `.my-cursor-${normaliseCssSelector(
          user.name
        )}:hover::after { background-color: ${activeBgColour}; }`
      );
    }
    if (selection) {
      decorationStyles.push(
        `.my-selection-${normaliseCssSelector(
          user.name
        )} { background-color: ${baseBgColour}; }`
      );
    }
  });

  return decorationStyles.join("\n");
}

export function injectStyles(styles: string) {
  const styleId = "monaco-decorations";
  let styleElement = document.getElementById(styleId) as HTMLStyleElement;

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  styleElement.innerHTML = styles;
}

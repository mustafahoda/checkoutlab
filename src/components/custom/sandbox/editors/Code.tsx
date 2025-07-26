import generate from "@babel/generator";
import { parse as babelParser } from "@babel/parser"; // Import a JavaScript parser
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { css } from "@codemirror/lang-css"; // Add this import
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { Diagnostic, linter } from "@codemirror/lint";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { abyss } from "@uiw/codemirror-theme-abyss";
import { materialLight } from "@uiw/codemirror-theme-material";
import CodeMirror from "@uiw/react-codemirror";
import * as jsonc from "jsonc-parser"; // Import jsonc-parser
const cssParse = require("css/lib/parse");

const Code = (props: any) => {
  const { code, type, readOnly, onChange, theme, jsVariable, handleError, lineWrap } =
    props;

  const getVariableValueFromAST = (code: string, variableName: string) => {
    // Parse the code to get the AST
    const ast = babelParser(code, { sourceType: "module" });

    let variableValue = null;

    // Traverse the AST to find the variable declaration
    traverse(ast, {
      VariableDeclarator(path: any) {
        if (t.isIdentifier(path.node.id, { name: variableName })) {
          // Evaluate the value of the variable
          variableValue = path.node.init;
          path.stop();
        }
      },
    });
    // Generate code from the AST node
    const { code: valueCode } = generate(variableValue);
    // Use eval to get the JavaScript object representation
    const evaluatedValue = eval(`(${valueCode})`);

    return evaluatedValue;
  };

  const cssToObject = (cssString: string) => {
    try {
      const ast = cssParse(cssString);
      const styleObject: { [key: string]: { [key: string]: string } } = {};

      ast.stylesheet?.rules.forEach((rule: any) => {
        if (rule.type === "rule") {
          rule.selectors.forEach((selector: string) => {
            // Clean up the selector - remove any leading/trailing commas and whitespace
            const cleanSelector = selector
              .replace(/^[\s,]+|[\s,]+$/g, "") // Remove leading/trailing commas and whitespace
              .trim();

            if (cleanSelector) {
              styleObject[cleanSelector] = styleObject[cleanSelector] || {};

              rule.declarations?.forEach((declaration: any) => {
                if (declaration.type === "declaration") {
                  styleObject[cleanSelector][declaration.property] =
                    declaration.value;
                }
              });
            }
          });
        }
      });

      return styleObject;
    } catch (error) {
      console.error("Error parsing CSS:", error);
      return null;
    }
  };

  const handleChange = async (value: string, type: string) => {
    try {
      // Linter logic
      let diagnostics: Diagnostic[] = [];
      if (type === "json") {
        diagnostics = await jsonLinter({
          state: { doc: { toString: () => value } },
        });
        if (diagnostics.length === 0) {
          onChange(jsonc.parse(value), value);
          handleError(null);
        } else {
          handleError(diagnostics);
        }
      } else if (type === "babel") {
        diagnostics = await javascriptLinter({
          state: { doc: { toString: () => value } },
        });
        if (diagnostics.length === 0) {
          // Bug: What if the user doesn't have any bugs but also doesnt have checkout configuration in the code, we should still throw an error

          onChange(getVariableValueFromAST(value, jsVariable), value);
          handleError(null);
        } else {
          handleError(diagnostics);
        }
      } else if (type === "style") {
        diagnostics = await cssLinter({
          state: { doc: { toString: () => value } },
        });
        if (diagnostics.length === 0) {
          const styleObject = cssToObject(value);
          onChange(styleObject, value);
          handleError(null);
        } else {
          handleError(diagnostics);
        }
      }
    } catch (error) {
      console.error("Error in handleChange:", error);
    }
  };

  const jsonLinter = async (view: any) => {
    const diagnostics: Diagnostic[] = [];
    const code = view.state.doc.toString();

    const errors = jsonc.visit(code, {
      onError: (error, offset, length) => {
        diagnostics.push({
          from: offset,
          to: offset + length,
          severity: "error",
          message: jsonc.printParseErrorCode(error),
        });
      },
    });
    return diagnostics;
  };

  const javascriptLinter = async (view: any) => {
    const diagnostics: Diagnostic[] = [];
    const code = view.state.doc.toString();
    try {
      const ast = babelParser(code, { sourceType: "module" });
    } catch (error: any) {
      // Extract location information if available
      const from = error.loc
        ? getCharacterPosition(code, error.loc.line, error.loc.column)
        : 0;
      const to = from; // Assuming the error is at a single point
      diagnostics.push({
        from,
        to,
        severity: "error",
        message: error.message,
      });
    }
    return diagnostics;
  };

  // Helper function to convert line and column to character position
  const getCharacterPosition = (code: string, line: number, column: number) => {
    const lines = code.split("\n");
    let position = 0;
    for (let i = 0; i < line - 1; i++) {
      position += lines[i].length + 1; // +1 for the newline character
    }
    position += column;
    return position;
  };

  const cssLinter = async (view: any) => {
    const diagnostics: Diagnostic[] = [];
    const cssString = view.state.doc.toString();

    try {
      const ast = cssParse(cssString);
    } catch (error: any) {
      // Extract location information if available
      const from = error.loc
        ? getCharacterPosition(code, error.loc.line, error.loc.column)
        : 0;
      const to = from; // Assuming the error is at a single point
      diagnostics.push({
        from,
        to,
        severity: "error",
        message: error.message,
      });
    }
    return diagnostics;
  };

  const extensions = [];

  if (!readOnly) {
    extensions.push(
      EditorView.updateListener.of((update: ViewUpdate) => {
        if (update.docChanged) {
          handleChange(update.state.doc.toString(), type);
        }
      })
    );
  }

  if (type === "html") {
    extensions.push(javascript({ jsx: true }));
  } else if (type === "json") {
    extensions.push(json(), linter(jsonLinter));
  } else if (type === "babel") {
    extensions.push(javascript(), linter(javascriptLinter));
  } else if (type === "style") {
    extensions.push(css(), linter(cssLinter));
  }

  if (lineWrap) {
    extensions.push(EditorView.lineWrapping);
  }

  return (
    <div
      className={`flex w-[100%] h-[100%] flex-col codemirror-wrapper border-t-none rounded-md ${readOnly ? "cursor-not-allowed" : ""}`}
    >
      <CodeMirror
        value={code}
        height="100%"
        readOnly={readOnly}
        theme={theme === "light" ? materialLight : abyss}
        extensions={extensions}
        basicSetup={{
          lineNumbers: !readOnly,
          highlightActiveLine: !readOnly,
          foldGutter: !readOnly,
        }}
      />
    </div>
  );
};

export default Code;

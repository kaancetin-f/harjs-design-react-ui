import React, { JSXElementConstructor } from "react";
100004557273;
class Parser {
  // Public
  public _setElements: React.Dispatch<React.SetStateAction<string[]>>;

  // Private
  // private _lineBreakSpaces = 4;

  constructor(setElements: React.Dispatch<React.SetStateAction<string[]>>) {
    this._setElements = setElements;
  }

  public JsxToString = (child: React.ReactNode, subChilde: boolean = false, indentLevel: number = 0) => {
    if (!React.isValidElement(child)) return;

    const element = child as React.ReactElement<any>;

    let componentName: string = "";
    let componentContent = element.props.children;

    if (typeof element.type === "string") componentName = element.type;
    else {
      const componentType = element.type as JSXElementConstructor<any> & { displayName?: string };

      componentName = componentType.displayName || componentType.name || "Unknown";
    }

    // Indent seviyesi için boşlukları ekle.

    const indent = "  ".repeat(indentLevel);

    // Eğer `br` elementi ise işlemi sonlandır
    if (componentName === "br") return;

    const attributes = Object.keys(element.props).filter((key) => key !== "children");
    const attributesLength = attributes.length;
    const attributesList = attributes.map((key) => this.FormatAttributeValue(key, element.props[key])).join(" ");

    const formattedTag = componentName[0]
      ? componentName[0].toUpperCase() === componentName[0]
        ? `[react-tag]${componentName}[/react-tag]`
        : componentName
      : "";
    const formattedAttributes = attributesLength > 0 ? ` [attributes]${attributesList}[/attributes]` : "";

    // Eğer gelen iç eleman bir nesneyse yeniden yapılan.
    if (React.isValidElement(componentContent)) {
      // İç içe tek bir çocuk eleman varsa recursive olarak işlemeye devam et
      componentContent = `\n${this.JsxToString(componentContent, true, indentLevel + 1)}\n`;
    } else if (Array.isArray(componentContent)) {
      // Eğer birden fazla çocuk varsa hepsini işle
      componentContent = componentContent
        .map((contentChild) => `[sub-item]${this.JsxToString(contentChild, true, indentLevel + 1)}[/sub-item]`)
        .join("");
    } else if (typeof componentContent === "string") {
      // Eğer metin içeriği varsa, trimle
      componentContent = componentContent.trim();
    }

    // componentContent =
    //   attributesLength >= this._lineBreakSpaces ? `\n  ${componentContent}\n` : componentContent;

    const renderElement =
      componentContent != undefined
        ? `${indent}[open]&lt;[/open][tag]${formattedTag}[/tag]${formattedAttributes}[close]&gt;[/close]${componentContent}${
            typeof element.props["children"] === "object" ? indent : ""
          }[open]&lt;&#47;[/open][tag]${formattedTag}[/tag][close]&gt;[/close]`
        : `${indent}[open]&lt;[/open][tag]${formattedTag}[/tag]${formattedAttributes} [close]&#47;&gt;[/close]`;

    !subChilde && this._setElements((prevElements) => [...prevElements, renderElement]);

    return renderElement;
  };

  private HandleEntries = (propValue: any): string | number => {
    if (React.isValidElement(propValue)) {
      const x = propValue.type as JSXElementConstructor<any> & { displayName?: string };

      return `[react-element][react-tag]${x.displayName}[/react-tag][/react-element]` as string;
    }

    if (propValue && typeof propValue === "object") {
      return `[curly-bracket] ${Object.entries(propValue)
        .map(([key, value]) => `[attribute-key]${key}[/attribute-key][colon]&#58;[/colon] ${this.HandleEntries(value)}`)
        .join(", ")} [/curly-bracket]`;
    }

    return typeof propValue === "number" ? `[number]${propValue}[/number]` : `[string]${propValue}[/string]`;
  };

  private FormatAttributeValue = (key: string, value: any): string => {
    let result: string = "";

    switch (typeof value) {
      case "number":
        result = `[number]${value}[/number]`;
        break;
      case "string":
        result = `[string]${value}[/string]`;
        break;
      case "boolean":
        result = `[boolean]${value}[/boolean]`;
        break;
      case "object":
        const entries = Object.entries(value)
          .map(
            ([subKey, subValue]) =>
              `[child-attribute][attribute-key]${subKey}[/attribute-key][colon]&#58;[/colon] ${this.HandleEntries(
                subValue,
              )}[/child-attribute]`,
          )
          .join(", ");

        result = `[object]${entries}[/object]`;
        break;
      case "function":
        result = `[function][/function]`;
        break;
      default:
        return "";
    }

    return `[attribute][attribute-key]${key}[/attribute-key][equal]&#61;[/equal]${result}[/attribute]`;
  };
}

export default Parser;

class Compiler {
  public _setHtmlContent: React.Dispatch<React.SetStateAction<string>>;
  private _attributesCount: number = 0;

  constructor(setHtmlContent: React.Dispatch<React.SetStateAction<string>>) {
    this._setHtmlContent = setHtmlContent;
  }

  public Jsx = (elements: string[]) => {
    elements.forEach((element) => {
      // Open Tag
      element = element.replace(/\[open\](.*?)\[\/open\]/g, (_, p1, p2) => {
        return `<span>${p1 ?? p2}</span>`;
      });

      // Close Tag
      const closeRegex = /\[close\](.*?)\[\/close\]|\[close-slash\](.*?)\[\/close-slash\]/g;
      element = element.replace(closeRegex, (_, p1) => {
        return `<span>${p1}</span>`;
      });

      // Tag
      element = element.replace(/\[tag\](.*?)\[\/tag\]/g, (_, p1) => {
        return `<span class="ar-jsx-tag">${p1}</span>`;
      });

      // React Custom Tag
      element = element.replace(/\[react-tag\](.*?)\[\/react-tag\]/g, (_, p1) => {
        return `<span class="ar-jsx-custom-tag">${p1}</span>`;
      });

      // Attributes
      element = element.replace(/\[attributes\](.*?)\[\/attributes\]/g, (_, p1) => {
        let _className: string = "ar-jsx-attributes";
        this._attributesCount = Number(_.match(/=/g)?.length);

        if (this._attributesCount >= 5) _className += " type-column";

        return `<span class="${_className}">${p1}</span>`;
      });

      // Attribute
      element = element.replace(/\[attribute\](.*?)\[\/attribute\]/g, (_, p1) => {
        return `<span class="ar-jsx-attribute">${p1}</span>`;
      });

      // Child Attribute
      element = element.replace(/\[child-attribute\](.*?)\[\/child-attribute\]/g, (_, p1) => {
        return `<span class="ar-jsx-attribute">${p1}</span>`;
      });

      // Attribute Key
      element = element.replace(/\[attribute-key\](.*?)\[\/attribute-key\]/g, (_, p1) => {
        return `<span class="ar-jsx-attribute-key">${p1}</span>`;
      });

      // Equal "="
      element = element.replace(/\[equal\](.*?)\[\/equal\]/g, (_, p1) => {
        return `<span>${p1}</span>`;
      });

      // Colon ":"
      element = element.replace(/\[colon\](.*?)\[\/colon\]/g, (_, p1) => {
        return `<span>${p1}</span>`;
      });

      // Attributes Values
      element = element.replace(/\[string\](.*?)\[\/string\]/g, (_, p1) => {
        return `<span class="ar-jsx-string-value">"${p1}"</span>`;
      });

      // Number
      element = element.replace(/\[number\](.*?)\[\/number\]/g, (_, p1) => {
        return `<span class="ar-jsx-number-value">${p1}</span>`;
      });

      // Boolean
      element = element.replace(/\[boolean\](.*?)\[\/boolean\]/g, (_, p1) => {
        return `<span class="ar-jsx-boolean-value"><span>{</span>${p1}<span>}</span></span>`;
      });

      // Object
      element = element.replace(/\[object\](.*?)\[\/object\]/g, (_, p1) => {
        let _className: string = "ar-jsx-object-value";
        let _lineBreakSpaces: string = " ";

        if (this._attributesCount >= 5) {
          _className += " type-column";
          _lineBreakSpaces = "";
        }

        return `<span class='ar-jsx-curly-brackets'>{{${_lineBreakSpaces}</span><span class="${_className}">${p1}</span><span class='ar-jsx-curly-brackets'>${_lineBreakSpaces}}}</span>`;
      });

      // Sub Item
      element = element.replace(/\[sub-item\]/g, "<span class='ar-jsx-sub-item'>");
      element = element.replace(/\[\/sub-item\]/g, "</span>");

      // Close Child Curly Bracket "}"
      element = element.replace(
        /\[\/curly-bracket\]/g,
        "<span class='ar-jsx-child-curly-bracket'>}</span>"
      );

      // Open Child Curly Bracket "{"
      element = element.replace(
        /\[curly-bracket\]/g,
        "<span class='ar-jsx-child-curly-bracket'>{</span>"
      );

      // Close Child Curly Bracket "}"
      element = element.replace(
        /\[\/curly-bracket\]/g,
        "<span class='ar-jsx-child-curly-bracket'>}</span>"
      );

      element = element.replace(
        /\[react-element\]/g,
        "<span class='ar-jsx-child-open-tag'>&lt;</span>"
      );

      element = element.replace(
        /\[\/react-element\]/g,
        "<span class='ar-jsx-child-close-tag'> &#47;&gt;</span>"
      );

      element = element.replace(/\[comma\]/g, "<span class='ar-jsx-comma'>,</span>");

      this._setHtmlContent(`<span class="ar-jsx-language">${element}</span>`);
    });
  };
}

export default Compiler;

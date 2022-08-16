export const PSDom = {
  /**
   * Get the element full height in pixels.
   * (including margin, padding and border)
   *
   * @param {HTMLElement} element
   * @returns {number}
   */
  outerHeight(element) {
    const height = element.offsetHeight;

    const marginTop = parseInt(element.style?.marginTop || 0) || 0;
    const marginBottom = parseInt(element.style?.marginBottom || 0) || 0 ;
    return (height + marginTop + marginBottom);
  },
  /**
   * This method let you draw a string of HTML in to HTMLElement
   *
   * @param {string} html The HTML String
   * @param {Object<string, Function>} bindings Custom bindings to be applied to the HTML Element.
   * @returns {HTMLElement}
   */
  draw(html, bindings = {}) {
    const template = document.createElement('template');
    template.innerHTML = String(html).replace(/(\r\n|\n|\r)(\s{2})+/gm, '');
    Object
      .keys(bindings)
      .forEach((key) => {
        template.content.firstChild[key] = bindings[key];
      });
    return template.content.firstChild;
  },

  /**
   * Find a given DOMElement base on CSS selector or throw an exception.
   *
   * @param {string} selector HTML Selector
   * @returns HTMLElement
   */
  findOrFail(selector) {
    const element = this.find(selector);
    if (!element) {
      throw new DOMException(`No elements found for ${selector}.`);
    }
    return element;
  },
  /**
   * Find a given HTMLElement in the DOM if exists.
   *
   * @param {string} selector CSS selector
   * @returns HTMLElement
   */
  find(selector) {
    return document.querySelector(selector);
  },
  /**
   * Wait until a given selector is present in the DOM.
   *
   * @param {string} selector CSS selector.
   * @returns Promise<HTMLElement>
   */
  when(selector) {
    return new Promise((resolve, reject) => {
      try {
        const element = PSDom.findOrFail(selector);
        resolve(element);
      } catch {
        const observer = new MutationObserver(() => {
          const element = PSDom.find(selector);
          if (!element) {
            return;
          }
          observer.disconnect();
          resolve(element);
        });

        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  },
};

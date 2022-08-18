const PSToolKit = {
  queryString: {
    /**
     * @param {string[]} keys
     * @returns {Object<string, string>}
     */
    only(keys) {
      const params = new URLSearchParams(window.top.location.search ?? '');
      return keys.reduce((collection, current) => {
        collection[current] = params.get(current) ?? null;
        return collection;
      }, {});
    },
  },
  placeholder: {

    /**
     * Set the placeholders in a given string.
     *
     * @example
     * // Returns: Hello World
     * PSToolKit.placeholder.write('Hello {name}', { "name": "World" })
     *
     * @param {string} text The text that contains the {holders}
     * @param {Object<string,string>} placeholders The object with the placeholders to be used.
     * @returns {string} The string with placeholders.
     */
    write(text, placeholders = {}) {
      return Object
        .keys(placeholders)
        ?.reduce((t, key) => String(t).replace(new RegExp(`{${key}}`,'g'), placeholders[key] ?? ''), text);
    },

    /**
     * Rename the keys of a given object of strings.
     *
     *  @example
     * // Result: { first: "value_1", second: "value_2 "}
     * PSToolKit.placeholder.transform({foo: "first", soo: "second"}, { foo: "value_1", soo: "value_2 "})
     *
     * @param {Object<string, string>} map
     * @param {Object<string, string>} values
     * @returns {Object<string,string>}
     */
    transform(map, values) {
      return Object
        .keys(map)
        .reduce((output, key) => {
          if (values[key]) {
            output[map[key]] = values[key];
          }
          return output;
        }, {});
    },

    /**
     * This method takes a string and build an array of all keys withing curly braces
     *
     * @example
     * // Result ['firstName', 'lastName']
     * PSToolKit.placeholder.keys('Your name is {firstName} {lastName}')
     *
     * @param {string} characters The string to be evaluated
     * @returns {string[]}
     */
    keys(characters) {
      return (
        String(characters)
          .match(/({[a-zA-Z_-]+})/g)
          ?.map((key) => key.replace(/([{}])/gi, '')) ?? []
      );
    },

    /**
     * Get a plain {object} with only the given keys.
     *
     * @param {Array} keys Keys to be taken from placeholders object.
     * @param {Object} placeholders Plain object with all placeholders.
     * @returns {Object<string, string>}
     */
    only(keys, placeholders) {
      return keys.reduce((collection, current) => {
        if (placeholders[current]) {
          collection[current] = placeholders[current];
        }
        return collection;
      }, {});
    },
  },

  /**
   * This method is responsible to draw a given HTMLElement after a given element.
   *
   * @param {HTMLElement} existingNode The target to draw after sibling target
   * @param {HTMLElement} nodeToAdd Target element to put as sibling element
   * @returns {HTMLElement} The parent node with the inserted sibling element.
   */
  insertAfter(existingNode, nodeToAdd) {
    return existingNode.parentNode.insertBefore(
      nodeToAdd,
      existingNode.nextSibling,
    );
  },
};

export { PSToolKit };

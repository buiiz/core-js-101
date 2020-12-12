/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
  constructor() {
    this.previousSelector = '';
    this.elementSelector = '';
    this.idSelector = '';
    this.classSelector = '';
    this.attributeSelector = '';
    this.pseudoClassSelector = '';
    this.pseudoElementSelector = '';
  }

  // prettier-ignore
  element(value) {
    if (this.elementSelector) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    if (
      this.pseudoElementSelector
      || this.pseudoClassSelector
      || this.attributeSelector
      || this.classSelector
      || this.idSelector
    ) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.elementSelector = `${value}`;
    return this;
  }

  // prettier-ignore
  id(value) {
    if (this.idSelector) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    if (this.pseudoElementSelector
      || this.pseudoClassSelector
      || this.attributeSelector
      || this.classSelector) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.idSelector = `#${value}`;
    return this;
  }

  // prettier-ignore
  class(value) {
    if (this.pseudoElementSelector || this.pseudoClassSelector || this.attributeSelector) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.classSelector += `.${value}`;
    return this;
  }

  // prettier-ignore
  attr(value) {
    if (this.pseudoElementSelector || this.pseudoClassSelector) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.attributeSelector += `[${value}]`;
    return this;
  }

  // prettier-ignore
  pseudoClass(value) {
    if (this.pseudoElementSelector) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.pseudoClassSelector += `:${value}`;
    return this;
  }

  // prettier-ignore
  pseudoElement(value) {
    if (this.pseudoElementSelector) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    this.pseudoElementSelector = `::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.previousSelector = [
      selector1.stringify(),
      combinator,
      selector2.stringify(),
    ].join(' ');
    return this;
  }

  stringify() {
    return [
      this.previousSelector,
      this.elementSelector,
      this.idSelector,
      this.classSelector,
      this.attributeSelector,
      this.pseudoClassSelector,
      this.pseudoElementSelector,
    ].join('');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Selector().element(value);
  },

  id(value) {
    return new Selector().id(value);
  },

  class(value) {
    return new Selector().class(value);
  },

  attr(value) {
    return new Selector().attr(value);
  },

  pseudoClass(value) {
    return new Selector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new Selector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new Selector().combine(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};

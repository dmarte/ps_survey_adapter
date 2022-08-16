import { PSDom } from '../src/PSDom.js';

describe('PSDom.js', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });


  beforeAll(() => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(
      '<main><div id="handler"><button>FOO</button><button>BAR</button></div></main>',
      'text/html',
    );

    global.MutationObserver = class {
      constructor(callback) {
        this.callback = callback
      }
      disconnect() {}
      observe(element, initObject) {
        const div = PSDom.draw('<div class="child">Hello</div>');
        setTimeout(() => {
          dom.body.appendChild(div)
          this.callback()
        }, 100)
      }
    }
    jest
      .spyOn(document, 'querySelector')
      .mockImplementation(selector => dom.querySelector(selector));
  });

  it('PSDom.find(selector)', () => {
    expect(PSDom.find('#handler')).toBeInstanceOf(HTMLElement);
    expect(PSDom.find('#handler').tagName.toLowerCase()).toEqual('div');
  });

  it('PSDom.findOrFail(selector) : Success', () => {
    // We try to find an undefined element
    expect(PSDom.findOrFail('#handler')).toBeInstanceOf(HTMLElement);
    expect(PSDom.find('#handler').tagName.toLowerCase()).toEqual('div');
  });

  it('PSDom.findOrFail(selector) : Exception', () => {
    // We try to find an undefined element
    expect(() => PSDom.findOrFail('#handlerx')).toThrowError(/^No elements found for #handlerx.$/);
  });

  it('PSDom.when(selector)', async () => {
    await expect(PSDom.when('.child')).resolves.toBeInstanceOf(HTMLElement)
  });

  it('ToolKit.draw(html)', () => {
    const element = PSDom.draw('<div class="foo-bar"></div>');
    expect(element).toBeInstanceOf(HTMLElement)
    expect(element.outerHTML).toEqual('<div class="foo-bar"></div>');
  })

  it('ToolKit.draw(html) with bindings', () => {
    const element = PSDom.draw('<div class="foo-bar"></div>', {
      show() {
        element.style.display = 'block'
      },
      hide() {
        element.style.display = 'hide'
      }
    });
    expect(element.show).toBeInstanceOf(Function);
    expect(element.hide).toBeInstanceOf(Function);
  })

});

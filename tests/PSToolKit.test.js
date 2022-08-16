import {PSToolKit} from '../src/PSToolKit.js'

describe('PSToolKit.js', () => {

    it('ToolKit.placeholder.write( text, placeholders)', () => {
        const value = PSToolKit.placeholder.write('Hello {name} {name}', { name: 'World' })
        expect(value).toEqual('Hello World World')
    })

    it('ToolKit.placeholder.transform(map, values)', () => {
        const map = { first: 'hello', second: 'world' }
        const values = { first: 'Hello', second: 'World' }
        const value = PSToolKit.placeholder.transform(map, values)
        expect(value).toEqual({
            hello: 'Hello',
            world: 'World'
        })
    })

    it('ToolKit.placeholder.keys(characters)', () => {
        const value = PSToolKit.placeholder.keys("Hello {firstName} {lastName}!")
        expect(value).toEqual(['firstName', 'lastName'])
    })

    it('ToolKit.queryString.only(keys)', () => {
        const location = {
            ...window.location,
            search: '?foo=bar&xyz=test',
        };
        Object.defineProperty(window, 'location', {
            writable: true,
            value: location,
        })
        expect(PSToolKit.queryString.only(['foo', 'xyz'])).toEqual({foo: 'bar', xyz: 'test'})
    })



})

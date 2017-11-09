# turndown-attendant

Test runner for HTML to Markdown conversions with Turndown

## Usage

Specify you input HTML and your expected output in an HTML file:

```html
<!-- test.html -->
<div class="case", data-name="headings">
  <div class="input">
    <h1>Hello world</h1>
  </div>
  <pre class="expected"># Hello world</pre>
</div>
```

Create a new attendant with the `TurndownService` class, the HTML file, and optionally a `beforeEach` function which gets called with the new `TurndownService` instance. (This is useful for applying plugins.) Then call `run` to run the test cases.

```js
var TurndownService = require('turndown')
var Attendant = require('turndown-attendant')

var attendant = new Attendant({
  Turndown: TurndownService,
  file: '/path/to/test.html',
  beforeEach: function (turndownService) {
    turndownService.use(…)
  }
})

attendant.run()
```

To run tests that do not require HTML or a DOM, access `test` on the `attendant` instance:

```js
attendant.test('test something else', function (t) { … })
```

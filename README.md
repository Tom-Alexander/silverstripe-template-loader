# silverstripe-template-loader

[![Build Status](https://travis-ci.org/Tom-Alexander/silverstripe-template-loader.svg)](https://travis-ci.org/Tom-Alexander/silverstripe-template-loader)

This is a [Webpack](https://webpack.github.io/) loader for [silverstripe templates](https://docs.silverstripe.org/en/3.1/developer_guides/templates/).

## Installation

```
npm install silverstripe-template-loader
```

## Usage

Add the loader to your Webpack configuration. By default the loader will search for
includes in the `templates/Includes` directory, but it can be changed using the
`includeDir` query parameter.

```
{
  test: /\.ss/,
  loader: 'silverstripe-template-loader'
}
```

You must explicitly require the page templates you want. This allows enables
bundle splitting and async loading based on page type. Alternatively you could
load all the templates in the `Layout` directory using `require.context`.

Assets can now be required from any template file in your templates directory.
Include templates will be resolved automatically. **Includes that cannot be resolved
from the `Includes` directory are ignored without warning.**

```
<% Asset('../source/js/navigation.js') %>
```
## License

The MIT License (MIT)

Copyright (c) Tom Alexander <me@tomalexander.co.nz>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

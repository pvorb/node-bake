# bake

bake is a template engine for static text files. It is something like
[Tom Preston-Werner][mojombo]'s [jekyll], but it is independent of file
types and markup languages.

It allows you to apply JavaScript templates to any type of text file. These
templates are written in [embedded JavaScript][ejs].

## Installation

```
npm install bake
```

## Usage

A template (`default.tpl`) may look like this:

```html
<!DOCTYPE html>
<html lang="<%= lang %>">
  <head>
    <meta charset="utf-8">
    <title><%- title %> | <%= siteTitle %></title>
  </head>
  <body>
    <h1><%- title %></h1>

    <%- __content %>

<% if (locals.foo) { %>
    <p>Foo is defined.</p>
<% } %>
  </body>
</html>
```

And a corresponding content file (`post.txt`) could look like this:

```html
title: A sample file
lang: en


<p>Sample text.</p>
```

With a minimal configuration object

```javascript
{
  "fileExtensions": {
    "txt": "html" // look for html files and save as html file
  },
  "properties": {
    "siteTitle": "My Site" // Global website title
  }
}
```

the output (`post.html`) would be:

```html
<!DOCTYPE>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>A sample file | My Site</title>
  </head>
  <body>
    <h1>A sample file</h1>
    
    <p>Sample text.</p>


  </body>
</html>
```

bake not only enables building websites (although that’s its main purpose)
but lets you choose. You can write hooks for each property to control the
output.

Visit the [Wiki] for more information or look at the [example].


## What this is not

bake is **not a webserver** nor comes with one. It doesn't replace your
Apache/Nginx etc. So if you want to write a website that is accessible by the
public, you have to change the settings of your webserver to use `bakeDir` as
the root directory.

bake is **no blogging engine** (although it's possible to create one with the
help of bake). It doesn't provide generating an index or a feed. It doesn't
have any commenting functionality either. If you are looking for a system with
these features, try [bread] which is based on bake.


## Bugs and Issues

If you encounter any bugs or issues, feel free to open an issue at
[github][issues].


## Credits

This work was inspired by [heimweh] by [Benjamin Birkenhake][ben_] and
[txtracer] by [Konstantin Weiss][konnexus], but also by
[wheat] by [Tim Caswell][creationix] and [jekyll] by [Tom
Preston-Werner][mojombo].

[jekyll]: http://jekyllrb.com/
[mojombo]: http://tom.preston-werner.com/
[ejs]: //github.com/visionmedia/ejs
[npm]: http://npmjs.org/
[wiki]: //github.com/pvorb/node-bake/wiki
[example]: //github.com/pvorb/node-bake/tree/master/example
[bread]: //github.com/pvorb/node-bread
[issues]: //github.com/pvorb/node-bake/issues
[mit]: http://vorb.de/license/mit.html

[heimweh]: http://anmutunddemut.de/serie/on-my-way-to-heimweh.html
[ben_]: http://anmutunddemut.de/
[txtracer]: http://konnexus.net/lexicon/txtracer
[konnexus]: http://konnexus.net/
[wheat]: //github.com/creationix/wheat
[creationix]: //github.com/creationix
[mojombo]: http://tom.preston-werner.com/


## License

Copyright © 2011-2012 Paul Vorbach

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

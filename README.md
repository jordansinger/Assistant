![alt text](https://paint.design/assets/images/Assistant.png "Assistant")

# Assistant
### Talk to Sketch

[Download the Sketch plugin](https://github.com/jordansinger/Assistant/releases/latest)

Assistant is Sketch plugin that lets you add shapes and icons to your document simply by saying what you want:

> "Draw a red rectangle that is 200px x 300px"

> "Add a blue circle thats 500px"

> "Insert a heart icon"

- [How it works](#how-it-works)
  - [Shapes](#shapes)
    - [Colors](#colors)
    - [Dimensions](#dimensions)
  - [Icons](#icons)

## How it works
Assistant is powered by a private API which translates your words into instructions that Sketch can understand. It uses [Wit.ai](https://wit.ai) for natural language processing.

Assistant currently supports adding [shapes](#shapes) and [icons](#icons) to your Sketch document.

## Shapes
Assistant supports adding shapes to your document. In addition to defining the shape, you can determine the [color](#colors) and [dimensions](#dimensions) as well.

Currently supported shapes include:

- Rectangle
- Square
- Oval
- Circle
- Triangle

You can add a shape to your document using the following examples:

> "Add a _rectangle_"

> "Draw a _square_"

> "Insert an _oval_"

> "Add a _circle_"

> "Draw a _triangle_"

###### Notice the keywords that indicate you want to draw something, e.g. _add_, _draw_, _insert_

### Colors

While drawing shapes, you can include a color as well.

Assistant supports any valid color names and hexadecimal values, as seen by [Chroma](https://github.com/jfairbank/chroma), a Ruby gem for color manipulation and palette generation.

You can add color to your shapes using the following examples:

> "Add a _blue_ rectangle"

> "Draw a circle _#ff0000_"

> "Insert a triangle that is _green_"


### Dimensions

While drawing shapes, you can include dimensions.

Dimensions are found in your input listed in order of width, height. For shape

You can add dimensions to your shapes using the following examples:

> "Add a red rectangle _100px_ by _200px_"

> "Draw a blue circle _500_"

## Icons

Assistant supports any icon that is included in the [Feather](https://feathericons.com) icon set. You don't need to know the explicit name of a Feather icon in order to add it to your document, as they are mapped to keywords based on tags provided by Feather.

[See the list of supported icons and their tags](https://github.com/feathericons/feather/blob/master/src/tags.json)

You can add icons to your document using the following examples:

> "Add a _heart_ icon"

> "Insert the _twitter_ icon"

> "Draw a _music_ icon"

###### Notice the keyword _icon_ which indicates that you want to add an icon to the document

---

Assistant is meant to be an experiment into the possibilities of design tools.

[I build my ideas.](https://ibuildmyideas.com)

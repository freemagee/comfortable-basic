# Comfortable Basic

Comfortable Basic is a modern, simple Hugo theme. Intended for a blog like site.

View: [Demo using hugoBasicExample](https://freemagee.github.io/comfortable-basic/)

![Screenshot](https://github.com/freemagee/comfortable-basic/raw/master/images/screenshot.png)

## Features

- Mobile friendly
- Emphasis on readability
- Lightweight(ish) see [notes](#notes)

## Installation

Inside the folder of your Hugo site run:

```bash
$ cd themes
$ git clone https://github.com/freemagee/comfortable-basic
```

*For more information read the official [setup guide](https://gohugo.io/overview/installing/) of Hugo.*

## Example HUGO site config toml

```toml
baseURL= "https://example.com"
languageCode= "en-gb"
title= "Example Site"
paginate = 3
theme = "comfortable-basic"
pluralizeListTitles = false
pygmentsUseClasses = true

[params]
  description = "This is a website!"
  metaDescription = "Used as 'description' meta tag for both home and index pages. If not set, 'description' will be used instead"
  author = "SOMEGUY"
  authorWebsite = "https://example.com"
  titleSeperator = "/"
  useHighlightJS = true

[taxonomies]
  category = "categories"
  tag = "tags"
```

### Content Architecture Example

This theme is meant for a simple blog with posts and a about page. To get the most from it is recommended to structure your **content** folder like this:

```
+---content
    |   _index.md # This is the intro, it will appear at the
    |               top of the site on the homepage only
    |
    +---about
    |       _index.md # This is the about page content
    |
    \---post
            # all markdown posts
```

Simple as that.

## Notes

Recently added some better code syntax highlighting. Hugo has really good built-in highlighting using [Chroma](https://gohugo.io/content-management/syntax-highlighting/). Ran into some formatting issues with some code and extra white space being added. So have added [Highlightjs](https://highlightjs.org/) as an alternative. This unfortunately has bumped the theme file size up with the extra JavaScript, and some additional fonts. So that is why Comfortable Basic is lightweight(ish) at around > 300kb.

**Performance update**
A flag has been added to the theme config `useHighlightJS = true` that can be set to false to disable *Highlightjs* and just use Hugo's default syntax highlighting. This can save about 90Kb.

### TODO

- [ ] Optional logo support
- [ ] Add image type posts
- [ ] Handle multiple pages

# Comfortable Basic

Comfortable Basic is a modern, simple Hugo theme. Intended for a blog like site.

## Features

- Mobile friendly
- Emphasis on readability
- Lightweight

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

[params]
  description = "This is a website!"
  metaDescription = "Used as 'description' meta tag for both home and index pages. If not set, 'description' will be used instead"
  author = "SOMEGUY"
  authorWebsite = "https://example.com"
  titleSeperator = "/"

[taxonomies]
  category = "categories"
  tag = "tags"
```

### TODO

- Optional logo support
- Update Gulp tasks
- Improve "Page" styling
- Use config description on homepage / or use _index.md title
- Make pagination more visible, to aid user navigation
- Mobile styling needs work: typography and spacing
- Host dummy site on gh-pages branch
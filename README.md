# Comfortable Basic

Comfortable Basic is a modern, simple Hugo theme. Intended for a blog like site.

## Features

- Mobile friendly
- Emphasis on readability
- Lightweight

## Example HUGO config toml

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
- Create example site with dummy content
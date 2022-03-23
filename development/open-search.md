# OpenSearch

We neeed to add this in every page's `<head>` tag:

`<link title="Gofë" type="application/opensearchdescription+xml" rel="search" href="http://localhost:3000/plugins/opensearch.xml">`

We also need to make this accessible via a request to `/plugins/opensearch.xml`:

```
<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>Gofë</ShortName>
  <LongName>Gofë Search</LongName>
  <Description>Gofë—a private front-end for Google Search</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="48" height="48" type="image/x-icon">http://localhost:3000/favicon.ico</Image>
  <Url type="text/html" method="get" template="http://localhost:3000/search?q={searchTerms}"/>
  <Url type="application/x-suggestions+json" method="get" template="http://localhost:3000/opensuggest?q={searchTerms}"/>
</OpenSearchDescription>
```

"Your server should serve OpenSearch plugins [this file] using Content-Type:
application/opensearchdescription+xml"

Of course, we will need to modify the `Image` tag.

## References

* https://developer.mozilla.org/en-US/docs/Web/OpenSearch

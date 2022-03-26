# Gofë

![License: AGPL](https://img.shields.io/badge/license-AGPL-%233897f0)

Gofë is a front-end for Google Search. It currently supports textual search.

The official instance (the one that we, the primary developers, run) is
https://gofe.app. You can find a list of third-party instances
[here](INSTANCES.md).

## Why?

Gofë prevents Google's IP- and browser-fingerprinting by acting as a
middleperson between you and Google Search. This gives you better privacy.

## Other Forms of Search

We may add image-, video-, and news-search in the future. We may also add
'Instant Answer's.

## Technical Details

The API that fetches data from Google Search is written in Go and can be found
in `api/`. The root folder contains the Go server that utilizes this API to
handle client requests. The front-end is written in TypeScript, using NextJS:
the relevant source code can be found in `public/`.

## Screenshots

|                       |                          |                           |
|-----------------------|--------------------------|---------------------------|
| ![](/images/home.png) | ![](/images/results.png) | ![](/images/skeleton.png) |

## License

Gofë (A front-end for Google Search.)

Copyright (C) 2022 Ajay R, Tristan B

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program.  If not, see <https://www.gnu.org/licenses/>.

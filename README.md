![Visual Steiner app](./artifacts/gh_preview.svg)

[![Deployment Status](https://github.com/PieterT2000/visual-steiner/actions/workflows/deploy.yml/badge.svg)](https://github.com/PieterT2000/visual-steiner/actions/workflows/deploy.yml)
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![License][license-img]][license-url]

## Local development

```bash
npm install
npm run dev
```

## Miscellaneous

### Acknowledgements

Acknowledgement is made to [Yiannis Giannakopoulos](https://yiannisgiannakopoulos.com/) for providing theoretical guidance and feedback on the project.

### GeoSteiner Attribution

This project makes use of the [GeoSteiner](http://geosteiner.com) library, developed by [David Warme](http://www.warme.net/david/), [Pawel Winter](https://di.ku.dk/Ansatte/?pure=da/persons/86225), and [Martin Zachariasen](https://www.pure.fo/en/persons/martin-tvede-zachariasen-2), for computing Steiner minimal trees. Its license can be found [here](http://www.geosteiner.com/LICENSE).
Modifications were made to the GeoSteiner code to enable the compilation of the code to WebAssembly.

[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
[issues-img]: https://img.shields.io/github/issues/PieterT2000/visual-steiner
[issues-url]: https://github.com/PieterT2000/visual-steiner/issues
[license-img]: https://img.shields.io/badge/license-MIT-green
[license-url]: https://github.com/PieterT2000/visual-steiner/blob/main/LICENSE

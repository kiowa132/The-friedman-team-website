# Sign listing photos

One folder per listing slug: `public/images/listings/<slug>/`
(e.g. `public/images/listings/listing-1/`).

- Drop every photo for that listing in its folder. GitHub's
  **Add file → Upload files** takes a whole folder of images in one drag.
- Photos show in filename order. Name them `01.jpg`, `02.jpg`, ... to set
  the order.
- Name one `hero.jpg` (any extension) to force it as the big top image.
  Otherwise the first file is the hero.
- Compress before uploading (~1600px wide, under ~400KB each).
- `scripts/generate-listings-manifest.mjs` scans these folders on every
  build; nothing to configure.

When you re-use a slot for a new listing, delete the old folder's photos
and drop the new ones in.

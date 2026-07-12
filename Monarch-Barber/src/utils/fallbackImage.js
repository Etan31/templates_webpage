// On-brand SVG placeholder shown when a photo fails to load (ported from the design's app.js).
export const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>" +
      "<rect width='400' height='400' fill='#1a1512'/>" +
      "<g fill='none' stroke='#b8935a' stroke-width='6' stroke-linecap='round' opacity='.55' transform='translate(200 200)'>" +
      "<circle cx='-34' cy='34' r='22'/><circle cx='34' cy='34' r='22'/>" +
      "<line x1='-18' y1='18' x2='60' y2='-60'/><line x1='18' y1='18' x2='-60' y2='-60'/></g></svg>",
  )

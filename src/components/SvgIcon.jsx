const RAW_SVG_MODULES = import.meta.glob('../assets/svg/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const SVG_CACHE = new Map();

function getParsedSvg(name) {
  const cached = SVG_CACHE.get(name);
  if (cached) return cached;

  const key = `../assets/svg/${name}.svg`;
  const raw = RAW_SVG_MODULES[key];
  if (!raw) return null;

  const openTagMatch = raw.match(/<svg([^>]*)>/i);
  const attrs = openTagMatch?.[1] ?? '';

  const viewBox = attrs.match(/viewBox="([^"]+)"/i)?.[1] ?? '0 0 24 24';
  const fill = attrs.match(/fill="([^"]+)"/i)?.[1] ?? 'currentColor';
  const stroke = attrs.match(/stroke="([^"]+)"/i)?.[1];

  const innerHtml = raw
    .replace(/^[\s\S]*?<svg[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .trim();

  const parsed = { viewBox, fill, stroke, innerHtml };
  SVG_CACHE.set(name, parsed);
  return parsed;
}

export default function SvgIcon({
  name,
  className = 'w-5 h-5',
  'aria-hidden': ariaHidden = true,
}) {
  const parsed = getParsedSvg(name);

  if (!parsed) {
    return null;
  }

  return (
    <svg
      aria-hidden={ariaHidden}
      className={`inline-block shrink-0 ${className}`}
      dangerouslySetInnerHTML={{ __html: parsed.innerHtml }}
      fill={parsed.fill}
      stroke={parsed.stroke}
      viewBox={parsed.viewBox}
      xmlns="http://www.w3.org/2000/svg"
    />
  );
}

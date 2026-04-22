/**
 * Viewport-fixed starry backdrop for the home page. Content scrolls over it while
 * the field stays still (parallax / fixed-bg effect) without using background-attachment: fixed
 * (which is unreliable on iOS).
 *
 * Asset: transparent PNG; black shows through from the base layer.
 */
const STARFIELD_IMAGE = "/images/image.png";

const AMBIENT_GLOWS = `radial-gradient(circle at 20% 30%, rgba(223, 255, 0, 0.15) 0%, transparent 50%),
  radial-gradient(circle at 80% 70%, rgba(223, 255, 0, 0.08) 0%, transparent 40%)`;

export function StarfieldBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${STARFIELD_IMAGE}')` }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: AMBIENT_GLOWS }}
      />
    </div>
  );
}

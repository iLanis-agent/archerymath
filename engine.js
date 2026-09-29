/* ArcheryMath engine - honest arrow and bow math. */
(function (root) {
  "use strict";

  /* Kinetic energy in ft-lbs: grain weight and fps velocity. */
  function kineticEnergy(grains, fps) {
    if (fps <= 0) return 0;
    return Math.round((grains * fps * fps / 450240) * 10) / 10;
  }

  /* Momentum in slug-ft/s (what actually drives penetration). */
  function momentum(grains, fps) {
    return Math.round((grains * fps / 225400) * 1000) / 1000;
  }

  /* Real-world speed estimate from the IBO rating. Rules of thumb:
     -10 fps per inch of draw length under 30 (and + per inch over),
     -10 fps per 5 grains of arrow weight per pound of draw over 5 gpp,
     IBO assumes 70 lb / 30 in / 350 gr. Scale the rating by draw weight ratio. */
  function realSpeed(opts) {
    var ibo = opts && typeof opts.ibo === "number" ? opts.ibo : 330;
    var drawLb = opts && typeof opts.drawLb === "number" ? opts.drawLb : 70;
    var drawLen = opts && typeof opts.drawLen === "number" ? opts.drawLen : 30;
    var grains = opts && typeof opts.grains === "number" ? opts.grains : 350;
    var v = ibo * (drawLb / 70);
    v += (drawLen - 30) * 10;
    var gpp = grains / drawLb;
    if (gpp > 5) v -= Math.round((gpp - 5) * 2 * drawLb / 10) * 10 / 2;
    if (gpp < 3) return 0; /* unsafe: dry-fire territory */
    return Math.max(0, Math.round(v));
  }

  /* Grains per pound: under 5 is fast and loud, under 3 is dangerous. */
  function gpp(grains, drawLb) {
    return Math.round((grains / drawLb) * 100) / 100;
  }

  function gppVerdict(g) {
    if (g < 3) return "unsafe - dry-fire energy can destroy the bow";
    if (g < 5) return "fast and flat but loud and hard on the bow";
    if (g < 6.5) return "typical target setup";
    if (g < 8) return "balanced hunting weight";
    return "heavy hitter - quiet, deep penetration, more drop";
  }

  /* Front-of-center balance percent: (balancePoint - L/2) / L * 100.
     7-15% is the accepted hunting band. */
  function foc(balanceIn, arrowLenIn) {
    if (arrowLenIn <= 0) return 0;
    return Math.round(((balanceIn - arrowLenIn / 2) / arrowLenIn * 100) * 10) / 10;
  }

  function focVerdict(f) {
    if (f < 7) return "tail-heavy - broadheads will plane";
    if (f <= 15) return "in the 7-15% hunting band";
    return "nose-heavy - steering well but dropping early";
  }

  /* Static spine suggestion (lower number = stiffer) by draw weight and
     arrow length for a compound bow. Simplified chart band. */
  function spine(drawLb, arrowLenIn) {
    var base = 500;
    if (drawLb >= 70) base = 340;
    else if (drawLb >= 60) base = 400;
    else if (drawLb >= 50) base = 500;
    else if (drawLb >= 40) base = 600;
    else base = 700;
    /* Longer arrows act weaker: step stiffer past 28in, weaker under 26in */
    if (arrowLenIn >= 29) base -= 40;
    if (arrowLenIn <= 26) base += 60;
    return Math.max(250, base);
  }

  /* Arrow drop in inches at a distance, from launch speed only
     (no drag - honest at hunting ranges, pessimistic past 60yd). */
  function dropInches(fps, yards) {
    if (fps <= 0) return Infinity;
    var t = (yards * 3) / fps; /* seconds */
    return Math.round((0.5 * 386.4 * t * t) * 10) / 10; /* g = 386.4 in/s^2 */
  }

  /* Trajectory verdict at hunting range given drop. */
  function dropVerdict(inches) {
    if (inches <= 3) return "hold dead-on";
    if (inches <= 8) return "hold a hair high";
    if (inches <= 20) return "needs a real sight mark";
    return "lob it - past ethical point-blank for most hunters";
  }

  /* Total arrow weight from components (all grains). */
  function arrowWeight(opts) {
    var shaft = opts && typeof opts.shaftGpi === "number" && typeof opts.lenIn === "number" ? opts.shaftGpi * opts.lenIn : 0;
    var point = opts && typeof opts.pointGr === "number" ? opts.pointGr : 100;
    var insert = opts && typeof opts.insertGr === "number" ? opts.insertGr : 12;
    var fletch = opts && typeof opts.fletchGr === "number" ? opts.fletchGr : 9;
    var nock = opts && typeof opts.nockGr === "number" ? opts.nockGr : 10;
    return Math.round((shaft + point + insert + fletch + nock) * 10) / 10;
  }

  var api = {
    kineticEnergy: kineticEnergy,
    momentum: momentum,
    realSpeed: realSpeed,
    gpp: gpp,
    gppVerdict: gppVerdict,
    foc: foc,
    focVerdict: focVerdict,
    spine: spine,
    dropInches: dropInches,
    dropVerdict: dropVerdict,
    arrowWeight: arrowWeight
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.ArcheryMath = api;
})(typeof window !== "undefined" ? window : globalThis);

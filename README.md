# ArcheryMath

Honest math for arrow and bow setups: real-world speed from the IBO rating, kinetic energy and momentum, grains-per-pound verdicts, front-of-center balance, static spine suggestion, and arrow drop by distance.

## Run it

Static site. Open `index.html` (landing) or `app.html` (the tuner). On GitHub Pages the root serves the landing page.

## What it computes

- **Real speed** - IBO ratings assume 70 lb, 30 in, 350 gr. Every inch of draw length is about 10 fps; arrow weight above 5 grains per pound costs speed; light arrows under 3 gpp are unsafe (dry-fire energy).
- **Kinetic energy** - `grains * fps^2 / 450240` ft-lbs. Familiar, but speed-flattered.
- **Momentum** - `grains * fps / 225400` slug-ft/s. The number that tracks penetration; heavy arrows win here even when KE looks similar.
- **FOC** - balance point vs. half the arrow length. Under 7% broadheads plane; 7-15% is the hunting band; past 15% you pay in drop.
- **Spine** - a simplified static chart by draw weight with length adjustments (longer arrows act weaker).
- **Drop** - free-fall from launch speed: honest at hunting ranges, pessimistic past 60 yards since it ignores fletching drag.

## Files

- `index.html` - landing page
- `app.html` - the tuner
- `engine.js` - pure math (also usable from Node: `require('./engine.js')`)

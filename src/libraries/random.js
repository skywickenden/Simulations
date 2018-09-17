let seedCount = 0
export default function random(seed = 1) {
  let adjustedSeed = seed + seedCount;
  seedCount++;
  const x = Math.sin(adjustedSeed++) * 10000;
  let rnd = x - Math.floor(x);
  // prevent rounding errors with parseInt(random()) due to the number being too small
  if (rnd < 0.000001) rnd = 0;
  return rnd;
}

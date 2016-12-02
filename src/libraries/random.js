let seedCount = 0
export default function random(seed = 1) {
  let adjustedSeed = seed + seedCount;
  seedCount++;
  const x = Math.sin(adjustedSeed++) * 10000;
  const rnd = x - Math.floor(x);
  return rnd;
}

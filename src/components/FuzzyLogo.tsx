import FuzzyText from './FuzzyText';

/**
 * The README.me wordmark in the header, drawn by FuzzyText.
 * A wrapper because FuzzyText reads its text from React children, which Astro
 * can't pass as a plain string.
 *
 * FuzzyText pads the canvas on each side so the strips have room to shift:
 * fuzzRange + 20, plus ceil(fuzzRange / 2) + 4 when colorSplit is on, plus a 5px inset.
 * With fuzzRange 12 and colorSplit on that is 12 + 20 + 10 + 5 = 47px, so the
 * negative margins below cancel it and the wordmark lines up with the page edge.
 * Change fuzzRange or colorSplit → update the margin.
 */
export default function FuzzyLogo() {
  return (
    <FuzzyText
      className="-mx-[47px] block font-mono"
      fontSize={16}
      fontWeight={600}
      fuzzRange={12}
      baseIntensity={0.07}
      hoverIntensity={0.9}
      colorSplit={0.35}
      transitionDuration={6}
      intro
      introDuration={1600}
      clickEffect
      glitchMode
      glitchInterval={2800}
      glitchDuration={240}
    >
      README.me
    </FuzzyText>
  );
}

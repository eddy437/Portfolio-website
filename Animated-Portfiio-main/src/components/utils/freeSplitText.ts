/**
 * FreeSplitText – a free, dependency-free replacement for gsap-trial's SplitText.
 *
 * Splits text elements into chars / words / lines and exposes the resulting
 * HTMLElement arrays so they can be animated directly with GSAP (or anything
 * else).  Provides a `revert()` method that restores the original markup.
 */

type SplitTextOptions = {
  type?: string;
  linesClass?: string;
};

type OriginalEntry = { el: HTMLElement; originalHTML: string };

export class SplitText {
  chars: HTMLElement[];
  words: HTMLElement[];
  lines: HTMLElement[];

  private _originals: OriginalEntry[];

  constructor(
    target:
      | string
      | string[]
      | HTMLElement
      | HTMLElement[]
      | NodeListOf<HTMLElement>,
    options: SplitTextOptions = {}
  ) {
    this.chars = [];
    this.words = [];
    this.lines = [];
    this._originals = [];

    const linesClass = options.linesClass ?? "split-line";
    const type = options.type ?? "chars,words";
    const doChars = type.includes("chars");
    const doWords = type.includes("words");
    const doLines = type.includes("lines");

    const elements = SplitText._resolveTargets(target);
    elements.forEach((el) => {
      this._originals.push({ el, originalHTML: el.innerHTML });
      this._splitElement(el, doChars, doWords, doLines, linesClass);
    });
  }

  // ─── public ───────────────────────────────────────────────────────────────

  revert(): void {
    this._originals.forEach(({ el, originalHTML }) => {
      el.innerHTML = originalHTML;
    });
    this.chars = [];
    this.words = [];
    this.lines = [];
    this._originals = [];
  }

  // ─── private helpers ──────────────────────────────────────────────────────

  private static _resolveTargets(
    target:
      | string
      | string[]
      | HTMLElement
      | HTMLElement[]
      | NodeListOf<HTMLElement>
  ): HTMLElement[] {
    if (typeof target === "string") {
      return Array.from(document.querySelectorAll<HTMLElement>(target));
    }
    if (Array.isArray(target)) {
      return (target as Array<string | HTMLElement>).flatMap((t) =>
        typeof t === "string"
          ? Array.from(document.querySelectorAll<HTMLElement>(t))
          : [t]
      );
    }
    if (target instanceof NodeList) {
      return Array.from(target as NodeListOf<HTMLElement>);
    }
    return [target as HTMLElement];
  }

  private _splitElement(
    el: HTMLElement,
    doChars: boolean,
    doWords: boolean,
    doLines: boolean,
    linesClass: string
  ): void {
    const originalText = el.textContent ?? el.innerText ?? "";
    el.innerHTML = "";

    const wordSpans: HTMLElement[] = [];

    // Split on whitespace while keeping delimiters so spaces are preserved.
    const tokens = originalText.split(/(\s+)/);

    tokens.forEach((token) => {
      if (/^\s+$/.test(token)) {
        el.appendChild(document.createTextNode(token));
        return;
      }

      const wordSpan = document.createElement("span");
      wordSpan.style.cssText = "display:inline-block;";

      if (doChars) {
        for (const char of token) {
          const charSpan = document.createElement("span");
          charSpan.style.cssText = "display:inline-block;";
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
          this.chars.push(charSpan);
        }
      } else {
        wordSpan.textContent = token;
      }

      wordSpans.push(wordSpan);
      if (doWords) this.words.push(wordSpan);
      el.appendChild(wordSpan);
    });

    if (doLines) {
      this._wrapLines(el, wordSpans, linesClass);
    }
  }

  /**
   * Groups already-rendered word spans by their vertical position and wraps
   * each group in an overflow-hidden line container.
   * Must be called after the spans are in the DOM (so getBoundingClientRect
   * returns real values).
   */
  private _wrapLines(
    el: HTMLElement,
    wordSpans: HTMLElement[],
    linesClass: string
  ): void {
    if (wordSpans.length === 0) return;

    // Batch all rect reads first to avoid repeated layout recalculations.
    const tops = wordSpans.map((span) => span.getBoundingClientRect().top);

    // Group spans into lines using a ±2px tolerance to handle sub-pixel
    // rendering differences between spans on the same visual line.
    const TOLERANCE = 2;
    const lines: { top: number; spans: HTMLElement[] }[] = [];

    tops.forEach((top, i) => {
      const span = wordSpans[i];
      const existingLine = lines.find(
        (line) => Math.abs(line.top - top) <= TOLERANCE
      );
      if (existingLine) {
        existingLine.spans.push(span);
      } else {
        lines.push({ top, spans: [span] });
      }
    });

    lines.forEach(({ spans: spansForLine }) => {
      const lineWrapper = document.createElement("div");
      lineWrapper.className = linesClass;
      lineWrapper.style.cssText = "display:block;overflow:hidden;";

      // Insert wrapper before first span on the line, then move all spans in.
      el.insertBefore(lineWrapper, spansForLine[0]);
      spansForLine.forEach((span) => lineWrapper.appendChild(span));

      this.lines.push(lineWrapper);
    });
  }
}

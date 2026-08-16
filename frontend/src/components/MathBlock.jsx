import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function MathBlock({ math, block = true, className = '' }) {
  const html = useMemo(() => {
    if (!math) return '';
    try {
      // Clean up common LaTeX formatting issues automatically
      const cleanMath = String(math)
        .replace(/&/g, '\\&') // Escape naked ampersands
        .replace(/\\text\{([^}]*)\\\&([^}]*)\}/g, '\\text{$1 and $2}'); // Replace \text{... \& ...} with "and"

      return katex.renderToString(cleanMath, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch (error) {
      console.error("KaTeX Error on string:", math, error);
      return `<span class="font-mono text-xs">${math}</span>`;
    }
  }, [math, block]);

  return (
    <span
      className={`inline-block overflow-x-auto max-w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

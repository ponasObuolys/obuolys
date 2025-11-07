/**
 * Slate.js JSON → HTML konverteris
 *
 * Konvertuoja Slate.js editorių JSON struktūrą į HTML formatą,
 * kad būtų galima atvaizduoti su SafeRichText komponentu.
 */

interface SlateText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
}

interface SlateElement {
  type: string;
  align?: string;
  children: (SlateElement | SlateText)[];
}

type SlateNode = SlateElement | SlateText;

/**
 * Patikrina ar node yra tekstas
 */
const isText = (node: SlateNode): node is SlateText => {
  return 'text' in node;
};

/**
 * Konvertuoja teksto node su formatavimo stiliais
 */
const serializeText = (node: SlateText): string => {
  // Pakeičiame newline simbolius į <br> tagus
  let text = escapeHtml(node.text).replace(/\n/g, '<br>');

  if (node.bold) {
    text = `<strong>${text}</strong>`;
  }
  if (node.italic) {
    text = `<em>${text}</em>`;
  }
  if (node.underline) {
    text = `<u>${text}</u>`;
  }
  if (node.code) {
    text = `<code>${text}</code>`;
  }

  return text;
};

/**
 * Escape HTML simboliai
 */
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
};

/**
 * Konvertuoja elemento children į HTML
 */
const serializeChildren = (children: (SlateElement | SlateText)[]): string => {
  return children
    .map(child => {
      if (isText(child)) {
        return serializeText(child);
      }
      return serializeElement(child);
    })
    .join('');
};

/**
 * Konvertuoja Slate element į HTML tagą
 */
const serializeElement = (node: SlateElement): string => {
  const children = serializeChildren(node.children);
  const alignStyle = node.align ? ` style="text-align: ${node.align}"` : '';

  switch (node.type) {
    case 'paragraph':
      // Jei paragrafas tuščias arba turi tik <br>, grąžiname tuščią paragrafą su &nbsp;
      if (!children || children.trim() === '' || children.trim() === '<br>') {
        return `<p${alignStyle}>&nbsp;</p>`;
      }
      return `<p${alignStyle}>${children}</p>`;

    case 'heading-one':
      return `<h1${alignStyle}>${children}</h1>`;

    case 'heading-two':
      return `<h2${alignStyle}>${children}</h2>`;

    case 'heading-three':
      return `<h3${alignStyle}>${children}</h3>`;

    case 'block-quote':
      return `<blockquote${alignStyle}>${children}</blockquote>`;

    case 'bulleted-list':
      return `<ul>${children}</ul>`;

    case 'numbered-list':
      return `<ol>${children}</ol>`;

    case 'list-item':
      return `<li>${children}</li>`;

    case 'link': {
      // Paimame URL iš node (jei egzistuoja)
      const linkNode = node as SlateElement & { url?: string };
      return `<a href="${escapeHtml(linkNode.url || '')}"${alignStyle}>${children}</a>`;
    }

    default:
      // Nežinomas elementas - grąžiname kaip paragraph
      return `<p${alignStyle}>${children}</p>`;
  }
};

/**
 * Pagrindinė konvertavimo funkcija
 *
 * @param slateJson - Slate.js JSON struktūra (string arba object)
 * @returns HTML string
 */
export const slateToHtml = (slateJson: string | SlateNode[]): string => {
  try {
    // Jei jau yra HTML (prasideda <), grąžiname kaip yra
    if (typeof slateJson === 'string') {
      const trimmed = slateJson.trim();
      if (trimmed.startsWith('<')) {
        return trimmed;
      }
      // Bandome parse kaip JSON
      const parsed = JSON.parse(slateJson) as SlateNode[];
      return slateToHtml(parsed);
    }

    // Jei tuščias array, grąžiname tuščią string
    if (!Array.isArray(slateJson) || slateJson.length === 0) {
      return '';
    }

    // Konvertuojame kiekvieną root-level node
    return slateJson
      .map(node => {
        if (isText(node)) {
          return serializeText(node);
        }
        return serializeElement(node);
      })
      .join('');

  } catch (error) {
    // Jei įvyksta klaida konvertuojant, ignoruojame ją tyliai
    // Produkcinėje aplinkoje būtų siunčiama į išorinį logavimo servisą
    if (error instanceof Error) {
      // Galima būtų naudoti secureLogger.error()
    }
    // Jei nepavyko parse, grąžiname originalų stringą
    return typeof slateJson === 'string' ? slateJson : '';
  }
};

/**
 * Patikrina ar turinys yra Slate JSON formato
 */
export const isSlateJson = (content: string): boolean => {
  if (!content || typeof content !== 'string') {
    return false;
  }

  const trimmed = content.trim();

  // Jei prasideda HTML tagu, tai ne Slate JSON
  if (trimmed.startsWith('<')) {
    return false;
  }

  // Bandome parse kaip JSON
  try {
    const parsed = JSON.parse(trimmed);
    // Slate JSON visada yra array su objects, turinčiais type ir children
    return Array.isArray(parsed) &&
           parsed.length > 0 &&
           typeof parsed[0] === 'object' &&
           'type' in parsed[0] &&
           'children' in parsed[0];
  } catch {
    return false;
  }
};

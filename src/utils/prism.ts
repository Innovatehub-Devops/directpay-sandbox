
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';

export const highlightCode = (code: string, language = 'javascript'): string => {
  try {
    if (Prism.languages[language]) {
      return Prism.highlight(code, Prism.languages[language], language);
    } else {
      return Prism.highlight(code, Prism.languages.javascript, 'javascript');
    }
  } catch (error) {
    console.error('Error highlighting code:', error);
    return code;
  }
};

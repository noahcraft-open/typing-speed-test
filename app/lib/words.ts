// Common English words grouped by difficulty
export const EASY_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
]

export const MEDIUM_WORDS = [
  'program', 'system', 'function', 'object', 'variable', 'method', 'class', 'string',
  'number', 'array', 'boolean', 'return', 'import', 'export', 'default', 'const',
  'interface', 'module', 'package', 'server', 'client', 'request', 'response', 'error',
  'database', 'query', 'table', 'index', 'column', 'record', 'update', 'delete',
  'create', 'select', 'insert', 'filter', 'reduce', 'promise', 'async', 'await',
  'component', 'element', 'render', 'state', 'props', 'effect', 'context', 'router',
  'deploy', 'build', 'compile', 'debug', 'refactor', 'commit', 'branch', 'merge',
  'feature', 'release', 'version', 'config', 'setting', 'option', 'plugin', 'library',
  'framework', 'template', 'layout', 'design', 'pattern', 'service', 'handler', 'middleware',
  'endpoint', 'payload', 'header', 'token', 'session', 'cookie', 'cache', 'buffer',
]

export const HARD_WORDS = [
  'asynchronous', 'authentication', 'authorization', 'encapsulation', 'polymorphism',
  'infrastructure', 'microservices', 'containerization', 'orchestration', 'virtualization',
  'serialization', 'deserialization', 'implementation', 'configuration', 'documentation',
  'optimization', 'performance', 'accessibility', 'internationalization', 'localization',
  'cryptocurrency', 'decentralized', 'cryptographic', 'deterministic', 'idempotent',
  'reconciliation', 'normalization', 'denormalization', 'transpilation', 'minification',
  'interpolation', 'extrapolation', 'concatenation', 'fragmentation', 'segmentation',
  'instantiation', 'initialization', 'synchronization', 'parallelization', 'multithreading',
  'observability', 'instrumentation', 'benchmarking', 'provisioning', 'decommissioning',
  'compatibility', 'interoperability', 'extensibility', 'maintainability', 'scalability',
]

export const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "The best error message is the one that never shows up.",
  "Make it work, make it right, make it fast.",
  "Simplicity is the soul of efficiency.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Programming isn't about what you know; it's about what you can figure out.",
  "The most important property of a program is whether it accomplishes the intention of its user.",
  "Sometimes it pays to stay in bed on Monday rather than spending the rest of the week debugging Monday's code.",
  "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
  "Talk is cheap. Show me the code.",
  "Programs must be written for people to read and only incidentally for machines to execute.",
  "The function of good software is to make the complex appear to be simple.",
]

export type Difficulty = 'easy' | 'medium' | 'hard' | 'quotes'
export type Duration = 15 | 30 | 60 | 120

export function generateText(difficulty: Difficulty, targetWords: number = 80): string {
  if (difficulty === 'quotes') {
    // Concatenate random quotes until we have enough text
    const shuffled = [...QUOTES].sort(() => Math.random() - 0.5)
    let text = ''
    let i = 0
    while (text.split(' ').length < targetWords) {
      text += (text ? ' ' : '') + shuffled[i % shuffled.length]
      i++
    }
    return text
  }

  const wordPool = difficulty === 'easy' ? EASY_WORDS
    : difficulty === 'medium' ? MEDIUM_WORDS
    : HARD_WORDS

  const words: string[] = []
  for (let i = 0; i < targetWords; i++) {
    words.push(wordPool[Math.floor(Math.random() * wordPool.length)])
  }
  return words.join(' ')
}

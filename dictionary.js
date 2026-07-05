const languageData = {
    "java": {
        keywords: [
            // Control flow & keywords
            'break', 'continue', 'for()', 'while()', 'return', 'if()', 'else',
            // Primitives & Core types
            'int', 'double', 'boolean', 'char', 'long', 'void', 'String', 'Math', 'System',
            // Core DSA Structures
            'List<>', 'ArrayList<>', 'LinkedList<>', 'Map<>', 'HashMap<>', 'TreeMap<>',
            'Set<>', 'HashSet<>', 'TreeSet<>', 'Queue<>', 'PriorityQueue<>', 'Deque<>', 'ArrayDeque<>',
            'Stack<>', 'ListNode', 'TreeNode', 'StringBuilder',
            // String Methods
            'length()', 'charAt()', 'substring()', 'indexOf()', 'lastIndexOf()', 'equals()', 'equalsIgnoreCase()',
            'compareTo()', 'split()', 'replace()', 'replaceAll()', 'trim()', 'startsWith()', 'endsWith()', 'toCharArray()',
            // Collection Methods
            'size()', 'isEmpty()', 'clear()', 'contains()', 'containsKey()', 'containsValue()',
            'put()', 'putIfAbsent()', 'computeIfAbsent()', 'get()', 'getOrDefault()', 'remove()',
            'add()', 'addAll()', 'poll()', 'peek()', 'push()', 'pop()', 'offer()', 'offerFirst()', 'offerLast()',
            'pollFirst()', 'pollLast()', 'peekFirst()', 'peekLast()', 'keySet()', 'values()', 'entrySet()',
            // Treemap/Treeset specific
            'firstKey()', 'lastKey()', 'higherKey()', 'lowerKey()', 'ceilingKey()', 'floorKey()',
            'firstEntry()', 'lastEntry()', 'higherEntry()', 'lowerEntry()', 'ceilingEntry()', 'floorEntry()',
            // Arrays & Collections utils
            'Arrays.sort()', 'Arrays.fill()', 'Arrays.binarySearch()', 'Arrays.copyOf()', 'Arrays.copyOfRange()', 'Arrays.asList()',
            'Collections.sort()', 'Collections.reverse()', 'Collections.max()', 'Collections.min()', 'Collections.swap()',
            'Collections.reverseOrder()', 'Collections.frequency()', 'Collections.shuffle()',
            // Math Methods
            'Math.max()', 'Math.min()', 'Math.abs()', 'Math.pow()', 'Math.sqrt()', 'Math.ceil()', 'Math.floor()',
            'Math.round()', 'Math.log()', 'Math.log10()', 'Math.gcd()',
            // Wrapper helpers
            'Integer.parseInt()', 'Integer.compare()', 'Integer.toString()', 'Integer.MAX_VALUE', 'Integer.MIN_VALUE',
            'Long.parseLong()', 'Long.compare()', 'Long.toString()', 'Long.MAX_VALUE', 'Long.MIN_VALUE',
            'Character.isDigit()', 'Character.isLetter()', 'Character.isLetterOrDigit()', 'Character.isWhitespace()',
            'Character.toLowerCase()', 'Character.toUpperCase()', 'String.valueOf()', 'String.join()'
        ],
        bigrams: {
            // Markov Bigram (1-word state transitions)
            'for': ['(int i = 0; i < ; i++) {'],
            'if': ['( ) {'],
            'while': ['( ) {'],
            'public': ['static', 'void', 'int', 'String', 'boolean', 'List<>', 'final', 'class'],
            'private': ['void', 'int', 'String', 'boolean', 'ListNode', 'TreeNode'],
            'static': ['void', 'int', 'boolean', 'String', 'class'],
            'return': ['true;', 'false;', '0;', '1;', 'ans;', 'res;', 'null;', 'root;', 'new ', '-1;', 'count;'],
            'new': ['ArrayList<>()', 'HashMap<>()', 'HashSet<>()', 'StringBuilder()', 'PriorityQueue<>()', 'int[', 'ListNode(', 'TreeNode('],
            'arrays.': ['sort(', 'fill(', 'binarySearch(', 'toString(', 'copyOf(', 'copyOfRange(', 'asList('],
            'collections.': ['sort(', 'reverse(', 'max(', 'min(', 'shuffle(', 'swap(', 'reverseOrder(', 'frequency('],
            'math.': ['max(', 'min(', 'abs(', 'pow(', 'sqrt(', 'ceil(', 'floor(', 'log(', 'log10('],
            'character.': ['isDigit(', 'isLetter(', 'isLetterOrDigit(', 'isWhitespace(', 'toLowerCase(', 'toUpperCase('],
            'integer.': ['parseInt(', 'compare(', 'MAX_VALUE', 'MIN_VALUE', 'toString('],
            'long.': ['parseLong(', 'compare(', 'MAX_VALUE', 'MIN_VALUE', 'toString('],
            'string.': ['valueOf(', 'join('],
            // Markov Trigram (2-word state transitions)
            'public static': ['void', 'int', 'String', 'boolean', 'double'],
            'static void': ['main(', 'solve(', 'dfs(', 'bfs('],
            'for (int': ['i = 0;', 'j = 0;', 'k = 0;'],
            'while (!': ['queue.isEmpty()', 'stack.isEmpty()', 'q.isEmpty()', 's.isEmpty()'],
            'if (root': ['== null)', '!= null)']
        }
    },

    "c++": {
        keywords: [
            // Control flow & keywords
            'break', 'continue', 'for()', 'while()', 'return', 'if()', 'else',
            // Primitives & structures
            'int', 'long long', 'double', 'char', 'bool', 'string', 'void', 'auto',
            'vector<>', 'unordered_map<>', 'unordered_set<>', 'map<>', 'set<>',
            'queue<>', 'priority_queue<>', 'stack<>', 'pair<>',
            // STL Methods & Algorithms
            'push_back()', 'pop_back()', 'push()', 'pop()', 'top()', 'front()', 'back()',
            'insert()', 'erase()', 'empty()', 'size()', 'clear()', 'begin()', 'end()',
            'find()', 'count()', 'lower_bound()', 'upper_bound()',
            'std::sort()', 'std::reverse()', 'std::fill()', 'std::memset()',
            'std::min()', 'std::max()', 'std::abs()', 'std::swap()',
            'substr()', 'stoi()', 'to_string()', 'INT_MAX', 'INT_MIN'
        ],
        bigrams: {
            'for': ['(int i = 0; i < ; i++) {'],
            'if': ['( ) {'],
            'while': ['( ) {'],
            'std::': ['vector<', 'string', 'unordered_map<', 'unordered_set<', 'sort()', 'min', 'max'],
            'vector<': ['int>', 'string>', 'vector<int>>', 'bool>'],
            'unordered_map<': ['int, int>', 'char, int>', 'string, int>'],
            'unordered_set<': ['int>', 'char>', 'string>'],
            'auto': ['it =', 'i = 0;', 'x : '],
            'const': ['int', 'auto&'],
            '#include': ['<iostream>', '<vector>', '<string>', '<algorithm>', '<unordered_map>', '<unordered_set>', '<queue>', '<stack>', '<bits/stdc++.h>'],
            'using': ['namespace std;'],
            'return': ['0;', 'true;', 'false;', 'ans;', 'res;', '-1;', 'nullptr;'],
            // Markov Trigrams
            'for (int': ['i = 0;', 'j = 0;'],
            'while (!': ['q.empty()', 's.empty()'],
            'if (root': ['== nullptr)', '!= nullptr)']
        }
    },

    "mysql": {
        keywords: [
            'SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'LIMIT', 'AS', 'AND', 'OR', 'NOT',
            'COUNT()', 'SUM()', 'AVG()', 'MIN()', 'MAX()', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
        ],
        bigrams: {
            'SELECT': ['*', 'COUNT(*)', 'DISTINCT', 'id'],
            'WHERE': ['id =', 'status ='],
            'GROUP': ['BY '],
            'ORDER': ['BY '],
            'ON': ['a.id = b.id'],
            'inner join': ['users', 'orders']
        }
    },

    "python": {
        keywords: [
            'int', 'str', 'bool', 'list', 'dict', 'set', 'tuple', 'None',
            'collections.Counter', 'collections.deque', 'collections.defaultdict',
            'heapq.heappush', 'heapq.heappop', 'heapq.heapify', 'math.sqrt',
            'abs()', 'min()', 'max()', 'sum()', 'len()', 'sorted()', 'range()',
            'append()', 'pop()', 'insert()', 'remove()', 'split()', 'join()',
            'def', 'class', 'import', 'return', 'if', 'else', 'for', 'while', 'in',
            'break', 'continue'
        ],
        bigrams: {
            'for': ['i in range():'],
            'def': ['solve(self,', 'dfs(node):', '__init__(self):'],
            'import': ['heapq', 'collections', 'math'],
            'collections.': ['defaultdict(list)', 'defaultdict(int)', 'Counter()', 'deque()'],
            'heapq.': ['heappush(heap, ', 'heappop(heap)'],
            'return': ['True', 'False', 'None', 'ans', '-1', '0'],
            // Markov Trigrams
            'for i': ['in range(', 'in enumerate('],
            'if not': ['root:', 'visited:']
        }
    },

    "javascript": {
        keywords: [
            'Array', 'Map', 'Set', 'Math', 'undefined', 'null',
            'Math.max()', 'Math.min()', 'Math.abs()', 'Math.floor()', 'Math.ceil()', 'Math.sqrt()',
            'push()', 'pop()', 'shift()', 'unshift()', 'slice()', 'splice()', 'join()', 'split()',
            'set()', 'get()', 'has()', 'delete()', 'add()', 'clear()', 'size',
            'const', 'let', 'function', 'return', 'if()', 'else', 'for()', 'while()', 'new',
            'break', 'continue'
        ],
        bigrams: {
            'for': ['(let i = 0; i < ; i++) {'],
            'if': ['( ) {'],
            'while': ['( ) {'],
            'const': ['map = new Map();', 'set = new Set();', 'n = ', 'dp = ', 'queue = [];'],
            'let': ['ans = ', 'res = ', 'count = 0;', 'i = 0;'],
            'new': ['Map()', 'Set()', 'Array()'],
            'return': ['true;', 'false;', 'null;', 'ans;', '-1;', '0;'],
            // Markov Trigrams
            'for (let': ['i = 0;', 'j = 0;']
        }
    }
};

languageData["python3"] = languageData["python"];
languageData["js"] = languageData["javascript"];
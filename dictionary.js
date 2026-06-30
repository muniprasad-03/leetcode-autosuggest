// ============================================================================
// LIGHTWEIGHT DSA & COMPETITIVE PROGRAMMING DICTIONARIES & N-GRAMS
// ============================================================================

const languageData = {
    "java": {
        keywords: [
            // Primitives & Core
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
            // Treemap/Treeset specific (very common in range queries)
            'firstKey()', 'lastKey()', 'higherKey()', 'lowerKey()', 'ceilingKey()', 'floorKey()',
            'firstEntry()', 'lastEntry()', 'higherEntry()', 'lowerEntry()', 'ceilingEntry()', 'floorEntry()',
            // Arrays & Collections utils
            'Arrays.sort()', 'Arrays.fill()', 'Arrays.binarySearch()', 'Arrays.copyOf()', 'Arrays.copyOfRange()', 'Arrays.asList()',
            'Collections.sort()', 'Collections.reverse()', 'Collections.max()', 'Collections.min()', 'Collections.swap()', 
            'Collections.reverseOrder()', 'Collections.frequency()',
            // Math Methods
            'Math.max()', 'Math.min()', 'Math.abs()', 'Math.pow()', 'Math.sqrt()', 'Math.ceil()', 'Math.floor()', 
            'Math.round()', 'Math.log()', 'Math.log10()', 'Math.gcd()',
            // Wrapper helper methods
            'Integer.parseInt()', 'Integer.compare()', 'Integer.toString()', 'Integer.MAX_VALUE', 'Integer.MIN_VALUE',
            'Long.parseLong()', 'Long.compare()', 'Long.toString()', 'Long.MAX_VALUE', 'Long.MIN_VALUE',
            'Character.isDigit()', 'Character.isLetter()', 'Character.isLetterOrDigit()', 'Character.isWhitespace()',
            'Character.toLowerCase()', 'Character.toUpperCase()', 'String.valueOf()', 'String.join()'
        ],
        bigrams: {
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
            'string.': ['valueOf(', 'join(']
        }
    },

    "c++": {
        keywords: [
            // Core DSA types
            'int', 'long long', 'double', 'char', 'bool', 'string', 'void', 'auto',
            'vector<>', 'unordered_map<>', 'unordered_set<>', 'map<>', 'set<>',
            'queue<>', 'priority_queue<>', 'stack<>', 'pair<>', 'tuple<>', 'list<>', 'deque<>',
            // STL Methods
            'push_back()', 'pop_back()', 'emplace_back()', 'push()', 'pop()', 'top()', 'front()', 'back()', 
            'insert()', 'erase()', 'empty()', 'size()', 'clear()', 'begin()', 'end()', 'rbegin()', 'rend()',
            'find()', 'count()', 'lower_bound()', 'upper_bound()', 'equal_range()', 'assign()', 'resize()', 'reserve()',
            // STL Algorithms & Utilities
            'std::sort()', 'std::reverse()', 'std::fill()', 'std::memset()', 'std::memcpy()', 
            'std::min()', 'std::max()', 'std::abs()', 'std::swap()', 'std::accumulate()', 
            'std::lower_bound()', 'std::upper_bound()', 'std::binary_search()', 'std::next_permutation()', 'std::prev_permutation()',
            'std::min_element()', 'std::max_element()', 'std::nth_element()', 'std::stable_sort()', 'std::iota()',
            'std::make_pair()', 'std::make_tuple()', 'std::tie()', 'std::get<>', 'std::gcd()', 'std::lcm()',
            // String helpers
            'substr()', 'stoi()', 'stoll()', 'to_string()', 'length()', 'append()', 'compare()',
            // Limits & Char helpers
            'INT_MAX', 'INT_MIN', 'LLONG_MAX', 'LLONG_MIN', 'std::tolower()', 'std::toupper()',
            'std::isdigit()', 'std::isalpha()', 'std::isalnum()', 'std::isspace()'
        ],
        bigrams: {
            'std::': ['vector<', 'string', 'unordered_map<', 'unordered_set<', 'cout', 'cin', 'endl', 'sort()', 'make_pair()', 'min', 'max', 'abs', 'tolower', 'toupper', 'isdigit', 'isalpha', 'isalnum', 'gcd', 'lcm', 'accumulate'],
            'vector<': ['int>', 'string>', 'vector<int>>', 'char>', 'pair<int, int>>', 'bool>', 'long long>'],
            'unordered_map<': ['int, int>', 'char, int>', 'string, int>', 'int, vector<int>>', 'long long, int>'],
            'unordered_set<': ['int>', 'char>', 'string>', 'long long>'],
            'auto': ['it =', 'i = 0;', 'x : ', ' [a, b] = ', ' &[a, b] = '],
            'const': ['int', 'auto&', 'string&', 'char'],
            '#include': ['<iostream>', '<vector>', '<string>', '<algorithm>', '<unordered_map>', '<unordered_set>', '<queue>', '<stack>', '<numeric>', '<cmath>', '<bits/stdc++.h>'],
            'using': ['namespace std;'],
            'return': ['0;', 'true;', 'false;', 'ans;', 'res;', '-1;', 'nullptr;'],
            'priority_queue<': ['int>', 'int, vector<int>, greater<int>>']
        }
    },

    "mysql": {
        keywords: [
            // Core Query Structure
            'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'ON', 'GROUP BY', 'ORDER BY', 
            'HAVING', 'LIMIT', 'OFFSET', 'AS', 'AND', 'OR', 'NOT', 'IS NULL', 'IS NOT NULL', 'BETWEEN', 'LIKE', 'DISTINCT', 'UNION', 'ALL',
            // Aggregates & Functions
            'COUNT()', 'SUM()', 'AVG()', 'MIN()', 'MAX()', 'COALESCE()', 'IFNULL()', 'NULLIF()',
            'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IF()',
            // String Functions
            'CONCAT()', 'SUBSTRING()', 'LENGTH()', 'CHAR_LENGTH()', 'LOWER()', 'UPPER()', 'TRIM()', 'REPLACE()',
            // Date & Time Functions
            'NOW()', 'CURDATE()', 'DATE_ADD()', 'DATE_SUB()', 'DATEDIFF()', 'DATE_FORMAT()', 'YEAR()', 'MONTH()', 'DAY()',
            // Math Functions
            'ROUND()', 'FLOOR()', 'CEIL()', 'ABS()', 'MOD()'
        ],
        bigrams: {
            'SELECT': ['*', 'COUNT(*)', 'DISTINCT', 'id', 'COUNT(1)', 'ROUND(', 'COALESCE(', 'IFNULL('],
            'WHERE': ['id =', 'status =', 'deleted_at IS NULL'],
            'GROUP': ['BY '],
            'ORDER': ['BY '],
            'INNER': ['JOIN '],
            'LEFT': ['JOIN '],
            'ON': ['a.id = b.id', 'o.user_id = u.id'],
            'IS': ['NULL', 'NOT NULL'],
            'CASE': ['WHEN ']
        }
    },

    "python": {
        keywords: [
            // Core Types
            'int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple', 'None', 'True', 'False',
            // DSA libs
            'collections.Counter', 'collections.deque', 'collections.defaultdict', 'collections.OrderedDict',
            'heapq.heappush', 'heapq.heappop', 'heapq.heapify', 'heapq.heappushpop', 'heapq.nlargest', 'heapq.nsmallest',
            'bisect.bisect_left', 'bisect.bisect_right', 'bisect.insort_left', 'bisect.insort_right',
            'math.sqrt', 'math.gcd', 'math.lcm', 'math.inf', 'math.ceil', 'math.floor', 'math.pow', 'math.log', 'math.comb',
            // Built-in functions
            'abs()', 'min()', 'max()', 'sum()', 'len()', 'sorted()', 'enumerate()', 'zip()', 'range()', 'reversed()',
            'any()', 'all()', 'map()', 'filter()', 'divmod()', 'pow()',
            // List / Dict / Set operations
            'append()', 'pop()', 'insert()', 'remove()', 'extend()', 'clear()', 'index()', 'count()', 'sort()', 'reverse()',
            'split()', 'join()', 'strip()', 'replace()', 'find()', 'startswith()', 'endswith()', 'lower()', 'upper()',
            'isdigit()', 'isalpha()', 'isalnum()', 'islower()', 'isupper()',
            'keys()', 'values()', 'items()', 'get()', 'setdefault()', 'update()', 'add()', 'discard()', 'union()', 'intersection()',
            // Keywords
            'def', 'class', 'import', 'return', 'yield', 'lambda', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 
            'pass', 'try', 'except', 'raise', 'in', 'is', 'not', 'and', 'or', 'global', 'nonlocal'
        ],
        bigrams: {
            'def': ['solve(self,', 'dfs(node):', 'bfs(queue):', '__init__(self):'],
            'import': ['heapq', 'collections', 'math', 'sys', 'bisect'],
            'from': ['collections import ', 'heapq import ', 'bisect import ', 'functools import '],
            'collections.': ['defaultdict(list)', 'defaultdict(int)', 'defaultdict(set)', 'Counter()', 'deque()'],
            'heapq.': ['heappush(heap, ', 'heappop(heap)', 'heapify(arr)', 'heappushpop(heap, ', 'nlargest(', 'nsmallest('],
            'bisect.': ['bisect_left(arr, ', 'bisect_right(arr, ', 'insort_left(arr, ', 'insort_right(arr, '],
            'self.': ['dfs(', 'visited = ', 'dp = ', 'memo = {}'],
            'return': ['True', 'False', 'None', 'ans', 'res', '-1', '0']
        }
    },

    "javascript": {
        keywords: [
            // Core Types & Constants
            'Array', 'Map', 'Set', 'Math', 'undefined', 'null', 'NaN', 'Infinity', '-Infinity',
            // Math Methods
            'Math.max()', 'Math.min()', 'Math.abs()', 'Math.floor()', 'Math.ceil()', 'Math.round()', 
            'Math.sqrt()', 'Math.pow()', 'Math.log()', 'Math.log2()', 'Math.log10()',
            'Number.MAX_SAFE_INTEGER', 'Number.MIN_SAFE_INTEGER',
            // Array Methods
            'push()', 'pop()', 'shift()', 'unshift()', 'slice()', 'splice()', 'concat()', 'join()', 'reverse()', 'sort()',
            'indexOf()', 'lastIndexOf()', 'includes()', 'find()', 'findIndex()', 'forEach()', 'map()', 'filter()', 'reduce()',
            'some()', 'every()', 'fill()', 'flat()', 'flatMap()',
            // String Methods
            'split()', 'substring()', 'toLowerCase()', 'toUpperCase()', 'trim()', 'replace()', 'replaceAll()', 
            'charCodeAt()', 'fromCharCode()', 'startsWith()', 'endsWith()',
            // Map & Set Methods
            'set()', 'get()', 'has()', 'delete()', 'add()', 'clear()', 'size', 'keys()', 'values()', 'entries()',
            // Priority Queue (LeetCode JS Environment)
            'MinPriorityQueue()', 'MaxPriorityQueue()',
            // Keywords & Declarations
            'const', 'let', 'function', 'return', 'if', 'else', 'for', 'while', 'break', 'continue', 'new', 'this', 'typeof'
        ],
        bigrams: {
            'const': ['map = new Map();', 'set = new Set();', 'n = ', 'dp = ', 'visited = new Set();', 'queue = [];', 'stack = [];'],
            'let': ['ans = ', 'res = ', 'count = 0;', 'i = 0;', 'j = 0;', 'min = Infinity;', 'max = -Infinity;'],
            'new': ['Map()', 'Set()', 'Array()', 'MinPriorityQueue()', 'MaxPriorityQueue()'],
            'return': ['true;', 'false;', 'null;', 'ans;', 'res;', '-1;', '0;'],
            'math.': ['max(', 'min(', 'abs(', 'floor(', 'ceil(', 'sqrt(', 'pow(', 'log(']
        }
    }
};

// Aliases/Fallbacks
languageData["python3"] = languageData["python"];
languageData["js"] = languageData["javascript"];
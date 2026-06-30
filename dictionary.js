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
            // DSA Methods
            'length()', 'size()', 'charAt()', 'substring()', 'indexOf()', 'equals()', 'compareTo()',
            'put()', 'get()', 'getOrDefault()', 'remove()', 'add()', 'poll()', 'peek()', 'push()', 'pop()',
            'isEmpty()', 'clear()', 'keySet()', 'values()', 'sort()', 'fill()', 'binarySearch()', 
            'toCharArray()', 'max()', 'min()', 'abs()', 'pow()', 'sqrt()',
            // Algorithmic limits / helpers
            'Integer.parseInt()', 'Integer.compare()', 'Integer.MAX_VALUE', 'Integer.MIN_VALUE',
            'Character.isDigit()', 'Character.isLetter()', 'Character.isLetterOrDigit()',
            'Math.max()', 'Math.min()', 'Math.abs()', 'Math.pow()', 'Math.sqrt()'
        ],
        bigrams: {
            'public': ['static', 'void', 'int', 'String', 'boolean', 'List<>', 'final', 'class'],
            'private': ['void', 'int', 'String', 'boolean', 'ListNode', 'TreeNode'],
            'static': ['void', 'int', 'boolean', 'String', 'class'],
            'return': ['true;', 'false;', '0;', '1;', 'ans;', 'res;', 'null;', 'root;', 'new ', '-1;', 'count;'],
            'new': ['ArrayList<>()', 'HashMap<>()', 'HashSet<>()', 'StringBuilder()', 'PriorityQueue<>()', 'int[', 'ListNode(', 'TreeNode('],
            'arrays.': ['sort(', 'fill(', 'binarySearch(', 'toString(', 'copyOf('],
            'collections.': ['sort(', 'reverse(', 'max(', 'min(', 'shuffle('],
            'math.': ['max(', 'min(', 'abs(', 'pow(', 'sqrt('],
            'character.': ['isDigit(', 'isLetter(', 'isLetterOrDigit(', 'toLowerCase(', 'toUpperCase('],
            'integer.': ['parseInt(', 'compare(', 'MAX_VALUE', 'MIN_VALUE']
        }
    },

    "c++": {
        keywords: [
            // Core DSA types
            'int', 'long long', 'double', 'char', 'bool', 'string', 'void', 'auto',
            'vector<>', 'unordered_map<>', 'unordered_set<>', 'map<>', 'set<>',
            'queue<>', 'priority_queue<>', 'stack<>', 'pair<>', 'tuple<>',
            // STL Methods & Algorithms
            'push_back()', 'pop_back()', 'push()', 'pop()', 'top()', 'front()', 'back()', 'insert()', 'erase()', 
            'empty()', 'size()', 'clear()', 'begin()', 'end()', 'find()', 'count()', 
            'sort()', 'reverse()', 'lower_bound()', 'upper_bound()', 'next_permutation()', 'make_pair()',
            'min()', 'max()', 'abs()', 'swap()', 'substr()', 'stoi()', 'to_string()',
            // Limits & extra functions
            'INT_MAX', 'INT_MIN', 'LLONG_MAX', 'LLONG_MIN', 'std::max()', 'std::min()', 'std::abs()'
        ],
        bigrams: {
            'std::': ['vector<', 'string', 'unordered_map<', 'unordered_set<', 'cout', 'cin', 'endl', 'sort()', 'make_pair()', 'min', 'max', 'abs'],
            'vector<': ['int>', 'string>', 'vector<int>>', 'char>', 'pair<int, int>>', 'bool>'],
            'unordered_map<': ['int, int>', 'char, int>', 'string, int>', 'int, vector<int>>'],
            'unordered_set<': ['int>', 'char>', 'string>'],
            'auto': ['it =', 'i = 0;', 'x : ', ' [a, b] = '],
            'const': ['int', 'auto&', 'string&'],
            '#include': ['<iostream>', '<vector>', '<string>', '<algorithm>', '<unordered_map>', '<unordered_set>', '<queue>', '<stack>', '<bits/stdc++.h>'],
            'using': ['namespace std;'],
            'return': ['0;', 'true;', 'false;', 'ans;', 'res;', '-1;', 'nullptr;'],
            'priority_queue<': ['int>', 'int, vector<int>, greater<int>>']
        }
    },

    "mysql": {
        keywords: [
            // Core Query Structure
            'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'AS', 'AND', 'OR', 'NOT',
            'IS NULL', 'IS NOT NULL', 'BETWEEN', 'LIKE', 'DISTINCT', 'UNION', 'ALL',
            // Aggregates & Functions
            'COUNT()', 'SUM()', 'AVG()', 'MIN()', 'MAX()', 'COALESCE()', 'IFNULL()', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
            // String & Date
            'CONCAT()', 'SUBSTRING()', 'LENGTH()', 'NOW()', 'DATEDIFF()', 'DATE_FORMAT()'
        ],
        bigrams: {
            'SELECT': ['*', 'COUNT(*)', 'DISTINCT', 'id', 'COUNT(1)'],
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
            'collections.Counter', 'collections.deque', 'collections.defaultdict',
            'heapq.heappush', 'heapq.heappop', 'heapq.heapify',
            'bisect.bisect_left', 'bisect.bisect_right',
            'math.sqrt', 'math.gcd', 'math.inf',
            // Built-in functions
            'abs()', 'min()', 'max()', 'sum()', 'len()', 'sorted()', 'enumerate()', 'zip()', 'range()',
            // List & dict operations
            'append()', 'pop()', 'insert()', 'remove()', 'extend()', 'split()', 'join()',
            // Keywords
            'def', 'class', 'import', 'return', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'pass', 'in', 'is', 'not', 'and', 'or'
        ],
        bigrams: {
            'def': ['solve(self,', 'dfs(node):', 'bfs(queue):', '__init__(self):'],
            'import': ['heapq', 'collections', 'math', 'bisect'],
            'from': ['collections import ', 'heapq import ', 'bisect import '],
            'collections.': ['defaultdict(list)', 'defaultdict(int)', 'defaultdict(set)', 'Counter()', 'deque()'],
            'heapq.': ['heappush(heap, ', 'heappop(heap)', 'heapify(arr)'],
            'bisect.': ['bisect_left(arr, ', 'bisect_right(arr, '],
            'self.': ['dfs(', 'visited = ', 'dp = '],
            'return': ['True', 'False', 'None', 'ans', 'res', '-1', '0']
        }
    },

    "javascript": {
        keywords: [
            // Core
            'Array', 'Map', 'Set', 'Math', 'undefined', 'null',
            // Math Methods
            'Math.max()', 'Math.min()', 'Math.abs()', 'Math.floor()', 'Math.ceil()', 'Math.sqrt()', 'Math.pow()',
            // Methods
            'push()', 'pop()', 'shift()', 'unshift()', 'slice()', 'splice()', 'concat()', 'join()', 'split()', 'indexOf()',
            'includes()', 'map()', 'filter()', 'reduce()', 'forEach()', 'some()', 'every()', 'sort()', 'reverse()',
            // Keywords & Declarations
            'const', 'let', 'function', 'return', 'if', 'else', 'for', 'while', 'break', 'continue', 'new', 'this'
        ],
        bigrams: {
            'const': ['map = new Map();', 'set = new Set();', 'n = ', 'dp = ', 'visited = new Set();', 'queue = [];'],
            'let': ['ans = ', 'res = ', 'count = 0;', 'i = 0;', 'j = 0;'],
            'new': ['Map()', 'Set()', 'Array()', 'MinPriorityQueue()', 'MaxPriorityQueue()'],
            'return': ['true;', 'false;', 'null;', 'ans;', 'res;', '-1;', '0;'],
            'math.': ['max(', 'min(', 'abs(', 'floor(', 'ceil(', 'sqrt(', 'pow(']
        }
    }
};

// Aliases/Fallbacks
languageData["python3"] = languageData["python"];
languageData["js"] = languageData["javascript"];
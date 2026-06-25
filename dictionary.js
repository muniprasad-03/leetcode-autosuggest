// dictionary.js

const commonDataTypes = [
    // 1. Primitives & Wrappers
    'int', 'float', 'double', 'boolean', 'char', 'byte', 'short', 'long',
    'Integer', 'Double', 'Boolean', 'Character', 'Long', 'String',

    // 2. LeetCode Custom Classes
    'ListNode', 'TreeNode', 'Pair<>', 'TrieNode', 'Node',

    // 3. Java Collections Framework (Interfaces & Implementations)
    'Collection<>', 'Iterable<>', 'Iterator<>', 'ListIterator<>',
    'List<>', 'ArrayList<>', 'LinkedList<>', 'Vector<>', 'Stack<>',
    'Set<>', 'HashSet<>', 'LinkedHashSet<>', 'TreeSet<>', 'EnumSet<>',
    'Map<>', 'HashMap<>', 'LinkedHashMap<>', 'TreeMap<>', 'Hashtable<>', 'EnumMap<>', 'Map.Entry<>',
    'Queue<>', 'Deque<>', 'PriorityQueue<>', 'ArrayDeque<>', 'BitSet',
    
    // 4. Utility, Math & Concurrency Classes
    'Math', 'Arrays', 'Collections', 'StringBuilder', 'StringBuffer', 'Scanner',
    'Random', 'StringJoiner', 'System', 'out', 'println()', 'print()',
    'BigInteger', 'BigDecimal', 'Objects', 'AtomicInteger', 'AtomicLong',

    // 5. Common Built-in Methods
    
    // --- General / String / Array ---
    'length()', 'size()', 'charAt()', 'substring()', 'indexOf()', 'lastIndexOf()', 'split()', 
    'equals()', 'equalsIgnoreCase()', 'compareTo()', 'compareToIgnoreCase()',
    'toString()', 'toCharArray()', 'append()', 'insert()', 'delete()', 'deleteCharAt()',
    'replace()', 'trim()', 'strip()', 'toLowerCase()', 'toUpperCase()',
    'startsWith()', 'endsWith()', 'join()', 'repeat()', 'matches()', 
    'String.valueOf()', 'formatted()', 'isBlank()', 'isEmpty()',

    // --- Core Collection / List Methods ---
    'add()', 'addAll()', 'remove()', 'removeAll()', 'removeIf()', 'retainAll()', 'clear()', 
    'contains()', 'containsAll()', 'isEmpty()', 'toArray()', 'iterator()', 'listIterator()',
    'get()', 'set()', 'subList()', 'size()',

    // --- Map Specific Methods ---
    'put()', 'putAll()', 'putIfAbsent()', 'getOrDefault()', 
    'containsKey()', 'containsValue()', 'replaceAll()',
    'keySet()', 'values()', 'entrySet()', 'getKey()', 'getValue()', 'setValue()',
    'compute()', 'computeIfAbsent()', 'computeIfPresent()', 'merge()',

    // --- Queue / Deque / Stack / PriorityQueue Methods ---
    'offer()', 'poll()', 'peek()', 'element()', // Standard Queue
    'addFirst()', 'addLast()', 'offerFirst()', 'offerLast()', // Deque Insert
    'removeFirst()', 'removeLast()', 'pollFirst()', 'pollLast()', // Deque Remove
    'getFirst()', 'getLast()', 'peekFirst()', 'peekLast()', // Deque Examine
    'push()', 'pop()', // Stack operations

    // --- Set / NavigableSet / TreeSet / BitSet Specific ---
    'first()', 'last()', 'headSet()', 'tailSet()', 'subSet()', 
    'higher()', 'lower()', 'ceiling()', 'floor()',
    'set()', 'get()', 'clear()', 'and()', 'or()', 'xor()', 'cardinality()', // BitSet specific

    // --- Java Functional & Stream API ---
    'stream()', 'filter()', 'map()', 'flatMap()', 'collect()', 'forEach()', 
    'reduce()', 'sorted()', 'distinct()', 'limit()', 'skip()',
    'anyMatch()', 'allMatch()', 'noneMatch()', 'findFirst()', 'findAny()',

    // --- Regex Pattern Matching ---
    'Pattern.compile()', 'matcher()', 'matches()', 'find()', 'group()',

    // --- Algorithms & Utilities (Collections / Arrays / Math / Objects) ---
    'sort()', 'fill()', 'reverse()', 'binarySearch()', 'shuffle()', 'swap()', 'copy()', 
    'min()', 'max()', 'abs()', 'pow()', 'sqrt()', 'ceil()', 'floor()', 'round()', 'random()',
    'asList()', 'copyOf()', 'copyOfRange()', 'hashCode()', 'compare()', 
    'Objects.equals()', 'Objects.requireNonNull()',

    // 6. Java Core Keywords & Modifiers
    'new', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
    'class', 'interface', 'extends', 'implements', 'package', 'import',
    'public', 'private', 'protected', 'static', 'final', 'void', 'this', 'super',
    'try', 'catch', 'finally', 'throw', 'throws', 'instanceof', 'var', 'record',

    // 7. C++ Standard Template Library (STL)
    'vector<>', 'unordered_map<>', 'unordered_set<>', 'map<>', 'set<>', 'queue<>', 'deque<>', 
    'priority_queue<>', 'stack<>', 'pair<>', 'string', 'auto', 'push_back()', 'pop_back()',
    'erase()', 'empty()', 'begin()', 'end()', 'rbegin()', 'rend()',
    'front()', 'back()', 'top()', 'make_pair()',

    // 8. MySQL / SQL Keywords & Functions
    // --- Data Types & Commands (DDL/DML) ---
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'DATABASE',
    'INT', 'VARCHAR()', 'CHAR()', 'TEXT', 'DATE', 'TIME', 'DATETIME', 'TIMESTAMP', 'DECIMAL()', 'BLOB',
    
    // --- Query Modifiers & Clauses ---
    'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'SET', 'VALUES',
    'ASC', 'DESC', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'AS', 'DISTINCT',
    'EXISTS', 'ANY', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    
    // --- Joins & Unions ---
    'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN', 'ON', 'UNION',
    
    // --- Constraints & Keys ---
    'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'UNIQUE', 'NOT NULL', 'DEFAULT', 'CHECK', 'AUTO_INCREMENT',
    
    // --- Aggregate Functions ---
    'COUNT()', 'SUM()', 'AVG()', 'MIN()', 'MAX()',
    
    // --- Common Built-in Functions ---
    'CONCAT()', 'SUBSTRING()', 'LENGTH()', 'LOWER()', 'UPPER()', 'TRIM()', 'REPLACE()', // String
    'NOW()', 'CURDATE()', 'CURTIME()', 'DATE_ADD()', 'DATE_SUB()', 'DATEDIFF()', 'DATE_FORMAT()', // Date/Time
    'IFNULL()', 'COALESCE()', 'ROUND()', 'FLOOR()', 'CEIL()', 'ABS()', // Math / Control
    
    // --- Window Functions ---
    'ROW_NUMBER()', 'RANK()', 'DENSE_RANK()', 'LEAD()', 'LAG()', 'OVER', 'PARTITION BY'
];
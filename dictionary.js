// ============================================================================
// LANGUAGE-SPECIFIC DICTIONARIES & N-GRAMS
// ============================================================================

const languageData = {
    "java": {
        keywords: [
            // Primitives & Wrappers
            'int', 'float', 'double', 'boolean', 'char', 'long', 'short', 'byte', 'void', 'var',
            'String', 'Integer', 'Double', 'Boolean', 'Character', 'Long', 'Short', 'Byte', 'Object', 'Number',
            // Collections & Data Structures
            'List<>', 'ArrayList<>', 'LinkedList<>', 'Map<>', 'HashMap<>', 'TreeMap<>', 'LinkedHashMap<>', 'ConcurrentHashMap<>',
            'Set<>', 'HashSet<>', 'TreeSet<>', 'LinkedHashSet<>', 'Queue<>', 'PriorityQueue<>', 'Deque<>', 'ArrayDeque<>', 
            'Stack<>', 'Vector<>', 'Hashtable<>', 'BitSet', 'ListNode', 'TreeNode', 'GraphNode', 'EnumMap<>', 'EnumSet<>',
            // Streams, I/O & Concurrency
            'Stream<>', 'IntStream', 'LongStream', 'DoubleStream', 'Optional<>', 'OptionalInt', 'Collectors', 'BufferedReader', 
            'InputStreamReader', 'StringTokenizer', 'PrintWriter', 'Scanner', 'Thread', 'Runnable', 'Callable<>', 'Future<>', 
            'ExecutorService', 'Executors', 'Semaphore', 'CountDownLatch', 'ReentrantLock', 'AtomicInteger', 'AtomicBoolean',
            // Utilities & Core Methods
            'Math', 'Arrays', 'Collections', 'StringBuilder', 'StringBuffer', 'Objects', 'UUID', 'System', 'Runtime',
            'length()', 'size()', 'charAt()', 'substring()', 'indexOf()', 'lastIndexOf()', 'split()', 'equals()', 'equalsIgnoreCase()', 
            'compareTo()', 'contains()', 'containsKey()', 'containsValue()', 'put()', 'putIfAbsent()', 'get()', 'getOrDefault()',
            'remove()', 'add()', 'addAll()', 'poll()', 'peek()', 'push()', 'pop()', 'offer()', 'offerFirst()', 'offerLast()', 'pollFirst()', 'pollLast()',
            'isEmpty()', 'clear()', 'keySet()', 'values()', 'entrySet()', 'sort()', 'fill()', 'reverse()', 'binarySearch()', 
            'toCharArray()', 'max()', 'min()', 'abs()', 'pow()', 'sqrt()', 'ceil()', 'floor()', 'round()', 'stream()', 'filter()', 'map()', 
            'reduce()', 'collect()', 'forEach()', 'anyMatch()', 'allMatch()', 'noneMatch()', 'findFirst()', 'findAny()', 'toArray()',
            'flatMap()', 'sorted()', 'distinct()', 'limit()', 'skip()', 'count()', 'join()', 'replace()', 'replaceAll()', 'trim()',
            'toLowerCase()', 'toUpperCase()', 'startsWith()', 'endsWith()', 'matches()', 'hashCode()', 'toString()', 'clone()'
        ],
        bigrams: {
            'public': ['static', 'class', 'void', 'int', 'String', 'boolean', 'List<>', 'final', 'interface', 'enum', 'abstract'],
            'private': ['static', 'final', 'int', 'String', 'boolean', 'List<>', 'void', 'Map<>', 'Set<>'],
            'protected': ['void', 'int', 'String', 'boolean', 'abstract', 'final'],
            'static': ['void', 'int', 'final', 'boolean', 'String', 'synchronized', 'class', ' <T>'],
            'final': ['int', 'String', 'boolean', 'class', 'List<>', 'Map<>', 'double'],
            'return': ['true;', 'false;', '0;', '1;', 'ans;', 'res;', 'null;', 'root;', 'new ', '-1;', 'count;'],
            'new': ['ArrayList<>()', 'HashMap<>()', 'HashSet<>()', 'StringBuilder()', 'PriorityQueue<>()', 'int[', 'String[', 'BufferedReader(', 'StringTokenizer('],
            'try': ['{'],
            'catch': ['(Exception e) {', '(IOException e) {', '(NullPointerException e) {', '(IllegalArgumentException e) {'],
            'throw': ['new IllegalArgumentException()', 'new NullPointerException()', 'new IllegalStateException()', 'new IndexOutOfBoundsException()'],
            'hashmap': ['<Integer, Integer>', '<Character, Integer>', '<String, Integer>', '<Integer, List<Integer>>', '<String, String>', '<Integer, Boolean>'],
            'list': ['<Integer>', '<String>', '<List<Integer>>', '<TreeNode>', '<ListNode>', '<int[]>'],
            'arraylist': ['<Integer>()', '<String>()', '<>()'],
            'priorityqueue': ['<Integer>', '<int[]>', '<>()', '(a, b) ->', 'Collections.reverseOrder()'],
            'arrays.': ['sort(', 'fill(', 'binarySearch(', 'toString(', 'asList(', 'copyOf(', 'equals('],
            'collections.': ['sort(', 'reverse(', 'max(', 'min(', 'shuffle(', 'frequency(', 'synchronizedList('],
            'system.': ['out.println(', 'out.print(', 'currentTimeMillis()', 'nanoTime()', 'gc()']
        }
    },

    "c++": {
        keywords: [
            // Primitives & STL Types
            'bool', 'char', 'int', 'float', 'double', 'long', 'short', 'size_t', 'auto', 'void', 'long long', 'unsigned', 'signed',
            'string', 'vector<>', 'unordered_map<>', 'unordered_set<>', 'map<>', 'set<>', 'multimap<>', 'multiset<>',
            'queue<>', 'deque<>', 'priority_queue<>', 'stack<>', 'pair<>', 'tuple<>', 'list<>', 'forward_list<>', 'bitset<>',
            'string_view', 'array<>', 'shared_ptr<>', 'unique_ptr<>', 'weak_ptr<>', 'complex<>',
            // Methods & Algorithms
            'push_back()', 'pop_back()', 'emplace_back()', 'push()', 'pop()', 'top()', 'front()', 'back()', 'insert()', 'erase()', 
            'empty()', 'size()', 'clear()', 'begin()', 'end()', 'rbegin()', 'rend()', 'cbegin()', 'cend()', 'find()', 'count()', 
            'accumulate()', 'lower_bound()', 'upper_bound()', 'next_permutation()', 'prev_permutation()', 'make_pair()', 'make_tuple()',
            'tie()', 'get<>', 'sort()', 'stable_sort()', 'reverse()', 'unique()', 'distance()', 'advance()', 'min_element()', 'max_element()',
            'stringstream', 'getline()', 'stoi()', 'to_string()', 'memset()', 'memcpy()', 'fill()', 'iota()', 'binary_search()',
            'partial_sum()', 'adjacent_find()', 'is_sorted()', 'nth_element()', 'merge()', 'inplace_merge()', 'min()', 'max()', 'abs()',
            'swap()', 'resize()', 'reserve()', 'assign()', 'substr()', 'append()', 'compare()', 'find_first_of()', 'find_last_of()'
        ],
        bigrams: {
            'std::': ['vector<', 'string', 'unordered_map<', 'unordered_set<', 'cout', 'cin', 'endl', 'sort()', 'make_pair()', 'tie', 'move', 'min', 'max'],
            'vector<': ['int>', 'string>', 'vector<int>>', 'char>', 'pair<int, int>>', 'long long>', 'bool>'],
            'unordered_map<': ['int, int>', 'char, int>', 'string, int>', 'int, vector<int>>', 'long long, long long>'],
            'unordered_set<': ['int>', 'char>', 'string>', 'long long>'],
            'auto': ['it =', 'i = 0;', 'x : ', ' [a, b] = ', ' &[a, b] = '],
            'const': ['int', 'auto&', 'string&', 'char', 'double'],
            '#include': ['<iostream>', '<vector>', '<string>', '<algorithm>', '<unordered_map>', '<unordered_set>', '<queue>', '<stack>', '<bits/stdc++.h>'],
            'using': ['namespace std;'],
            'ios_base::': ['sync_with_stdio(false);'],
            'cin.': ['tie(NULL);', 'get()', 'getline('],
            'return': ['0;', 'true;', 'false;', 'ans;', 'res;', '-1;', 'nullptr;']
        }
    },

    "mysql": {
        keywords: [
            // Core Query Structure
            'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN', 'FULL OUTER JOIN', 'NATURAL JOIN',
            'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'AS', 'AND', 'OR', 'NOT', 'IN ()', 'EXISTS ()',
            'IS NULL', 'IS NOT NULL', 'BETWEEN', 'LIKE', 'ILIKE', 'REGEXP', 'DISTINCT', 'UNION', 'ALL', 'ANY', 'SOME',
            // DDL & DML Mutators
            'INSERT INTO', 'UPDATE', 'DELETE FROM', 'SET', 'VALUES ()', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'TRUNCATE TABLE',
            'CREATE DATABASE', 'DROP DATABASE', 'CREATE INDEX', 'DROP INDEX', 'CREATE VIEW', 'DROP VIEW', 'RENAME TABLE',
            // Constraints & Options
            'CONSTRAINT', 'PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'CHECK', 'DEFAULT', 'AUTO_INCREMENT', 'NOT NULL', 'ON DELETE', 'ON UPDATE', 'CASCADE',
            // Scalar & Window Aggregates
            'COUNT()', 'SUM()', 'AVG()', 'MIN()', 'MAX()', 'CAST()', 'CONVERT()', 'COALESCE()', 'IFNULL()', 'NULLIF()', 'CASE', 'WHEN', 
            'THEN', 'ELSE', 'END', 'IF()', 'WITH', 'OVER ()', 'PARTITION BY', 'ROW_NUMBER()', 'RANK()', 'DENSE_RANK()', 'NTILE()', 'LAG()', 'LEAD()', 
            'FIRST_VALUE()', 'LAST_VALUE()', 'CUME_DIST()', 'PERCENT_RANK()', 'GROUP_CONCAT()',
            // Data Types
            'INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'DECIMAL()', 'NUMERIC()', 'FLOAT', 'DOUBLE', 
            'VARCHAR()', 'CHAR()', 'TEXT', 'LONGTEXT', 'BLOB', 'DATE', 'DATETIME', 'TIMESTAMP', 'TIME', 'YEAR', 'JSON', 'BOOLEAN',
            // String Functions
            'CONCAT()', 'CONCAT_WS()', 'SUBSTRING()', 'SUBSTR()', 'LENGTH()', 'CHAR_LENGTH()', 'LOWER()', 'UPPER()', 'TRIM()', 'LTRIM()', 'RTRIM()', 
            'REPLACE()', 'REVERSE()', 'LEFT()', 'RIGHT()', 'INSTR()', 'LOCATE()', 'LPAD()', 'RPAD()',
            // Date & Time Functions
            'NOW()', 'CURDATE()', 'CURTIME()', 'DATE_ADD()', 'DATE_SUB()', 'DATEDIFF()', 'DATE_FORMAT()', 'STR_TO_DATE()', 'EXTRACT()',
            'TIMESTAMPADD()', 'TIMESTAMPDIFF()', 'LAST_DAY()', 'YEAR()', 'MONTH()', 'DAY()', 'HOUR()',
            // JSON Processing
            'JSON_EXTRACT()', 'JSON_ARRAY()', 'JSON_OBJECT()', 'JSON_MERGE()', 'JSON_VALID()', 'JSON_UNQUOTE()', 'JSON_KEYS()'
        ],
        bigrams: {
            'SELECT': ['*', 'COUNT(*)', 'DISTINCT', 'id', 'name', 'COUNT(1)'],
            'FROM': ['users', 'orders', 'employees', 'products', 'customers', 'transactions'],
            'WHERE': ['id =', 'status =', 'created_at >=', 'deleted_at IS NULL', 'active = 1'],
            'GROUP': ['BY '],
            'ORDER': ['BY '],
            'INNER': ['JOIN '],
            'LEFT': ['JOIN '],
            'RIGHT': ['JOIN '],
            'PARTITION': ['BY '],
            'ROW_NUMBER()': ['OVER ('],
            'DENSE_RANK()': ['OVER ('],
            'RANK()': ['OVER ('],
            'LEAD()': ['OVER ('],
            'LAG()': ['OVER ('],
            'ON': ['a.id = b.', 'e.department_id = d.id', 'o.user_id = u.id'],
            'IS': ['NULL', 'NOT NULL'],
            'CASE': ['WHEN '],
            'WHEN': ['condition THEN ', 'id IS NULL THEN '],
            'INSERT': ['INTO '],
            'CREATE': ['TABLE ', 'DATABASE ', 'INDEX ', 'VIEW ', 'PROCEDURE '],
            'ALTER': ['TABLE '],
            'DROP': ['TABLE ', 'VIEW ', 'INDEX '],
            'ON DELETE': ['CASCADE', 'SET NULL', 'RESTRICT'],
            'DATE_FORMAT(': ['NOW(),', 'created_at,']
        }
    }
};
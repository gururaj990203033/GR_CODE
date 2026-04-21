// ============================================
// COMPLETE DATA - ALL ALGORITHMS & CONTENT
// ============================================

const ALGO_DATA = {
    // BASICS
    traversal: {
        name: 'List Traversal',
        difficulty: 'Easy',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `void traverse(struct Node* head) {
    struct Node* curr = head;
    while (curr != NULL) {
        printf("%d ", curr->data);
        curr = curr->next;
    }
}`,
        insights: [
            'Start with curr = head',
            'Move curr forward with curr = curr->next',
            'Stop when curr == NULL',
            'Single pass through the list'
        ]
    },
    
    'insert-head': {
        name: 'Insert at Head',
        difficulty: 'Easy',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        code: `void insertHead(struct Node** head, int data) {
    struct Node* newNode = malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = *head;
    *head = newNode;
}`,
        insights: [
            'Create new node with malloc',
            'Point newNode->next to current head',
            'Update head to point to newNode',
            'Constant time operation O(1)'
        ]
    },
    
    'insert-tail': {
        name: 'Insert at Tail',
        difficulty: 'Easy',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `void insertTail(struct Node** head, int data) {
    struct Node* newNode = malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    
    if (*head == NULL) {
        *head = newNode;
        return;
    }
    
    struct Node* curr = *head;
    while (curr->next != NULL) {
        curr = curr->next;
    }
    curr->next = newNode;
}`,
        insights: [
            'Must traverse to find last node',
            'Handle empty list edge case',
            'Set last node->next to newNode',
            'Takes O(n) time to find tail'
        ]
    },
    
    'delete-node': {
        name: 'Delete Node',
        difficulty: 'Easy',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `void deleteNode(struct Node** head, int key) {
    struct Node* curr = *head;
    struct Node* prev = NULL;
    
    if (curr != NULL && curr->data == key) {
        *head = curr->next;
        free(curr);
        return;
    }
    
    while (curr != NULL && curr->data != key) {
        prev = curr;
        curr = curr->next;
    }
    
    if (curr == NULL) return;
    
    prev->next = curr->next;
    free(curr);
}`,
        insights: [
            'Need prev pointer to bypass node',
            'Handle head deletion separately',
            'Always free() deleted nodes',
            'Check if node exists before deleting'
        ]
    },
    
    // CORE
    reverse: {
        name: 'Reverse Linked List',
        difficulty: 'Medium',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `struct Node* reverse(struct Node* head) {
    struct Node* prev = NULL;
    struct Node* curr = head;
    struct Node* next = NULL;
    
    while (curr != NULL) {
        next = curr->next;    // Save next
        curr->next = prev;    // Reverse link
        prev = curr;          // Move prev
        curr = next;          // Move curr
    }
    
    return prev;  // New head
}`,
        insights: [
            'Three pointers: prev, curr, next',
            'CRITICAL: Save next before breaking link',
            'Reverse one link at a time',
            'Return prev (new head) at end'
        ]
    },
    
    'find-middle': {
        name: 'Find Middle Node',
        difficulty: 'Easy',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `struct Node* findMiddle(struct Node* head) {
    struct Node* slow = head;
    struct Node* fast = head;
    
    while (fast != NULL && fast->next != NULL) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    return slow;
}`,
        insights: [
            'Slow moves 1 step, fast moves 2 steps',
            'When fast reaches end, slow is at middle',
            'Works for both even and odd length lists',
            'Single pass algorithm'
        ]
    },
    
    'detect-cycle': {
        name: 'Detect Cycle (Floyd)',
        difficulty: 'Medium',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `bool hasCycle(struct Node* head) {
    struct Node* slow = head;
    struct Node* fast = head;
    
    while (fast != NULL && fast->next != NULL) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) {
            return true;  // Cycle detected
        }
    }
    
    return false;  // No cycle
}`,
        insights: [
            'Floyd\'s cycle detection algorithm',
            'If cycle exists, slow and fast will meet',
            'No extra space needed',
            'Also called "Tortoise and Hare"'
        ]
    },
    
    'remove-nth': {
        name: 'Remove Nth from End',
        difficulty: 'Medium',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `struct Node* removeNth(struct Node* head, int n) {
    struct Node dummy;
    dummy.next = head;
    struct Node* fast = &dummy;
    struct Node* slow = &dummy;
    
    // Move fast n+1 steps ahead
    for (int i = 0; i <= n; i++) {
        fast = fast->next;
    }
    
    // Move both until fast reaches end
    while (fast != NULL) {
        slow = slow->next;
        fast = fast->next;
    }
    
    // Delete node
    struct Node* temp = slow->next;
    slow->next = slow->next->next;
    free(temp);
    
    return dummy.next;
}`,
        insights: [
            'Use dummy node to handle edge cases',
            'Maintain gap of n between pointers',
            'One pass solution',
            'slow->next is the node to delete'
        ]
    },
    
    'merge-sorted': {
        name: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        timeComplexity: 'O(n+m)',
        spaceComplexity: 'O(1)',
        code: `struct Node* merge(struct Node* l1, struct Node* l2) {
    struct Node dummy;
    struct Node* tail = &dummy;
    dummy.next = NULL;
    
    while (l1 != NULL && l2 != NULL) {
        if (l1->data < l2->data) {
            tail->next = l1;
            l1 = l1->next;
        } else {
            tail->next = l2;
            l2 = l2->next;
        }
        tail = tail->next;
    }
    
    // Attach remaining
    if (l1 != NULL) tail->next = l1;
    if (l2 != NULL) tail->next = l2;
    
    return dummy.next;
}`,
        insights: [
            'Dummy node simplifies code',
            'Compare heads and link smaller',
            'Attach remaining list at end',
            'No need to copy nodes'
        ]
    },
    
    // ADVANCED
    palindrome: {
        name: 'Palindrome Check',
        difficulty: 'Medium',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `bool isPalindrome(struct Node* head) {
    // Find middle
    struct Node* slow = head;
    struct Node* fast = head;
    while (fast != NULL && fast->next != NULL) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    // Reverse second half
    struct Node* prev = NULL;
    while (slow != NULL) {
        struct Node* next = slow->next;
        slow->next = prev;
        prev = slow;
        slow = next;
    }
    
    // Compare halves
    struct Node* left = head;
    struct Node* right = prev;
    while (right != NULL) {
        if (left->data != right->data) {
            return false;
        }
        left = left->next;
        right = right->next;
    }
    
    return true;
}`,
        insights: [
            'Find middle using slow/fast',
            'Reverse second half in-place',
            'Compare first half with reversed second half',
            'O(1) space solution'
        ]
    },
    
    'reverse-k-group': {
        name: 'Reverse in K Groups',
        difficulty: 'Hard',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `struct Node* reverseKGroup(struct Node* head, int k) {
    struct Node* curr = head;
    int count = 0;
    
    // Check if k nodes exist
    while (curr != NULL && count < k) {
        curr = curr->next;
        count++;
    }
    
    if (count == k) {
        curr = reverseKGroup(curr, k);
        
        // Reverse k nodes
        while (count-- > 0) {
            struct Node* next = head->next;
            head->next = curr;
            curr = head;
            head = next;
        }
        head = curr;
    }
    
    return head;
}`,
        insights: [
            'Recursively reverse each group',
            'Check if k nodes available',
            'Leave remaining nodes unchanged',
            'Complex pointer manipulation'
        ]
    },
    
    'copy-random': {
        name: 'Copy with Random Pointer',
        difficulty: 'Hard',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `struct Node* copyRandom(struct Node* head) {
    if (head == NULL) return NULL;
    
    // Step 1: Create interleaved list
    struct Node* curr = head;
    while (curr != NULL) {
        struct Node* copy = malloc(sizeof(struct Node));
        copy->data = curr->data;
        copy->next = curr->next;
        curr->next = copy;
        curr = copy->next;
    }
    
    // Step 2: Copy random pointers
    curr = head;
    while (curr != NULL) {
        if (curr->random != NULL) {
            curr->next->random = curr->random->next;
        }
        curr = curr->next->next;
    }
    
    // Step 3: Separate lists
    curr = head;
    struct Node* newHead = head->next;
    while (curr != NULL) {
        struct Node* copy = curr->next;
        curr->next = copy->next;
        if (copy->next != NULL) {
            copy->next = copy->next->next;
        }
        curr = curr->next;
    }
    
    return newHead;
}`,
        insights: [
            'Three-pass algorithm',
            'Interleave original and copy',
            'Copy random pointers using interleaved structure',
            'Separate into two lists'
        ]
    }
};

// STEP GENERATORS
const STEP_GENERATORS = {
    traversal: (nodes) => {
        const steps = [];
        steps.push({
            title: 'Initialize',
            explanation: 'Set curr = head to start traversal',
            highlights: { curr: 0, labels: { 0: 'curr' } },
            codeLine: 2
        });
        
        for (let i = 0; i < nodes.length; i++) {
            steps.push({
                title: `Visit Node ${i + 1}`,
                explanation: `At node with value ${nodes[i].value}. Process this node.`,
                highlights: { curr: i, labels: { [i]: 'curr' } },
                codeLine: 3
            });
            
            if (i < nodes.length - 1) {
                steps.push({
                    title: 'Move Forward',
                    explanation: 'curr = curr->next (move to next node)',
                    highlights: { curr: i + 1, labels: { [i + 1]: 'curr' } },
                    codeLine: 4
                });
            }
        }
        
        steps.push({
            title: 'Complete',
            explanation: 'Reached NULL. Traversal complete.',
            highlights: {},
            codeLine: 6
        });
        
        return steps;
    },
    
    'insert-head': (nodes) => {
        const steps = [];
        steps.push({
            title: 'Create New Node',
            explanation: 'Allocate memory for new node with value 99',
            highlights: {},
            codeLine: 2
        });
        steps.push({
            title: 'Link to Head',
            explanation: 'newNode->next = head (point to current first node)',
            highlights: { curr: 0 },
            codeLine: 3
        });
        steps.push({
            title: 'Update Head',
            explanation: 'head = newNode (new node becomes first)',
            highlights: {},
            codeLine: 4
        });
        steps.push({
            title: 'Complete',
            explanation: 'Insert complete in O(1) time',
            highlights: {},
            codeLine: 5
        });
        return steps;
    },
    
    'insert-tail': (nodes) => {
        const steps = [];
        steps.push({
            title: 'Create New Node',
            explanation: 'Allocate memory for new node',
            highlights: {},
            codeLine: 2
        });
        steps.push({
            title: 'Traverse to End',
            explanation: 'Start at head, move to last node',
            highlights: { curr: 0, labels: { 0: 'curr' } },
            codeLine: 10
        });
        for (let i = 0; i < nodes.length - 1; i++) {
            steps.push({
                title: 'Moving Forward',
                explanation: `At node ${nodes[i].value}. Not last node yet.`,
                highlights: { curr: i + 1, labels: { [i + 1]: 'curr' } },
                codeLine: 11
            });
        }
        steps.push({
            title: 'Found Last Node',
            explanation: 'curr->next is NULL. This is the last node.',
            highlights: { curr: nodes.length - 1, labels: { [nodes.length - 1]: 'curr' } },
            codeLine: 13
        });
        steps.push({
            title: 'Link New Node',
            explanation: 'curr->next = newNode',
            highlights: {},
            codeLine: 14
        });
        return steps;
    },
    
    'delete-node': (nodes) => {
        const steps = [];
        const target = nodes[Math.min(1, nodes.length - 1)].value;
        
        steps.push({
            title: 'Initialize Pointers',
            explanation: `Looking for node with value ${target}`,
            highlights: { curr: 0, labels: { 0: 'curr' } },
            codeLine: 2
        });
        
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].value === target) {
                steps.push({
                    title: 'Found Target',
                    explanation: `Found node with value ${target}`,
                    highlights: { 
                        prev: i > 0 ? i - 1 : undefined,
                        curr: i,
                        labels: { ...(i > 0 && { [i - 1]: 'prev' }), [i]: 'curr' }
                    },
                    codeLine: 17
                });
                steps.push({
                    title: 'Bypass Node',
                    explanation: 'prev->next = curr->next',
                    highlights: { prev: i > 0 ? i - 1 : undefined, next: i + 1 },
                    codeLine: 18
                });
                steps.push({
                    title: 'Free Memory',
                    explanation: 'free(curr)',
                    highlights: {},
                    codeLine: 19
                });
                break;
            }
        }
        return steps;
    },
    
    reverse: (nodes) => {
        const steps = [];
        steps.push({
            title: 'Initialize',
            explanation: 'prev = NULL, curr = head, next = NULL',
            highlights: { curr: 0, labels: { 0: 'curr' } },
            codeLine: 2
        });
        
        for (let i = 0; i < nodes.length; i++) {
            steps.push({
                title: 'Save Next',
                explanation: 'next = curr->next (save before breaking link)',
                highlights: {
                    prev: i > 0 ? i - 1 : undefined,
                    curr: i,
                    next: i < nodes.length - 1 ? i + 1 : undefined,
                    labels: {
                        ...(i > 0 && { [i - 1]: 'prev' }),
                        [i]: 'curr',
                        ...(i < nodes.length - 1 && { [i + 1]: 'next' })
                    }
                },
                codeLine: 6
            });
            
            steps.push({
                title: 'Reverse Link',
                explanation: 'curr->next = prev (reverse pointer)',
                highlights: {
                    prev: i > 0 ? i - 1 : undefined,
                    curr: i,
                    labels: {
                        ...(i > 0 && { [i - 1]: 'prev' }),
                        [i]: 'curr'
                    }
                },
                codeLine: 7
            });
            
            if (i < nodes.length - 1) {
                steps.push({
                    title: 'Move Pointers',
                    explanation: 'prev = curr, curr = next',
                    highlights: {
                        curr: i + 1,
                        prev: i,
                        labels: { [i]: 'prev', [i + 1]: 'curr' }
                    },
                    codeLine: 8
                });
            }
        }
        
        steps.push({
            title: 'Complete',
            explanation: 'Return prev (new head)',
            highlights: { curr: nodes.length - 1, labels: { [nodes.length - 1]: 'new head' } },
            codeLine: 11
        });
        
        return steps;
    },
    
    'find-middle': (nodes) => {
        const steps = [];
        steps.push({
            title: 'Initialize',
            explanation: 'slow = head, fast = head',
            highlights: { slow: 0, fast: 0, labels: { 0: 'slow/fast' } },
            codeLine: 2
        });
        
        let slow = 0, fast = 0;
        while (fast < nodes.length - 1 && fast + 1 < nodes.length) {
            fast = Math.min(fast + 2, nodes.length - 1);
            slow++;
            
            steps.push({
                title: 'Move Pointers',
                explanation: 'slow moves 1 step, fast moves 2 steps',
                highlights: { slow, fast, labels: { [slow]: 'slow', [fast]: 'fast' } },
                codeLine: 5
            });
        }
        
        steps.push({
            title: 'Found Middle',
            explanation: `When fast reaches end, slow is at middle (${nodes[slow].value})`,
            highlights: { slow, labels: { [slow]: 'middle' } },
            codeLine: 9
        });
        
        return steps;
    },
    
    'detect-cycle': (nodes) => {
        const steps = [];
        steps.push({
            title: 'Initialize',
            explanation: 'slow = head, fast = head (Floyd\'s algorithm)',
            highlights: { slow: 0, fast: 0, labels: { 0: 'slow/fast' } },
            codeLine: 2
        });
        
        let slow = 0, fast = 0;
        for (let i = 0; i < Math.min(4, Math.floor(nodes.length / 2)); i++) {
            slow++;
            fast = Math.min(fast + 2, nodes.length - 1);
            
            steps.push({
                title: `Iteration ${i + 1}`,
                explanation: 'slow moves 1, fast moves 2',
                highlights: { slow, fast, labels: { [slow]: 'slow', [fast]: 'fast' } },
                codeLine: 5
            });
        }
        
        steps.push({
            title: 'No Cycle',
            explanation: 'fast reached NULL. No cycle detected.',
            highlights: {},
            codeLine: 12
        });
        
        return steps;
    },
    
    'remove-nth': (nodes) => {
        const n = 2;
        const steps = [];
        
        steps.push({
            title: 'Use Dummy Node',
            explanation: 'Create dummy node to handle edge cases',
            highlights: {},
            codeLine: 2
        });
        
        steps.push({
            title: 'Move Fast Ahead',
            explanation: `Move fast ${n + 1} steps ahead`,
            highlights: { fast: Math.min(n, nodes.length - 1), slow: 0, labels: { 0: 'slow', [Math.min(n, nodes.length - 1)]: 'fast' } },
            codeLine: 7
        });
        
        let slow = 0, fast = Math.min(n, nodes.length - 1);
        while (fast < nodes.length - 1) {
            slow++;
            fast++;
            steps.push({
                title: 'Move Both',
                explanation: 'Move both pointers together',
                highlights: { slow, fast, labels: { [slow]: 'slow', [fast]: 'fast' } },
                codeLine: 11
            });
        }
        
        steps.push({
            title: 'Delete Node',
            explanation: `slow->next is ${n}th from end. Delete it.`,
            highlights: { slow, curr: slow + 1 },
            codeLine: 16
        });
        
        return steps;
    },
    
    'merge-sorted': (nodes) => {
        const steps = [];
        steps.push({
            title: 'Initialize Dummy',
            explanation: 'Create dummy node to build result',
            highlights: {},
            codeLine: 2
        });
        
        for (let i = 0; i < Math.min(4, nodes.length); i++) {
            steps.push({
                title: `Merge Step ${i + 1}`,
                explanation: 'Compare values, link smaller',
                highlights: { curr: i },
                codeLine: 5 + (i % 2)
            });
        }
        
        steps.push({
            title: 'Attach Remaining',
            explanation: 'Attach rest of non-empty list',
            highlights: {},
            codeLine: 15
        });
        
        return steps;
    },
    
    palindrome: (nodes) => {
        const mid = Math.floor(nodes.length / 2);
        const steps = [];
        
        steps.push({
            title: 'Find Middle',
            explanation: 'Use slow/fast to find middle',
            highlights: { slow: 0, fast: 0 },
            codeLine: 3
        });
        
        steps.push({
            title: 'Middle Found',
            explanation: `Middle at index ${mid}`,
            highlights: { slow: mid, labels: { [mid]: 'middle' } },
            codeLine: 8
        });
        
        steps.push({
            title: 'Reverse Second Half',
            explanation: 'Reverse from middle to end',
            highlights: { curr: mid },
            codeLine: 11
        });
        
        steps.push({
            title: 'Compare Halves',
            explanation: 'Compare first with reversed second half',
            highlights: { prev: 0, curr: mid },
            codeLine: 19
        });
        
        return steps;
    },
    
    'reverse-k-group': (nodes) => {
        const k = 3;
        const steps = [];
        
        steps.push({
            title: 'Initialize',
            explanation: `Reverse in groups of ${k}`,
            highlights: {},
            codeLine: 2
        });
        
        let start = 0;
        while (start < nodes.length) {
            const end = Math.min(start + k - 1, nodes.length - 1);
            steps.push({
                title: `Group ${Math.floor(start / k) + 1}`,
                explanation: `Reverse from ${start} to ${end}`,
                highlights: { prev: start, curr: end, labels: { [start]: 'start', [end]: 'end' } },
                codeLine: 9
            });
            start += k;
        }
        
        return steps;
    },
    
    'copy-random': (nodes) => {
        const steps = [];
        
        steps.push({
            title: 'Step 1: Interleave',
            explanation: 'Create copy after each original node',
            highlights: {},
            codeLine: 5
        });
        
        steps.push({
            title: 'Step 2: Copy Random',
            explanation: 'Copy random pointers',
            highlights: {},
            codeLine: 14
        });
        
        steps.push({
            title: 'Step 3: Separate',
            explanation: 'Extract copied nodes',
            highlights: {},
            codeLine: 22
        });
        
        return steps;
    }
};

// PRACTICE PROBLEMS
const PRACTICE_PROBLEMS = [
    {
        title: 'Reverse Linked List',
        difficulty: 'easy',
        description: 'Reverse a singly linked list using 3 pointers',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        algoKey: 'reverse',
        example: '1,2,3,4,5'
    },
    {
        title: 'Find Middle Node',
        difficulty: 'easy',
        description: 'Find middle using slow/fast pointer technique',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        algoKey: 'find-middle',
        example: '1,2,3,4,5'
    },
    {
        title: 'Detect Cycle',
        difficulty: 'medium',
        description: 'Detect if linked list has a cycle using Floyd\'s algorithm',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        algoKey: 'detect-cycle',
        example: '3,2,0,-4'
    },
    {
        title: 'Remove Nth from End',
        difficulty: 'medium',
        description: 'Remove nth node from end in one pass',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        algoKey: 'remove-nth',
        example: '1,2,3,4,5'
    },
    {
        title: 'Merge Sorted Lists',
        difficulty: 'easy',
        description: 'Merge two sorted linked lists',
        timeComplexity: 'O(n+m)',
        spaceComplexity: 'O(1)',
        algoKey: 'merge-sorted',
        example: '1,3,5'
    },
    {
        title: 'Palindrome Check',
        difficulty: 'medium',
        description: 'Check if list is palindrome in O(1) space',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        algoKey: 'palindrome',
        example: '1,2,2,1'
    }
];

// PATTERNS
const PATTERNS = [
    {
        name: '🐢🐇 Slow/Fast Pointer',
        description: 'Two pointers moving at different speeds. Used for finding middle, detecting cycles, and finding kth from end.',
        code: `struct Node* slow = head;
struct Node* fast = head;
while (fast != NULL && fast->next != NULL) {
    slow = slow->next;
    fast = fast->next->next;
}`,
        problems: ['Find Middle', 'Detect Cycle', 'Find Cycle Start', 'Palindrome Check']
    },
    {
        name: '🔄 Three Pointer (Reversal)',
        description: 'Track prev, curr, next for reversing links. Essential pattern for any reversal problem.',
        code: `struct Node* prev = NULL;
struct Node* curr = head;
struct Node* next = NULL;
while (curr != NULL) {
    next = curr->next;
    curr->next = prev;
    prev = curr;
    curr = next;
}`,
        problems: ['Reverse List', 'Reverse in Groups', 'Palindrome Check', 'Reorder List']
    },
    {
        name: '🎭 Dummy Node',
        description: 'Create dummy before head to simplify edge cases and when head might change.',
        code: `struct Node dummy;
dummy.next = head;
struct Node* prev = &dummy;
// ... operations ...
return dummy.next;`,
        problems: ['Merge Lists', 'Remove Nth from End', 'Partition List']
    },
    {
        name: '🏃 Runner Technique',
        description: 'Two pointers with different starting positions or gap. One runs ahead by n steps.',
        code: `// Move fast n steps ahead
for (int i = 0; i < n; i++) {
    fast = fast->next;
}
// Move both together
while (fast != NULL) {
    slow = slow->next;
    fast = fast->next;
}`,
        problems: ['Remove Nth from End', 'Find Kth from End', 'Rotate List']
    },
    {
        name: '🔍 Cycle Detection',
        description: 'Floyd\'s algorithm - if cycle exists, slow and fast will meet.',
        code: `while (fast != NULL && fast->next != NULL) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) return true;
}
return false;`,
        problems: ['Detect Cycle', 'Find Cycle Start', 'Happy Number']
    },
    {
        name: '✂️ Two List Pattern',
        description: 'Create two separate lists, then merge. Used for partitioning.',
        code: `struct Node before, after;
// Build two lists
while (curr) {
    if (curr->val < x) {
        before.next = curr;
    } else {
        after.next = curr;
    }
}
before.next = after.next;`,
        problems: ['Partition List', 'Odd Even List', 'Separate by Condition']
    }
];

// INTERVIEW QUESTIONS
const INTERVIEW_QUESTIONS = [
    {
        company: '🔵 Google',
        title: 'Reverse Nodes in K-Group',
        difficulty: 'hard',
        statement: 'Reverse nodes of a linked list k at a time and return modified list.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        algoKey: 'reverse-k-group',
        example: '1,2,3,4,5'
    },
    {
        company: '🟠 Amazon',
        title: 'Remove Nth Node From End',
        difficulty: 'medium',
        statement: 'Remove the nth node from the end of list in one pass.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        algoKey: 'remove-nth',
        example: '1,2,3,4,5'
    },
    {
        company: '🔴 Meta',
        title: 'Copy List with Random Pointer',
        difficulty: 'hard',
        statement: 'Deep copy a linked list where each node has random pointer.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        algoKey: 'copy-random',
        example: '7,13,11,10,1'
    },
    {
        company: '🟢 Microsoft',
        title: 'Detect Cycle in List',
        difficulty: 'medium',
        statement: 'Determine if linked list has a cycle using O(1) space.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        algoKey: 'detect-cycle',
        example: '3,2,0,-4'
    },
    {
        company: '🟣 Apple',
        title: 'Palindrome Linked List',
        difficulty: 'medium',
        statement: 'Check if singly linked list is palindrome in O(n) time and O(1) space.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        algoKey: 'palindrome',
        example: '1,2,2,1'
    }
];

// DEBUG SCENARIOS
const DEBUG_SCENARIOS = [
    {
        name: 'NULL Pointer Dereference',
        description: 'Accessing data through NULL pointer causes segmentation fault.',
        buggyCode: `while (curr->next != NULL) {  // ❌ Crash if curr is NULL
    curr = curr->next;
}`,
        fix: 'Always check pointer before dereferencing: while (curr != NULL && curr->next != NULL)'
    },
    {
        name: 'Memory Leak',
        description: 'Deleting node without freeing memory.',
        buggyCode: `prev->next = curr->next;
curr = curr->next;  // ❌ Memory leaked!`,
        fix: 'Always free before losing reference: struct Node* temp = curr; prev->next = curr->next; free(temp);'
    },
    {
        name: 'Dangling Pointer',
        description: 'Using pointer after memory is freed.',
        buggyCode: `free(temp);
printf("%d", temp->data);  // ❌ Dangling!`,
        fix: 'Never access freed memory. Set to NULL after free: free(temp); temp = NULL;'
    },
    {
        name: 'Lost Next Reference',
        description: 'Forgetting to save next before reversing.',
        buggyCode: `curr->next = prev;  // ❌ Lost rest of list!
curr = curr->next;  // Goes backward!`,
        fix: 'Save next first: struct Node* next = curr->next; curr->next = prev; curr = next;'
    },
    {
        name: 'Off-by-One Error',
        description: 'Traversing wrong number of times.',
        buggyCode: `for (int i = 0; i < pos; i++) {  // ❌ Too far!
    curr = curr->next;
}`,
        fix: 'Stop one before: for (int i = 0; i < pos - 1; i++) { curr = curr->next; }'
    }
];

// QUICK NOTES
const QUICK_NOTES = [
    {
        title: '🎯 Reversal Pattern',
        content: 'Every reversal uses 3 pointers: prev, curr, next',
        trick: 'prev = NULL, curr = head → while → save next → reverse → move'
    },
    {
        title: '🐢 Slow/Fast Magic',
        content: 'When fast reaches end, slow is at middle',
        trick: 'while (fast && fast->next) { slow++; fast += 2; }'
    },
    {
        title: '🔄 Cycle = Meet',
        content: 'If slow and fast meet, cycle exists',
        trick: 'if (slow == fast) return true;'
    },
    {
        title: '🎭 Dummy Node Trick',
        content: 'Use dummy to handle empty list and head changes',
        trick: 'struct Node dummy; dummy.next = head;'
    },
    {
        title: '📍 Nth from End',
        content: 'Gap of n between fast and slow pointers',
        trick: 'Move fast n+1 ahead, then both together'
    },
    {
        title: '⚠️ NULL Check First',
        content: 'ALWAYS check NULL before dereferencing',
        trick: 'if (curr != NULL) before curr->next'
    },
    {
        title: '💾 Free Memory',
        content: 'Save pointer before freeing',
        trick: 'struct Node* temp = curr; ... free(temp);'
    },
    {
        title: '⚡ Time = O(n)',
        content: 'Most operations traverse once',
        trick: 'Single pass = O(n), two passes still O(n)'
    }
];

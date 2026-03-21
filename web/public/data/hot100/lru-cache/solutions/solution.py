class Node:
    def __init__(self, key=None, val=None, prev=None, next=None):
        self.key = key
        self.val = val
        self.prev = prev
        self.next = next

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        # 哈希表，用于 O(1) 查找节点
        self.hashmap = dict()
        # 伪头部和伪尾部哨兵节点
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key: int) -> int:
        # 如果不在缓存里，返回 -1
        if key not in self.hashmap:
            return -1
        # 如果在，通过哈希表找到节点
        node = self.hashmap[key]
        # 因为刚被“玩过”，移动到最前面（尾部方向）
        self.move_node(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        # 如果 key 已存在，更新值并移到最前
        if key in self.hashmap:
            node = self.hashmap[key]
            node.val = value
            self.move_node(node)
            return
            
        # 如果缓存满了，删除最久未使用的（头部后面那个）
        if len(self.hashmap) == self.capacity:
            # 从哈希表移除
            self.hashmap.pop(self.head.next.key)
            # 从链表移除
            self.remove_node(self.head.next)
            
        # 创建新玩具并加入缓存
        node = Node(key=key, val=value)
        self.hashmap[key] = node
        self.add_node(node)

    def remove_node(self, node):
        # 让前后节点互相拉手，中间的 node 就被踢出去了
        node.prev.next = node.next
        node.next.prev = node.prev

    def add_node(self, node):
        # 始终把新节点插到尾部哨兵之前（表示最新）
        self.tail.prev.next = node
        node.prev = self.tail.prev
        node.next = self.tail
        self.tail.prev = node

    def move_node(self, node):
        # 先拔掉，再插到最前面
        self.remove_node(node)
        self.add_node(node)

# Your LRUCache object will be instantiated and called as such:
# obj = LRUCache(capacity)
# param_1 = obj.get(key)
# obj.put(key,value)

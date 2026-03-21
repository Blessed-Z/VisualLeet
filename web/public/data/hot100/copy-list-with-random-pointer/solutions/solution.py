from typing import Optional

# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random

class Solution:
    def copyRandomList(self, head: Optional[Node]) -> Optional[Node]:
        # 如果链表为空，直接返回
        if not head:
            return None
            
        # 1. 第一遍遍历：创建所有节点的“替身”并存入哈希表
        cur = head
        dic = {}
        while cur:
            # key 是原节点，value 是克隆出的新节点（此时只有值，没有连接线）
            dic[cur] = Node(cur.val)
            cur = cur.next
            
        # 2. 第二遍遍历：为克隆出的新节点连接 next 和 random 线
        cur = head
        while cur:
            # 连接新节点的 next 指针：从字典里找原节点 next 的替身
            dic[cur].next = dic.get(cur.next)
            # 连接新节点的 random 指针：从字典里找原节点 random 的替身
            dic[cur].random = dic.get(cur.random)
            cur = cur.next
            
        # 3. 返回新链表的头节点（即原头节点的替身）
        return dic[head]

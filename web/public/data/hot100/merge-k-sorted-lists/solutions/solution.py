# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        # 1. 魔法口袋：收集所有节点里的数值
        nodes = []
        for l in lists:
            while l:
                nodes.append(l.val)
                l = l.next
        
        # 2. 排序咒语：将所有数值从小到大排好
        nodes.sort()
        
        # 3. 重新组队：根据排好序的数值，创建新的链表节点并连接
        # 设立一个“虚拟哨兵”
        dummy = ListNode(0)
        curr = dummy
        
        for val in nodes:
            # 制作一个新队员（节点）
            curr.next = ListNode(val)
            # 让“哨兵”往后移动，指向刚接好的队员
            curr = curr.next
            
        return dummy.next

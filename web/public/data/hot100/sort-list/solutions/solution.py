# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # 1. 递归终止条件：如果链表为空或只有一个节点，直接返回
        if not head or not head.next:
            return head
        
        # 2. 找到链表的中点并将其断开
        # 使用快慢指针法
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        
        mid = slow.next
        slow.next = None  # 切断连接，分成左右两半
        
        # 3. 递归排序左右两部分
        left = self.sortList(head)
        right = self.sortList(mid)
        
        # 4. 合并两个有序链表
        return self.merge(left, right)

    def merge(self, l1, l2):
        # 建立一个虚拟头节点，方便操作
        dummy = ListNode(0)
        curr = dummy
        
        # 比较两个链表的节点，把小的接在后面
        while l1 and l2:
            if l1.val < l2.val:
                curr.next = l1
                l1 = l1.next
            else:
                curr.next = l2
                l2 = l2.next
            curr = curr.next
        
        # 将剩下的部分接上
        curr.next = l1 if l1 else l2
        
        return dummy.next

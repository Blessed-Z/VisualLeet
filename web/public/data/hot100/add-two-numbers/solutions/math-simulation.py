class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        # 创建一个虚拟头节点，它是新数字链表的起点
        head = curr = ListNode(0)
        # carry 记录进位（比如 7+8=15，进位就是 1）
        carry = 0
        
        # 只要 l1 没完，或者 l2 没完，或者还有进位没处理
        while l1 or l2 or carry:
            # 拿走 l1 当前位置的数，如果没了就当成 0
            val1 = l1.val if l1 else 0
            # 拿走 l2 当前位置的数，如果没了就当成 0
            val2 = l2.val if l2 else 0
            
            # 算出当前位的总和：l1的值 + l2的值 + 之前的进位
            total = val1 + val2 + carry
            
            # 更新进位：看看有没有满 10
            carry = total // 10
            # 创建新节点，存下当前位的余数（比如 15 里的 5）
            curr.next = ListNode(total % 10)
            
            # 指针们向后挪动
            curr = curr.next
            if l1: l1 = l1.next
            if l2: l2 = l2.next
            
        return head.next

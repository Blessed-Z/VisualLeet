class Solution:
    def reverse(self, head, tail):
        # 这是一个内部的小工具，用来把 head 到 tail 之间的节点调头
        pre = head
        cur = pre.next
        first = cur
        while cur != tail:
            next = cur.next
            cur.next = pre
            pre = cur
            cur = next
        # 反转完后，要把这组的新头接在原来的 head 后面
        head.next = pre
        # 原来的组头变成了组尾，要接上后面还没处理的 tail
        first.next = tail 
        return first

    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        # 创建虚拟头节点
        dummy = ListNode(0)
        dummy.next = head
        cur = dummy
        tail = dummy.next
        index = 0
        
        # 只要后面还有小朋友
        while tail:
            index += 1
            # 当我们数到 k 的倍数时，说明攒够了一组
            if index % k == 0:
                # 调用反转工具，把这一组翻转，并返回翻转后的组尾
                cur = self.reverse(cur, tail.next)
                # 下一个组的搜索从当前组尾的后面开始
                tail = cur.next
            else:
                # 还没数够 k 个，继续往后数
                tail = tail.next
                
        return dummy.next

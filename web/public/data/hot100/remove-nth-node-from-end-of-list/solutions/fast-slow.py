class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        # 创建一个虚拟头节点，防止删除的是原本的第一个节点
        newhead = ListNode(0, head)
        # slow 最终会停在“要删除节点”的前一个位置
        slow = newhead
        # fast 负责先跑，拉开差距
        fast = head
        
        # 第一步：先让快跑者 fast 往前跑 n 步
        # 这样快跑者和慢跑者之间就隔了 n 个小朋友
        while n:
            fast = fast.next
            n -= 1
            
        # 第二步：大家以同样的速度一起跑
        # 当快跑者 fast 跑出队伍（变成 None）时
        # 慢跑者 slow 刚好站在倒数第 n 个小朋友的前面！
        while fast:
            slow = slow.next
            fast = fast.next
            
        # 第三步：跨过那个要删除的小朋友
        # slow 的手直接拉住下下个小朋友
        slow.next = slow.next.next
        
        # 返回虚拟头节点的下一个，也就是真正的链表头
        return newhead.next

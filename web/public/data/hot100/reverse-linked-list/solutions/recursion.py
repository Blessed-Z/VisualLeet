class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # 递归的终点：如果链表为空，或者只剩最后一个节点了
        # 它就是反转后的“新头”
        if head == None or head.next == None:
            return head
        
        # 第一步：先让后面的邻居们去完成反转
        # 这一步会一直递归到链表末尾
        new_head = self.reverseList(head.next)
        
        # 第二步：调转船头
        # 原本是：head -> head.next
        # 现在我们要：head.next -> head
        head.next.next = head
        
        # 第三步：断开旧的连接
        # 防止形成环，原来的 head 暂时指向空
        head.next = None
        
        # 返回新的头节点（原本的尾巴）
        return new_head

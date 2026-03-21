class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        # 如果链表为空，或者只有一个节点且没连回自己，那肯定没环
        if head == None or head.next == None:
            return False
        
        # 准备两个跑者
        # 乌龟 slow 走得慢，一次走 1 步
        slow = head
        # 兔子 fast 走得快，一次走 2 步
        fast = head.next
        
        # 如果兔子还没跑到终点（None）
        while slow != fast:
            # 如果兔子发现前面没路了，说明是直线跑道，没环
            if fast == None or fast.next == None:
                return False
            
            # 乌龟挪 1 步
            slow = slow.next
            # 兔子飞 2 步
            fast = fast.next.next
            
        # 如果跳出了 while，说明 slow == fast，兔子追上乌龟啦！
        return True

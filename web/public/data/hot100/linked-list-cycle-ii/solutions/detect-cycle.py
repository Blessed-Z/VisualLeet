class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # 准备乌龟和兔子，都从起点出发
        slow = fast = head
        
        # 第一阶段：判断是否有环（龟兔赛跑）
        while True:
            # 如果兔子跑到了尽头，说明没环
            if not fast or not fast.next:
                return None
            
            # 兔子跑 2 步，乌龟走 1 步
            fast = fast.next.next
            slow = slow.next
            
            # 兔子和乌龟相遇了！说明有环
            if slow == fast:
                break
        
        # 第二阶段：寻找环的入口
        # 把其中一个跑者（这里是 ans）移回起点 head
        ans = head
        
        # 两人现在都以 1 步/次 的速度跑
        while slow != ans:
            ans = ans.next
            slow = slow.next
            
        # 两人再次相遇的地方，就是环的入口！
        return ans

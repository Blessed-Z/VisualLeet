class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        if headA == None or headB == None:
            return None
        
        # 准备两个分身 pa 和 pb
        pa = headA
        pb = headB
        
        # 只要两个分身还没在同一个位置碰面，就继续跑
        while pa != pb:
            # pa 往前跑，如果跑到了 A 链表的终点，就瞬移到 B 链表的起点
            pa = pa.next if pa != None else headB
            
            # pb 往前跑，如果跑到了 B 链表的终点，就瞬移到 A 链表的起点
            pb = pb.next if pb != None else headA
            
        # 此时要么 pa == pb（相遇点），要么 pa == pb == None（不相交）
        return pa

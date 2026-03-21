class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # 创建一个虚拟头节点，它指向真正的头
        # 这样我们处理第一对交换时，逻辑和后面是一样的
        dummy = ListNode(0)
        dummy.next = head
        
        # curr 是我们的施工队长，它总是站在“准备交换的那一对”的前面
        curr = dummy
        
        # 只要后面还有至少两个小朋友，就继续换
        while curr.next and curr.next.next:
            # 记录下这两个小朋友
            node1 = curr.next
            node2 = curr.next.next
            
            # 第一步：施工队长拉住第二个小朋友
            curr.next = node2
            # 第二步：第一个小朋友改拉第二个小朋友后面的人
            node1.next = node2.next
            # 第三步：第二个小朋友反手拉住第一个小朋友
            node2.next = node1
            
            # 完成交换！队长挪到 node1 这里，准备换下一对
            curr = node1
            
        return dummy.next

class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        # 创建一个“虚拟头节点”，它就像是一个排队的领头兵，
        # 我们最后返回的是它后面的内容
        dummy = ListNode(0)
        # curr 是我们的“施工指针”，负责把选中的节点一个一个接在新队伍后面
        curr = dummy
        
        # 只要两条队伍都没走完，就继续挑
        while list1 and list2:
            # 比较两条队伍最前面的人，谁的数字小，谁就先插队
            if list1.val <= list2.val:
                # 把 list1 的这个人接过来
                curr.next = list1
                # list1 队伍向后移一位
                list1 = list1.next
            else:
                # 把 list2 的这个人接过来
                curr.next = list2
                # list2 队伍向后移一位
                list2 = list2.next
            
            # 施工指针往后移，准备接下一个
            curr = curr.next
            
        # 如果有一条队伍走完了，剩下的那条队伍已经是有序的了，
        # 直接整块接到新队伍的末尾即可
        curr.next = list1 if list1 is not None else list2
        
        # 返回虚拟头节点后面的真正队伍
        return dummy.next

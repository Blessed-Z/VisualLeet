class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        # 准备一个空盒子，用来装链表里的数字
        nodes = []
        p1 = head
        
        # 第一步：遍历链表，把所有数字按顺序拿出来，放进盒子里
        while p1 != None:
            nodes.append(p1.val)
            p1 = p1.next
            
        # 第二步：利用 Python 的切片魔法 [::-1] 快速把盒子里的数字倒过来
        # 然后对比倒过来的样子和原来的样子是否一模一样
        # 一模一样就是“回文”！
        return nodes == nodes[::-1]

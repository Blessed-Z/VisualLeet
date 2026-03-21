from typing import List

class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        # 结果大箱子
        al = []
        # 当前正在拼凑的括号路径
        cur = []
        
        def backtrace(symbol, index):
            """
            symbol: 净余左括号数（即 当前左括号数 - 当前右括号数）
            index: 当前已添加的括号总字符数
            """
            # 1. 终止条件：当字符总数达到 2n
            if n * 2 == index:
                # 如果净余为 0，说明所有左括号都被正确闭合了
                if symbol == 0:
                    al.append(''.join(cur))
                return
            else:
                # 2. 尝试添加左括号 '('
                # 条件：已有的左括号总数必须小于 n
                # 计算已有的左括号总数：(index + symbol) // 2
                # 但更简单的逻辑是直接判断：只要 (字符总数+净余)/2 < n
                if (index + symbol) // 2 < n:
                    cur.append('(')
                    # 净余+1，总数+1
                    backtrace(symbol + 1, index + 1)
                    # 回溯
                    cur.pop()
                
                # 3. 尝试添加右括号 ')'
                # 条件：只有当目前有“债”没还（symbol > 0）时，才能加右括号
                if symbol > 0:
                    cur.append(')')
                    # 净余-1，总数+1
                    backtrace(symbol - 1, index + 1)
                    # 回溯
                    cur.pop()
        
        # 从 0 净余，0 长度开始递归
        backtrace(0, 0)
        return al

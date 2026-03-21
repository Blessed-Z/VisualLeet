class Solution:
    def longestValidParentheses(self, s: str) -> int:
        """
        找出最长有效括号子串的长度。
        使用栈模拟，时间复杂度 O(n)，空间复杂度 O(n)。
        """
        # 初始化栈，先放入一个 -1 作为“参照地基”
        # 它可以帮我们处理第一个括号就开始有效的情况，比如 "()"
        stack = [-1]
        ans = 0
        
        # 遍历字符串中的每一个括号及其对应的下标 i
        for i, char in enumerate(s):
            # 如果遇到左括号 '('
            if char == '(':
                # 把它的下标压入栈中，等待右括号来匹配
                stack.append(i)
            # 如果遇到右括号 ')'
            else:
                # 尝试弹出一个左括号来配对
                stack.pop()
                
                # 弹出后，检查栈是否为空
                if not stack:
                    # 如果栈空了，说明刚才那个 ')' 没有人能跟它配对
                    # 那么它就成为了新的“不匹配分割点”，即新的地基
                    stack.append(i)
                else:
                    # 如果栈不为空，说明匹配成功！
                    # 当前有效括号的长度 = 当前下标 i - 弹出后新的栈顶下标
                    # 更新全局最大长度 ans
                    ans = max(ans, i - stack[-1])
                    
        return ans

class Solution:
    def isValid(self, s: str) -> bool:
        # 1. 基础检查：如果长度是奇数，肯定无效
        if len(s) % 2 == 1:
            return False
            
        # 2. 建立配对字典：右括号作为 key，左括号作为 value
        dic = {')': '(', ']': '[', '}': '{'}
        # 初始化魔法口袋（栈）
        stack = []
        
        # 3. 开始遍历每一个括号
        for ch in s:
            # 如果是右括号
            if ch in dic:
                # 检查口袋是否为空，且最上面的左括号是否匹配
                if stack and stack[-1] == dic[ch]:
                    # 匹配成功，从口袋里拿走
                    stack.pop()
                else:
                    # 匹配失败或没袜子了，直接判定无效
                    return False
            else:
                # 如果是左括号，直接塞进口袋里
                stack.append(ch)
                
        # 4. 最后检查口袋是否全部清空
        return not stack

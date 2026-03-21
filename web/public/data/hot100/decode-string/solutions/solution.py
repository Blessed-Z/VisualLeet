class Solution:
    def decodeString(self, s: str) -> str:
        # stack1 用来存之前已经拼好的字符串零件
        stack1 = []
        # stack2 用来存数字倍数
        stack2 = []
        # 记录当前的数字（处理多位数）
        num = 0
        # 记录当前层正在拼凑的字符串
        res = ''
        
        for ch in s:
            if ch.isdigit():
                # 遇到数字，累加计算（处理如 12[a] 的情况）
                num = num * 10 + int(ch)
            elif ch == '[':
                # 遇到左括号，说明要进入下一层套娃
                # 1. 把当前拼好的零件存入栈
                stack1.append(res)
                # 2. 把当前确定的倍数存入栈
                stack2.append(num)
                # 3. 清空当前变量，开始拼括号里的新内容
                num = 0
                res = ''
            elif ch == ']':
                # 遇到右括号，说明当前这层套娃拼完了
                # 1. 弹出之前存的零件和倍数
                prev_res = stack1.pop()
                repeat_times = stack2.pop()
                # 2. 重复当前零件，并接到之前的零件后面
                res = prev_res + repeat_times * res
            else:
                # 遇到普通字母，直接拼在当前零件后面
                res += ch
                
        return res

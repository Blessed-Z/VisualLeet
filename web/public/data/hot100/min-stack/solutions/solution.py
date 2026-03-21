class MinStack:

    def __init__(self):
        # 主栈，用于存储所有的数据
        self.stack = []
        # 辅助栈，用于同步记录当前的最小值
        self.min_stack = []

    def push(self, val: int) -> None:
        # 数据直接进入主栈
        self.stack.append(val)
        # 💡 关键：如果辅助栈为空，或者新值小于等于当前最小值
        if not self.min_stack or val <= self.min_stack[-1]:
            # 也把这个值存入辅助栈
            self.min_stack.append(val)

    def pop(self) -> None:
        # 如果弹出的值正好是当前的最小值
        if self.stack.pop() == self.min_stack[-1]:
            # 辅助栈也要跟着弹出
            self.min_stack.pop()

    def top(self) -> int:
        # 直接看主栈的最顶端
        return self.stack[-1]

    def getMin(self) -> int:
        # 最小值的魔法：直接看辅助栈的最顶端
        return self.min_stack[-1]


# Your MinStack object will be instantiated and called as such:
# obj = MinStack()
# obj.push(val)
# obj.pop()
# param_3 = obj.top()
# param_4 = obj.getMin()

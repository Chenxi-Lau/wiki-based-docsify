# 荣耀面试总结

## 1.机考题目

### 斐波那契数列

> 题目描述：左右手轮换运球，当前手运球的次数是前两次运球次数的总和，例如：第一次左手运球 1 次，第二次运球 2 次，第三次运球 3 次... 以此类推，总运球次数为两手运球次数的总和

```
输入描述：总运球次数及开始运球的手
输出描述：返回最后运球的手、使用的次数及每一轮运球的次数，超过十次需要换行输出

输入："10,left hand"
输出："3 times by left hand"
      1 2 3

解释：
left hand: 1 2 3
right hand: 1 3
```

代码实现：

```js
function main(input) {
  // 处理输入
  const target = parseInt(input.split(',')[0]);
  const handsMap = {
    0: input.split(',')[1],
    1: input.split(',')[1] === 'left hand' ? 'right hand' : 'left hand'
  };
  if (target === 0) {
    console.log(`${handsMap[0]} has't touch the ball`);
  } else {
    // 斐波那契数列
    const fib = function (n) {
      if (n === 0) return 0;
      if (n === 1) return 1;
      return fib(n - 1) + fib(n - 2);
    };

    let total = 0;
    let index = 0;
    const res = [[], []];

    while (total < target) {
      index++;
      total += fib(index);
      const resIndex = index % 2 === 0 ? 1 : 0;
      if (total > target) {
        res[resIndex].push(fib(index) - total + target);
      } else {
        res[resIndex].push(fib(index));
      }
    }

    console.log(`${Math.ceil(index / 2)} times by ${handsMap[index % 2 === 0 ? 1 : 0]}`);
    const currentRes = res[index % 2 === 0 ? 1 : 0];
    const length = Math.floor(currentRes.length / 10);
    for (let i = 0; i <= length; i++) {
      console.log(currentRes.slice(i * 10, (i + 1) * 10).join(' '));
    }
  }
}
```

### 最短路算法 Dijkstra

> 本市有 N 条公交线路（1…N),分别对应票价 pn，可以连通本市 M(1…M)个地点，小明想从地点 x 换乘公交到地点 y，请帮助他找到最省钱的换乘路线。地点个数 M 不超过 100 个，公交车线路个数 N 不超过 100，票价取值区间为 2-10 元，公交车换乘有优惠，每次换乘可省 1 元。公交车只设始发站和终点站，中途不能下车；公交车始发站和终点站可以互换；不需要考虑公交车乘坐时间。

```
输入描述：
总共有 4 个地点，5 条公交线路；第 1 条公交线路连通地点 1 和地点 2，票价 3 元；
第 2 条公交线路连通地点 1 和地点 3，票价 3 元；第 3 条公交线路连通地点 1 和地点 4，票价 4 元；
第 4 条公交线路连通地点 2 和地点 3，票价 5 元；第 5 条公交线路连通地点 3 和地点 4，票价 3 元；小明从地点 1 到地点 3，找出最省钱的线路。

输出描述： 1.如果找不到换乘路线，则输出 NA 2.如果找到最省钱换乘路线，则输出总花费

输入：
4 5
1 1 2 3
2 1 3 3
3 1 4 4
4 2 3 5
5 3 4 3
1 3

输入解释：
第 1 行：地点总个数 公交线路总条数
第 2 行：公交线路号 1 始发站 终点站 票价
第 N+1 行：公交线路号 N 始发站 终点站 票价
最后一行：出发地 目的地`

输出：
3

```

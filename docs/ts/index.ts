/*
 * @Author: your name
 * @Date: 2021-10-18 20:05:57
 * @LastEditTime: 2021-10-18 20:20:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wiki-based-docsify\docs\ts\index.ts
 */
function getLength (value: string | number): string {
  return value.toString()
}

interface Person {
  name: string;
  readonly age: number;
}

let person: Person = {
  name: 'why',
  age: 23,
};

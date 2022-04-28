import { Node } from './node.model';

interface Element {
  priority: number;
  item: any;
}

export class PriorityQueue {
  private items: Element[] = [];

  constructor() {}

  public enqueue(item: any, priority: number): void {
    // Add an item to the queue
    let itemAdded = false;
    let element: Element = { item: item, priority: priority };
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > priority) {
        this.items.splice(i, 0, element);
        itemAdded = true;
        break;
      }
    }
    if (!itemAdded) {
      this.items.push(element);
    }
  }

  public dequeue(): Node {
    // Remove an item from the queue
    return this.items.shift()?.item;
  }

  public isEmpty(): boolean {
    // Check if the queue is empty
    return this.items.length === 0;
  }
}

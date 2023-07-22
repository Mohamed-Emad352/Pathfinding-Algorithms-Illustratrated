# Pathfinding Search Algorithms Illustration

Web application demonstrating how A*, Breadth-first Search (BFS) and Depth-first Search (DFS) search algorithm works to find the shortest path (not in case of DFS) between 2 nodes without hitting any of the obstacles.

## A* Algorithm
A* is an informed searching algorithm that can use coordinates to determine where to search to find the goal node

### The way the A* algorithm works:
1- It starts from the start node with a distance cost of 0.

2- It then gets the heuristic cost between the node and the goal node (here 'Manhattan Distance' is used).

3- Then adds the node to a priority queue with a priority equals to distance cost + heuristic cost.

4- Explores the neighbors of the node and gets the neighbor with the least total cost (distance + heuristic cost)

5- Push the least cost neighbor to the priority queue

6- Mark the parent node itself as 'visited'

7- Loop till the priority queue is empty

![alt text](https://i.ibb.co/sttRd3n/ezgif-2-225acda74b.gif)


## BFS Algorithm
BFS unline A* is an uninformed searching algoritm. It searches blindly level by level till its reaches the goal node. Although it is slower than A* in most cases, it is guaranteed to find the shortest path.

### The way the BFS algorithm works:
1- It starts from the start node and adds it in a queue.

2- It explores the neighbors and mark them as visited.

3- It then adds all neighbors to the queue.

4- Then the neighbor will be selected from the queue and same steps will be repeated.

5- If a node is visited it will not be visited again and won't be pushed to the queue.

6- Repeat till the queue is empty (meaning that all nodes are visited and there is no valid path) or the goal node is reached.

![alt text](https://i.ibb.co/HPBkZsf/ezgif-4-6701804219.gif)


## DFS Algorithm
DFS is another type of uninformed searching algorithms. It searches blindly, but unlike BFS it does not search level by level. It follows a node till it hits a dead end then backtracks and follows another node. Hence the name: "Depth-first search". It does not guarantee a shortest path, but it guarantes a valid path if one is available.

### The way the DFS algorithm works:
1- It selects the start node as the first node.

2- It marks it as visited.

3- It gets all the neighbors of the node.

3- Then it recursively explores all neighbors, where each recursive call the neighbor node will be treated the same way the start node is treated from step 1 to 3.

3- If no neighbors are found for a node, the call returns.

4- Recursion will continue until a path is found or all calls return (meaning all nodes are visited and no path is valid).

![alt text](https://i.ibb.co/JBdQncS/ezgif-2-5c4228cd35.gif)


## Legend
- Green node: Start node

- Orange node: End node

- Blue node: Path node

- Yellow node: Node that has been visited

- Black node: Obstacle node

## Grid sizes available:
- 16x16 (256 node)

- 32x32 (1024 node)

- 64x64 (4096 node - may cause lagging)


## Live Demo
[See live demo here](https://pathfinding-algorithms.web.app/)

## Get Started
Clone the repository and run 'npm install'

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

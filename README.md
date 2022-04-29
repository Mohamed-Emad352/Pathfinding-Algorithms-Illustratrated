# A* Search Algorithm Illustration

Web application demonstrating how A* pathfinding search algorithm works to find the shortest path between 2 nodes without hitting any of the obstacles.

### The way the A* algorithm works:
1- It starts from the start node with a distance cost of 0.

2- It then gets the heuristic cost between the node and the goal node (here 'Manhattan Distance' is used).

3- Then adds the node to a priority queue with a priority equals to distance cost + heuristic cost.

4- Explores the neighbors of the node and gets the neighbor with the least total cost (distance + heuristic cost)

5- Push the least cost neighbor to the priority queue

6- Mark the parent node itself as 'visited'

7- Loop till the priority queue is empty

![alt text](https://i.ibb.co/w7tjMrF/screen-capture.gif)

## Legend
- Green node: Start node

- Orange node: End node

- Blue node: Path node

- Yellow node: Node that has been visited

- Black node: Obstacle node

## Live Demo
[See live demo here](https://a-star-algorithm-illustration.web.app)

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

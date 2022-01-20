import { defineStore } from "pinia";

type FilterType = "all" | "finished" | "unfinished";
type TODO = {
  id: number;
  label: string;
  finished: boolean;
};

export default defineStore("useUserStore", {
  state: () => {
    return {
      filter: "all" as FilterType,
      todos: [] as TODO[],
      nextId: 0,
    };
  },
  getters: {
    findTodo(state) {
      return (id: number): TODO => {
        const todo = state.todos.find((todo) => todo.id === id);
        if (todo === undefined) throw new Error("todo not found");

        return todo;
      };
    },
    finishedTodos(state) {
      return state.todos.filter((todo) => todo.finished);
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.finished);
    },
    filteredTodos(state): TODO[] {
      switch (state.filter) {
        case "finished":
          return this.finishedTodos;
        case "unfinished":
          return this.unfinishedTodos;
        default:
          return this.todos;
      }
    },
  },
  actions: {
    addTodo(label: string) {
      this.todos.push({ id: this.nextId++, label, finished: false });
    },
    toggleTodo(id: number) {
      const todo = this.findTodo(id);
      todo.finished = !todo.finished;
    },
  },
});

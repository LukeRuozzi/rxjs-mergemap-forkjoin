import { forkJoin, from, Observable, of } from "rxjs";
import { map, mergeMap } from "rxjs/operators";

const userUrl = "https://api.mocki.io/v1/b043df5a";
const todoUrl = "https://api.mocki.io/v1/0350b5d5";

interface User {
  name: string;
  city: string;
  todos: Todo[];
}

interface Todo {
  description: string;
  title: string;
}

const todoObs: Observable<Todo[]> = from(
  fetch(todoUrl).then(res => res.json())
);

function getUsers(): Observable<User[]> {
  console.log("getUsers");
  return from(fetch(userUrl).then(res => res.json()));
}

function getUserTodos(user: User): Observable<User> {
  console.log("getTodos for user ", user.name);
  return todoObs.pipe(
    map(todos => {
      user.todos = todos;
      return user;
    })
  );
}

getUsers()
  .pipe(
    mergeMap(users => {
      let subReqs = users.map(user => getUserTodos(user));
      return forkJoin(...subReqs);
    })
  )
  .subscribe(res => {
    console.log(res);

    res.forEach(user => {
      document.getElementById("users").innerHTML += "<p>" + user.name + "</p>";
    });
  });

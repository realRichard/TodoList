import time

from utils import (
    template,
    json_response,
    http_response,
    log,
    render_template,
    redirect,
)

from models.todo import Todo


def index(reqeust):
    todos = Todo.all()
    body = render_template('todo.html', todos=todos)
    r = http_response(body)
    return r


def add(reqeust):
    form = reqeust.json()
    log('add form', form)
    new_todo = Todo.new(form)
    new_todo.hold()
    r = json_response(new_todo.__dict__)
    return r


def delete(reqeust):
    todo_id = reqeust.query.get('id', None)
    if todo_id is not None:
        todo_id = int(todo_id)
        todo = Todo.delete(id=todo_id)
        if todo is not None:
            return json_response(todo.__dict__)
    return redirect('/')


def complete(reqeust):
    todo_id = reqeust.query.get('id', None)
    if todo_id is not None:
        todo_id = int(todo_id)
        todo = Todo.find_by(id=todo_id)
        if todo.complete == True:
            todo.complete = False
        else:
            todo.complete = True
        todo.ut = int(time.time())
        todo.hold()
        return json_response(todo.__dict__)
    return redirect('/')


def get(reqeust):
    todo_id = reqeust.query.get('id', None)
    if todo_id is not None:
        todo_id = int(todo_id)
        todo = Todo.find_by(id=todo_id)
        if todo is not None:
            return json_response(todo.__dict__)
    return redirect('/')


def update_detail(reqeust):
    form = reqeust.json()
    log('detail form', form)
    todo_id = form.get('id', None)
    if todo_id is not None:
        todo_id = int(todo_id)
        todo = Todo.find_by(id=todo_id)
        if todo is not None:
            todo.detail = form.get('detail', todo.detail)
            todo.hold()
            return json_response(todo.__dict__)
    return redirect('/') 


routes_dict = {
    '/': index,
    '/todo/add': add,
    '/todo/delete': delete,
    '/todo/complete': complete,
    '/todo/get': get,
    '/todo/updateDetail': update_detail,
}

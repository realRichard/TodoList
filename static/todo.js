// 添加 todo
var addTodo = function() {
	var addButton = e('.add')
	bindEvent(addButton, 'click', function(event) {
		var value = e('.input-todo').value
		var form = {
			'title': value,
		}
		apiTodoAdd(form, function(r) {
			r = JSON.parse(r)
			log(r)
			if(r != null) {
				var t = todoTemplate(r)
				var todoList = e('.todo-list')
				insertTodoTemplate(todoList, 'afterbegin', t)
				// saveTodos()
			}
		})
	})
}


// 完成 todo 之后的变化
var completeTodo = function() {
	// 利用事件委托给动态元素绑定事件
	var delegate = e('.todo-list')
	bindEvent(delegate, 'click', function(event) {
		var target = event.target
		if (target.id === 'id-input-complate') {
			var parent = target.parentElement
			var todoId = parent.dataset.id
			apiTodoComplete(todoId, function(r) {
				r = JSON.parse(r)
				if(r != null) {
					// closest() 方法, 往上找父
					toggleClass(target.closest('.todo-item'), 'complete')
				}
			})
		}
		// saveTodos()
	})
}

// 删除 todo
var deleteTodo = function() {
	var delegate = e('.todo-list')
	bindEvent(delegate, 'click', function(event) {
		var target = event.target
		if (target.classList.contains('delete-todo')) {
			var parent = target.parentElement
			var todoId = parent.dataset.id
			apiTodoDelete(todoId, function(r) {
				r = JSON.parse(r)
				if(r != null) {
					parent.remove()
				}
			})
		}
		// saveTodos()
	})
}

// 添加描述模板
var detailTemplate = function(todo) {
	var t = `
		<div class="todo-detail" data-id="${todo.id}">
			<div class="title">${todo.title}</div>
			<textarea name="" id="id-textarea-desc" cols="30" rows="10">
				${todo.detail}
			</textarea>
			<div class="remind">
				<input type="date">
				<button class="update">update</button>
				<button class="cancel">cancel</button>
			</div>
		</div>
	`
	return t
}

// 展示添加描述
var showDetail = function() {
	var delegate = e('.todo-list')
	bindEvent(delegate, 'click', function(event) {
		var target = event.target
		if (target.classList.contains('show-detail')) {
			var parent = target.parentElement
			var todoId = parent.dataset.id
			apiTodoGet(todoId, function(r) {
				// log('type before JSON parse', r, typeof r)
				r = JSON.parse(r)
				// log('type after JSON parse', r, typeof r)
				if(r != null) {
					var maskDiv = e('#id-div-mask')
					toggleClass(maskDiv, 'todo-mask')
					// var value = target.previousElementSibling.innerHTML
					var t = detailTemplate(r)
					var todoList = e('.container')
					insertTodoTemplate(todoList, 'beforeend', t)
				}
			})
		}
	})
}


// 取消描述操作
var cancelDesc = function() {
	var delegate = e('.container')
	bindEvent(delegate, 'click', function(event) {
		var target = event.target
		if (target.classList.contains('cancel')) {
			var maskDiv = e('#id-div-mask')
			toggleClass(maskDiv, 'todo-mask')
			remove('.todo-detail')
		}
	})
}

// 创建一个类来保存 todo 的内容及状态
var Todo = function(form) {
	this.title = form.title || ''
	this.complete = form.complete || false
	this.date = form.date || ''
	this.desc = form.desc || ''
}

// 写入 localStorage
var save = function(array) {
	var s = JSON.stringify(array)
	localStorage.todos = s
}

// 导出 localStorage 的 todo
var load = function() {
	var s = localStorage.todos
	return JSON.parse(s)
}

// 保存 todos
var saveTodos = function() {
	var todoList = []
	var todoItems = es('.todo-item')
	for (let i = 0; i < todoItems.length; i++) {
		const element = todoItems[i]
		if (element.classList.contains('complete')) {
			var complete = 'true'
		} else {
			var complete = 'false'
		}
		var title = find(element, '.content').innerHTML
		var form = {
			title: title,
			complete: complete,
		}
		var todo = new Todo(form)
		todoList.push(todo)
	}
	save(todoList)
}

// 刷新后导出 todos
var loadTodos = function() {
	var todos = load()
	var html = ''
	for (let i = 0; i < todos.length; i++) {
		const element = todos[i]
		var title = element.title
		if (element.complete === 'false') {
			var done = ''
		} else {
			var done = 'complete'
		}
		var t = `
			<div class="todo-item ${done}">
				<input id="id-input-complate"  type="checkbox" >
				<span class="content">${title}</span>
				<button class="show-detail">详情</button>
				<button class="delete-todo">删除</button>
			</div>	
		`
		html = html + t
	}
	var todoList = e('.todo-list')
	insertTodoTemplate(todoList, 'beforeend', html)
}

var updateDetail = function() {
	var delegate = e('.container')
	bindEvent(delegate, 'click', function(event) {
		var target = event.target
		if(target.classList.contains('update')) {
			// log('update button', target)
			var detailDiv = e('.todo-detail')
			var todoId = detailDiv.dataset.id
			var value = e('#id-textarea-desc').value
			var form = {
				'detail': value,
				'id': todoId,
			}
			apiTodoUpdateDetail(form, function(r) {
				r = JSON.parse(r)
				if(r != null) {
					alert('updated successfully')
				}
			})
		}
	})
}

var __main = function() {
	// loadTodos()
	addTodo()
	completeTodo()
	deleteTodo()
	showDetail()
	cancelDesc()
	updateDetail()
}

__main()

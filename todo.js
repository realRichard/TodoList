var log = function() {
	console.log.apply(console, arguments)
}

var e = function(selector) {
	return document.querySelector(selector)
}

var es = function(selector) {
	return document.querySelectorAll(selector)
}

// 从 element 开始找
var find = function(element, selector) {
	return element.querySelector(selector)
}
// 绑定事件
var bindEvent = function(element, eventName, callback) {
	element.addEventListener(eventName, callback)
}

// 给相同的绑定事件
var bindEventAll = function(selector, eventName, callback) {
	var elements = es(selector)
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i]
		bindEvent(element, eventName, callback)
	}
}

// todo template
var todoTemplate = function(value) {
	var t = `
		<div class="todo-item">
			<input id="id-input-complate" type="checkbox">
			<span class="content">${value}</span>
			<button class="show-detail">详情</button>
			<button class="delete-todo">删除</button>
		</div>	
	`
	return t
}

// 插入 todo
var insertTodoTemplate = function(element, position, html) {
	element.insertAdjacentHTML(position, html)
}

// 添加 todo
var addTodo = function() {
	var addButton = e('.add')
	bindEvent(addButton, 'click', function(event) {
		var value = e('.input-todo').value
		var t = todoTemplate(value)
		var todoList = e('.todo-list')
		insertTodoTemplate(todoList, 'afterbegin', t)
		saveTodos()
	})
}

// 开关元素的 class
var toggleClass = function(element, className) {
	if (element.classList.contains(className)) {
		element.classList.remove(className)
	} else {
		element.classList.add(className)
	}
}

// 完成 todo 之后的变化
var completeTodo = function() {
	// 利用事件委托给动态元素绑定事件
	var delegate = e('.todo-list')
	bindEvent(delegate, 'click', function(event) {
		var target = event.target
		if (target.id === 'id-input-complate') {
			// closest() 方法, 往上找父
			toggleClass(target.closest('.todo-item'), 'complete')
		}
		saveTodos()
	})
}

// 删除 todo
var deleteTodo = function() {
	var delegate = e('.todo-list')
	bindEvent(delegate, 'click', function(event) {
		var target = event.target
		if (target.classList.contains('delete-todo')) {
			target.parentElement.remove()
		}
		saveTodos()
	})
}

// 添加描述模板
var detailTemplate = function(value) {
	var t = `
		<div class="todo-detail">
			<div class="title">${value}</div>
			<textarea name="" id="id-textarea-desc" cols="30" rows="10">

			</textarea>
			<div class="remind">
				<input type="date">
				<button class="update">submit</button>
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
			var maskDiv = e('#id-div-mask')
			toggleClass(maskDiv, 'todo-mask')
			var value = target.previousElementSibling.innerHTML
			var t = detailTemplate(value)
			var todoList = e('.container')
			insertTodoTemplate(todoList, 'beforeend', t)
		}
	})
}

// 删除 element
var remove = function(selector) {
	var element = e(selector)
	element.remove()
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

var __main = function() {
	loadTodos()
	addTodo()
	completeTodo()
	deleteTodo()
	showDetail()
	cancelDesc()
}

__main()

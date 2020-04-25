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
var todoTemplate = function(r) {
	if(r.complete === false) {
		var t = `
			<div class="todo-item" data-id="${r.id}">
				<input id="id-input-complate" type="checkbox">
				<span class="content">${r.title}</span>
				<button class="show-detail">详情</button>
				<button class="delete-todo">删除</button>
			</div>	
		`
	} else {
		var t = `
			<div class="todo-item complete" data-id="${r.id}">
				<input id="id-input-complate" type="checkbox">
				<span class="content">${r.title}</span>
				<button class="show-detail">详情</button>
				<button class="delete-todo">删除</button>
			</div>	
		`
	}
	return t
}

// 插入 todo
var insertTodoTemplate = function(element, position, html) {
	element.insertAdjacentHTML(position, html)
}

// 开关元素的 class
var toggleClass = function(element, className) {
	if (element.classList.contains(className)) {
		element.classList.remove(className)
	} else {
		element.classList.add(className)
	}
}

// 删除 element
var remove = function(selector) {
	var element = e(selector)
	element.remove()
}

var ajax = function(method, path, data, responseCallback) {
    var r = new XMLHttpRequest()
    // 设置请求方法和请求地址
    r.open(method, path, true)
    // 设置发送的数据的格式为 application/json
    // 这个不是必须的
    r.setRequestHeader('Conten-Type', 'application/json')
    // 注册响应函数
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            // r.response 存的就是服务器发过来的放在 HTTP BODY 中的数据
            responseCallback(r.response)
        }
    }
    // 把数据转换为 json 格式字符串
    data = JSON.stringify(data)
    // 发送请求
    r.send(data)
}

// Todo API
var apiTodoAdd = function(form, callback) {
    var path = '/todo/add'
    ajax('POST', path, form, callback)
}

var apiTodoDelete = function(id, callback) {
	var path = '/todo/delete?id=' + id
	ajax('POST', path, '', callback)
}

var apiTodoComplete = function(id, callback) {
	var path = '/todo/complete?id=' + id
	ajax('POST', path, '', callback)
}

var apiTodoGet = function(id, callback) {
	var path = '/todo/get?id=' + id
	ajax('GET', path, '', callback)
}

var apiTodoUpdateDetail = function(form, callback) {
	var path = '/todo/updateDetail'
	ajax('POST', path, form, callback)
}


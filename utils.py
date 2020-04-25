import time
import os.path
import json

from jinja2 import (
    Environment,
    FileSystemLoader,
)


def log(*args, **kwargs):
    t = time.strftime("%H:%M:%S", time.localtime())
    with open('log.txt', 'a', encoding='utf-8') as f:
        # redirect output to file
        print(t, *args, file=f, **kwargs)


# __file__ 就是本文件的名字
# 得到用于加载模板的目录
path = '{}/templates/'.format(os.path.dirname(__file__))
# 创建一个加载器, jinja2 会从这个目录中加载模板
loader = FileSystemLoader(path)
# 用加载器创建一个环境, 有了它才能读取模板文件
env = Environment(loader=loader)


def render_template(path, **kwargs):
    """
    本函数接受一个路径和一系列参数
    读取模板并渲染返回
    """
    t = env.get_template(path)
    return t.render(**kwargs)


def error(request, code=404):
    """
    根据 code 返回不同的错误响应
    目前只有 404
    """
    e = {
        404: b'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>'
    }
    return e.get(code, b'')


def template(name):
    """
    根据名字读取 templates 文件夹里的一个文件并返回
    """
    path = 'templates/' + name
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def http_response(data):
    header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    r = header + '\r\n' + data
    return r.encode(encoding='utf-8')


def json_response(data):
    """
    本函数返回 json 格式的 body 数据
    前端的 ajax 函数就可以用 JSON.parse 解析出格式化的数据
    """
    # 注意, content-type 现在是 application/json 而不是 text/html
    # 这个不是很要紧, 因为客户端可以忽略这个
    header = 'HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n'
    # json.dumps 用于把 list 或者 dict 转化为 json 格式的字符串
    # ensure_ascii=False 可以正确处理中文
    # indent=2 表示格式化缩进, 方便好看用的
    body = json.dumps(data, ensure_ascii=False, indent=2)
    r = header + '\r\n' + body
    return r.encode(encoding='utf-8')


def response_with_headers(headers, status_code):
    header = 'HTTP/1.1 {} OK\r\n'.format(status_code)
    header += ''.join(['{}: {}\r\n'.format(k, v) for k, v in headers.items()])
    return header


def redirect(location):
    headers = {
        'Content-Type': 'text/html',
    }
    headers['Location'] = location
    # 301 永久重定向 302 普通定向
    # 302 状态码的含义, Location 的作用
    header = response_with_headers(headers, 302)
    r = header + '\r\n' + ''
    return r.encode(encoding='utf-8')

import socket
import _thread
import urllib.parse
import json

from utils import (
    log,
    error,
)

from routes import routes_dict as index_routes
from routes.static import route_dict as static_routes


# 定义一个 class 用于保存请求的数据
class Request(object):
    def __init__(self):
        self.method = 'GET'
        self.path = ''
        self.query = {}
        self.body = ''
        self.headers = {}
        self.cookies = {}

    def add_cookies(self):
        """
        height=169; user=gua
        """
        cookies = self.headers.get('Cookie', '')
        kvs = cookies.split('; ')
        log('cookie', kvs)
        for kv in kvs:
            if '=' in kv:
                k, v = kv.split('=')
                self.cookies[k] = v

    def add_headers(self, header):
        """
        Accept-Language: zh-CN,zh;q=0.8
        Cookie: height=169; user=gua
        """
        lines = header
        for line in lines:
            k, v = line.split(': ', 1)
            self.headers[k] = v
        self.add_cookies()

    def form(self):
        body = urllib.parse.unquote(self.body)
        args = body.split('&')
        f = {}
        for arg in args:
            k, v = arg.split('=')
            f[k] = v
        return f

    def json(self):
        """
        把 body 中的 json 格式字符串解析成 dict 或者 list 并返回
        """
        return json.loads(self.body)


def receive_request(connection):
    # bytes type
    q = b''
    buffer_size = 1024
    while True:
        r = connection.recv(buffer_size)
        q += r
        if len(r) < buffer_size:
            break
    return q


def parsed_path(path):
    index = path.find('?')
    if index == -1:
        return path, {}
    else:
        path, query_string = path.split('?', 1)
        args = query_string.split('&')
        query = {}
        for arg in args:
            k, v = arg.split('=')
            query[k] = v
        return path, query


def response_for_path(path, request):
    path, query = parsed_path(path)
    request.path = path
    request.query = query
    """
    根据 path 调用相应的处理函数
    没有处理的 path 会返回 404
    """
    r = {}
    r.update(index_routes)
    r.update(static_routes)
    response = r.get(path, error)
    return response(request)


def process_request(connection):
    r = receive_request(connection)
    # from bytes to str
    r = r.decode('utf-8')
    # 因为 chrome 会发送空请求导致 split 得到空 list
    # 所以这里判断一下防止程序崩溃
    if len(r.split()) < 2:
        connection.close()
    path = r.split()[1]
    # 创建一个新的 request 并设置
    request = Request()
    request.method = r.split()[0]
    request.add_headers(r.split('\r\n\r\n', 1)[0].split('\r\n')[1:])
    request.body = r.split('\r\n\r\n', 1)[1]
    # 用 response_for_path 函数来得到 path 对应的响应内容
    response = response_for_path(path, request)
    # 把响应发送给客户端
    connection.sendall(response)
    connection.close()


def run(host='', port=2000):
    """
    启动服务器
    """
    # 初始化 socket 套路
    # 使用 with 可以保证程序中断的时候正确关闭 socket 释放占用的端口
    log('start at {}:{}'.format(host, port))
    with socket.socket() as s:
        s.bind((host, port))
        # 监听 接受 读取请求数据 解码成字符串
        s.listen(3)
        # 无限循环来处理请求
        while True:
            connection, address = s.accept()
            log('连接成功, 使用多线程处理请求', address)
            # 开一个新的线程来处理请求, 第二个参数是传给新函数的参数列表, 必须是 tuple
            # tuple 如果只有一个值 必须带逗号
            _thread.start_new_thread(process_request, (connection,))


if __name__ == '__main__':
    # 生成配置并且运行程序
    config = dict(
        host='',
        port=2000,
    )
    run(**config)
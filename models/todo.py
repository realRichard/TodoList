import time

from models import Model


class Todo(Model):
    def __init__(self, form):
        self.id = form.get('id', None)
        self.title = form.get('title', '')
        self.detail = form.get('detail', '')
        self.complete = form.get('complete', False)
        self.ct = form.get('ct', int(time.time()))
        self.ut = form.get('ut', self.ct)

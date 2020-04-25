import json
import time


class Model(object):
    @classmethod
    def all(cls):
        path = cls.data_path()
        ms = Model.load(path)
        # from dict to object
        objects = [cls.new(m) for m in ms]
        return objects

    @classmethod
    def new(cls, form, **kwargs):
        m = cls(form)
        for k, v in kwargs.items():
            setattr(m, k, v)
        return m

    @classmethod
    def find_by(cls, **kwargs):
        for k, v in kwargs.items():
            key = k
            value = v
        ms = cls.all()
        for i in ms:
            # if i[key] == value:
            # 'User' object is not subscriptable
            if i.__dict__[key] == value:
                return i
        return None

    @classmethod
    def find_all(cls, **kwargs):
        for k, v in kwargs.items():
            key = k
            value = v
        ms = cls.all()
        objects = []
        for i in ms:
            if i.__dict__[key] == value:
                objects.append(i)
        return objects

    @classmethod
    def delete(cls, **kwargs):
        for k, v in kwargs.items():
            key = k
            value = v
        ms = cls.all()
        index = -1
        for i, m in enumerate(ms):
            if m.__dict__[key] == value:
                index = i
                break
        if index != -1:
            s = ms.pop(index)
            data = [m.__dict__ for m in ms]
            path = cls.data_path()
            cls.save(data, path)
            return s
        else:
            return None

    @classmethod
    def data_path(cls):
        class_name = cls.__name__
        path = 'data/' + class_name + '.txt'
        return path

    def format_ts(self):
        # ct = time.strftime("%Y-%m-%d %H:%M:%S", self.__dict__['ct'])
        # TypeError: Tuple or struct_time argument required
        # do't forget time.localtime(time.time()), localtime need timestamp paremeter
        ct = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(self.__dict__['ct']))
        return ct

    def hold(self):
        ms = self.all()
        # ms is list
        if self.id is None:
            # new data
            # plus id attribute
            if len(ms) == 0:
                # means there is no data yet
                self.id = 1
            else:
                self.id = ms[-1].id + 1
            ms.append(self)
        else:
            # not new data
            # find the data with id 
            # then modify it
            index = -1
            for i, m in enumerate(ms):
                if m.id == self.id:
                    index = i
                    break
            ms[index] = self
        # save 
        # from object to dict
        data = [m.__dict__ for m in ms]
        path = self.data_path()
        self.save(data, path)

    def __repr__(self):
        classname = self.__class__.__name__
        properties = ['{}: ({})'.format(k, v) for k, v in self.__dict__.items()]
        s = '\n'.join(properties)
        return '< {}\n{}\n>\n'.format(classname, s)

    @staticmethod
    def save(data, path):
        with open(path, 'w+', encoding='utf-8') as fp:
            json.dump(data, fp, ensure_ascii=False, indent=4)

    @staticmethod
    def load(path):
        with open(path, 'r', encoding='utf-8') as fp:
            return json.load(fp)
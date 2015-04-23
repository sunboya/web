
class sqldb:
  #先验证数据库是否存在
  def __init__(self):
    if os.path.exists("todos.db"):
      #如果数据库存在，就直接连接
      self.conn = db.connect("todos.db")
      self.cu = self.conn.cursor()
    else:
      #如果数据库不存在，连接，并生成表
      self.conn = db.connect("todos.db")
      self.cu = self.conn.cursor()
      self.cu.execute("""create table todos(
        id integer primary key,
        name text,
        date text,
        content text) """)
      self.cu.execute("""insert into todos values(1,'Ahai','2010-05-19 15:11:20','Ahi alaws be ok!')""")
      self.conn.commit()
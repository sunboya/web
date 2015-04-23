# -*- coding: UTF-8 -*-
import web

urls = ("/(.*)", "hello")
app = web.application(urls, globals())

class hello:
    def GET(self,code):
        referer = web.ctx.env.get('HTTP_USER_AGENT')
        return referer

if __name__ == "__main__":
    app.run()

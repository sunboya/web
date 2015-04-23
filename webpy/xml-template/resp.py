# -*- coding: UTF-8 -*-
import web

render = web.template.render('template/', cache=False)

urls = (
    '/(.*)', 'index'
)

app = web.application(urls, globals())

class index:
    def GET(self, code):
        web.header('Content-Type', 'text/xml')
        #这个render.后面的是模板名resp.xml
        return render.resp(code)

web.webapi.internalerror = web.debugerror
if __name__ == '__main__': app.run()
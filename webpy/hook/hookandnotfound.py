# -*- coding: UTF-8 -*-
import web

def notfound():
    return web.notfound("Sorry, the page you were looking for was not found.")

def my_processor(handler): 
    print 'before handling'
    result = handler() 
    print 'after handling'
    return result

def my_loadhook():
    pass

def my_unloadhook():
    print "my unload hook"

urls = ("/(hello)", "hello")
app = web.application(urls, globals())


class hello:
    def GET(self,code):
        referer = web.ctx.env.get('HTTP_USER_AGENT')
        return referer

if __name__ == "__main__":
    app.add_processor(web.loadhook(my_loadhook))
    app.add_processor(web.unloadhook(my_unloadhook))
    app.notfound = notfound
    app.run()
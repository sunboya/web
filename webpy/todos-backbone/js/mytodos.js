$(function(){
  //tode model
  var todo = Backbone.Model.extend({

    initialize:function(){

    },

    defaults:function(){
      return {
        title:"empty todo...",
        order:Todos.nextOrder(),
        done:false
      }
    },

    toggle:function(){
      this.save({done:!this.get('done')});
    }

  });

  var TodoList = Backbone.Collection.extend({
    model:todo,
    localStorage: new Backbone.LocalStorage("todos-backbone"),
    done:function(){
      return this.where({done:true});
    },
    remaining:function(){
      return this.where({done:true});
    },
    nextOrder:function(){
      if(!this.length) return 1;
      return this.last().get('order') + 1;
    },
    comparator:"order"

  });


  var Todos = new TodoList;

  var TodeView = Backbone.View.extend({
    tagName:'li',
    template:_.template($('#item-template').html()),
    events:{
      "keypress .edit":"updateOnEnter",
      "blur .edit":"close",
      "click .toggle":"toggleDone",
      "click a.destroy":"clear",
      "dbclick .view":"edit"
    },
    initialize:function(){
      this.listenTo(this.model,'change',this.render);
      this.listenTo(this.model,'destroy',this.remove);
    },
    render:function(){
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass("done",this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },
    edit:function(){
      this.$el.addClass('editing');
      this.input.focus();
    },
    toggleDone:function(){
      this.model.toggle();
    },
    close:function(){
       var value = this.input.val();
      if(!value){
        this.clear();
      }else{
        this.model.save({title:value});
        this.$el.removeClass('editing');
      }
    },
    updateOnEnter:function(e){
      if(e.keyCode == 13) 
        this.close();
    },
    clear:function(){
      this.model.destroy();
    }

  });

  var AppView = Backbone.View.extend({
    el: $("#todoapp"),
    statsTemplate:_.template($('#stats-template').html()),
    events:{
      "keypress #new-todo":"createOnEnter",
      "click #clear-completed":"clearDone",
      "click #toggle-all":"toggleAll"
    },
    initialize:function(){
      this.input = this.$('#new-todo');
      this.allCheckBox = this.$('#toggle-all');
      this.footer = this.$('footer');
      this.main = $('#main');
      this.listenTo(Todos,"all",this.render);
      this.listenTo(Todos,"add",this.addOne);
      this.listenTo(Todos,'reset',this.addAll);
      Todos.fetch();
    },
    render:function(){
      var done = Todos.done().length;
      var remaining = Todos.remaining().length;

      if (Todos.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }

    },
    addOne:function(todo){
      var todeView = new TodeView({model:todo});
      this.$('#todo-list').append(todeView.render().el);
    },
    addAll:function(){
      Todos.each(this.addOne,this);
    },
    createOnEnter:function(e){
      if(e.keyCode != 13) return;
      var value = this.input.val();
      if(!value) return;
      Todos.create({title:value});
      this.input.val('');
      this.input.focus();
    },
    clearDone:function(){
      _.invoke(Todos.done(),'destroy');
      return false;
    },
    toggleAll:function(){
      var dones = !!(this.allCheckBox.attr('checked'));
      Todos.each(function(todo){
        todo.save({
          'done':dones
        });
      });
    }



  });
  var App = new AppView;
})
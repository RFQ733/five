// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        output: {
            default: null,
            type: cc.RichText
        },
        change:{
            default: null,
            type: cc.Node
        },
        back:{
            default: null,
            type: cc.node
        },
        return:{
            default: null,
            type: cc.Node
        },
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.debug.setDisplayStats(false);
        this.output.string +="请选择任务\n";
        this.node.on(cc.Node.EventType.TOUCH_START , this.onTouchStart , this);
            
    },

    onTouchStart(event){
        // var type = event.currentTarget;
       
       var rpos = event.getLocation();
       if(Math.abs(this.return.x-rpos.x)<300) 
       {
           cc.director.loadScene("moon");
        }
        else{
            this.output.string +="其他暂时不支持哦QWQ<color=#88ffff>请选择航空任务";
        }
    },
    start () {     
    },
});

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


/*
 *RFQ：
 *  cc.class 是cocos 的专属的类的名称
 *  properties应该是它的data成员们
 *
 *          RFQ：
 *           //！存在疑惑
 *           // G是isit中心，F就是多大的力，R就是角度
 */ 
cc.Class({
    extends: cc.Component,

    properties: {
        speed_x: 0,
        speed_y: 0,
        flame: cc.Node,
        
        /*RFQ：下面的注释掉的应该是默认代码的一部分但是对本class没有用。*/
        
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


    /* 
     *   RFQ:
     *       on load 加载
     *       
     *       
    */
    onLoad () {
        this.ctrl = this.node.parent.getComponent('Controller');
        this.flame.opacity = 0;
        
    },

    start () {

    },
    /**
     * RFQ：
     * 所以说我们至今仍不知道update 的意思是更新什么。
     * 一步步看吧。
     * 
     * phase 当前的等级？或者说当前面临的任务/状态
     * 
     *  
     */
     /*
      *  RFQ：
      *  后来回来的：
      *      R.G，F不过是controller的元素罢了。。
      *      仍不知ctrl是什么。
      *       ctrl 就是 controller的缩写。
     */ 

    update (dt) {
        if (this.ctrl.phase == 1) {
            var change = this.node;
            //存一手引用共下面使用
            this.speed_y += this.ctrl.G;
            //好家伙这个连按压力度都有吗，强啊传感器
            //收回上一句貌似是指边缘位置吗
            var f_x = Math.sin(-Math.PI / 180 * change.angle);
            var f_y = Math.cos(Math.PI / 180 * change.angle);
            
            this.speed_x *= 1.001;
            this.speed_x += f_x * this.ctrl.F;
            this.speed_y += f_y * this.ctrl.F;

            change.x += this.speed_x * dt * 60;
            change.y += this.speed_y * dt * 60;
            //RFQ：
            
            change.angle += this.ctrl.R;
            //hua'diao 的确F应该是中心位置的意思。
            if (this.ctrl.F > 0) {
                this.flame.opacity = 255;
            } else {
                this.flame.opacity = 0;
            }
        }
        else {
            this.flame.opacity = 0;
        }
    },
});

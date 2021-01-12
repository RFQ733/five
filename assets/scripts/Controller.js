// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        //子成员
        //有一些疑惑。
        //注意到moon.fire 在主画布的组件中有controller这一个组件。
        //那么其他的node.parent 难道是根据节点的properties实现的吗
        change5: cc.Node,
        up: cc.Node,
        ret: cc.Node,
        borer: cc.Node,
        soil: cc.Node,
        flag: cc.Node,
        output: cc.RichText,
        ending: cc.Node,
        zhangai:{
            default: null,
            type: cc.Node
        },
        // zhangai: cc.Node,
        // G重力
        // F通过按压施加的力
        // R角度
        G: -0.01,
        F: 0,
        R: 0,
        phase: 1,
        ticks: 0,

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

        this.node.on(cc.Node.EventType.TOUCH_START , this.onTouchStart , this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd , this);   

        this.output.string = "1. 月面着陆\n<color=#88ffff>点击屏幕中部：点火减速\n点击屏幕两侧：调整姿态\n注意控制着落时的速度和角度</c>\n";
        this.output.string += this.zhangai.x;
    },

    start () {

    },
    /**
     * 点击任意地方开始
     * {RFQ}event 传入点击事件
     * 若pos.x<cc.winsize.width/2 - 100 then controller的R设置为0.25 （
     *     当然这个R之后会传入change5或其他地方于是发挥作用）
     * 百度：
     *     Touch事件简介
     *       pc上的web页面鼠 标会产生onmousedown、onmouseup、onmouseout、onmouseover、onmousemove的事件，
     *       但是在移动终端如 iphone、ipod  Touch、ipad上的web页面触屏时会产生ontouchstart、ontouchmove、ontouchend、ontouchcancel 事件，
     *      分别对应了触屏开始、拖拽及完成触屏事件和取消。
     *      当按下手指时，触发ontouchstart；
     *       当移动手指时，触发ontouchmove；
     *      当移走手指时，触发ontouchend。
     */ 
    onTouchStart (event) {
        var pos = event.getLocation();
        //按压在左边or右边
        if (pos.x < cc.winSize.width / 2 - 100) {
            this.R = 0.25;
        } else if (pos.x > cc.winSize.width / 2 + 100) {
            this.R = -0.25;
        } else {
            this.F = 10 * 0.005;
        }
    },

    /**
     * 按压结束
     */
    onTouchEnd (event) {
        this.F = 0;
        this.R = 0;
        // tick 用时（也可能是完成时的用时。）
        // 
        if (this.phase == 4 && this.ticks > 1) {
            cc.game.restart();
        }
    },

    /***RFQ:
     * 
     * 这里的update我还是能看懂哒*★,°*:.☆(￣▽￣)/$:*.°★* 。
     * phase 也明白了是指阶段
     * phase == 1 指降落阶段 
     * phase == 2 
     * 显然就是搞一手更新左上角的字符串
     * dt是默认参数的话应该就是每一秒（最小时间单位）（真dt）
     */
    update (dt) {
        /*
        //测试代码
        if(this.phase==1){
            if(Math.abs(this.change5.getComponent('change5').speed_x) > 1 || Math.abs(this.change5.getComponent('change5').speed_y) > 1){
                this.phase =4;
                this.output.string +="<color=#ff8888>过快里面人被你搞死了</c>\n点击重试";
            }
            if(Math.abs(this.change5.x-0)<=100){
                this.phase =4;
                this.output.string +="<color=#ff8888>我不过是想让你死罢了</c>"
            }
            
        }
        */
       if(this.phase==1){
            
           if(Math.abs(this.zhangai.x-this.change5.x)<=10){
               this.phase = 4;
               
               this.output.string += "<color=#ff8888>GG 撞到障碍物翻车啦！</c>\n点击屏幕再次尝试"
           }
       }

        if (this.phase == 1) {
            if (Math.abs(this.change5.x) > 300 || Math.abs(this.change5.y) > 500) {
                this.phase = 4;
                this.output.string += "<color=#ff8888>偏离目标区域太远，着陆失败！</c>\n点击屏幕再次尝试";
            }
            if (this.change5.y < -300) {
                var c5 = this.change5.getComponent('change5');
                if (Math.abs(c5.speed_x) > 1 || Math.abs(c5.speed_y) > 1) {
                    this.phase = 4;
                    this.output.string += "<color=#ff8888>速度太快，着陆失败！</c>\n点击屏幕再次尝试";
                } else if (Math.abs(this.change5.rotation) > 30) {
                    this.phase = 4;
                    this.output.string += "<color=#ff8888>角度太大，着陆失败！</c>\n点击屏幕再次尝试";
                } else {
                    this.phase = 2;
                    this.output.string += "<color=#88ff88>着陆成功！</c>\n\n2. 月壤采集工作中\n";
                    this.land();                    
                }
            }
        } 
        else if (this.phase == 3) {
            if (Math.abs(this.up.x) > 300 || Math.abs(this.up.y) > 500) {
                this.phase = 4;
                this.output.string += "<color=#ff8888>偏离轨道器太远，对接失败！</c>\n点击屏幕再次尝试";                
            }
            if (Math.abs(this.up.y-this.ret.y)<10 && Math.abs(this.up.x-this.ret.x)<10) {
                var up = this.up.getComponent('up');
                // var ret = this.ret.getComponent('return');
                if (Math.abs(up.speed_x-0.5) > 1 || Math.abs(up.speed_y) > 1) {
                    this.output.string += "<color=#ff8888>速度太快，对接失败！</c>\n点击屏幕再次尝试";
                } else if (Math.abs(this.change5.rotation) > 30) {
                    this.output.string += "<color=#ff8888>角度太大，对接失败！</c>\n点击屏幕再次尝试";
                } else {
                    this.output.string += "<color=#88ff88>对接成功！</c>\n任务完成";
                    this.ending.runAction(cc.fadeIn(1));
                }
                this.phase = 4;
            }
        } 
        else if (this.phase == 4) {
            //破案了ticks为用时。
            this.ticks += dt;
        }
    },
    /**
     * 登月的判定脚本
     */
    land () {
        var c5 = this.change5;
        if (c5.angle == 0) {
            this.bore1();
        }
        else {
            // 此段为落地后的调整动画，可略过
            var dx = c5.width * 0.23 * Math.cos(Math.PI / 180 * c5.angle);
            var dy = c5.width * 0.23 * Math.sin(Math.PI / 180 * c5.angle);
            if (c5.angle < 0) {
                c5.anchorX = 0.73;
                c5.x += dx;
                c5.y += dy;
            } else {
                c5.anchorX = 0.27;
                c5.x -= dx;
                c5.y -= dy;
            }
            for (var i = c5.children.length - 1; i >= 0; i--) {
                var item = c5.children[i];
                var sign = c5.anchorX > 0.5 ? -1 : 1;
                item.x += sign * c5.width * 0.23;
            }
            var a1 = cc.rotateTo(Math.abs(c5.angle/45), 0);
            var a2 = cc.callFunc(this.bore1, this);
            c5.runAction(cc.sequence(a1, a2));
            /**
             * 这sequence也这么强的吗
             * 学一下好吧，runAction 是真的强啊。
             */
        }
    },

    bore1 () {
        this.borer.opacity = 255;
        //拉伸动作
        var a1 = cc.scaleTo(2, 1, 20);
        var a2 = cc.callFunc(this.bore2, this);
        this.borer.runAction(cc.sequence(cc.delayTime(1), a1, cc.delayTime(1), a2));
    },

    bore2 () {
        var a1 = cc.scaleTo(2, 1, 20);
        this.soil.y = this.borer.y - this.borer.height * this.borer.scaleY;
        this.soil.opacity = 255;
        var a2 = cc.callFunc(this.bore3, this);        
        this.soil.runAction(cc.sequence(a1, cc.delayTime(2), a2));
    },

    bore3 () {
        var a1 = cc.scaleTo(2, 1, 0.1);
        this.soil.anchorY = 1;
        this.soil.y = this.borer.y;
        var a2 = cc.callFunc(this.flag1, this);
        this.soil.runAction(cc.sequence(a1, cc.delayTime(1), a2));
    },

    flag1 () {
        this.flag.opacity = 255;
        //a1 表示旋转
        var a1 = cc.rotateTo(1, 360);
        //RFQ：
        //callfunc的第二个参数是什么呢？
        //callfunc第一个参数是请求的函数，二则是请求作用的对象。
        //cc.CallFunc()动作允许你从一个动作中调用一个方法。在连续动作的结尾这个方法很有用。
        var a2 = cc.callFunc(this.flag2, this);
        this.flag.runAction(cc.sequence(a1, a2));
    },

    flag2 () {
        this.phase = 3;
        this.output.string += "<color=#88ff88>采集完毕！</c>\n\n3. 月面上升\n<color=#88ffff>";
        this.output.string +="点击屏幕中部：点火上升\n点击屏幕两侧：调整姿态\n注意控制对接时的速度和角度</c>\n";
    },

    restart () {

    }
});


let backgroundColors = ['#F0F5FF', '#FDFBE9', '#F1FFF0', '#FFF0F0'];

const PAGE = {

    data: {
        //backgroundColors 卡片背景色
        backgroundColors: backgroundColors,
        //itemWidth 卡片宽度
        itemWidth: 320,
        //itemHeight 卡片高度
        itemHeight: 158,
        //paddingOffset 卡片移动距离边缘的距离
        paddingOffset: 20,
        //zIndex:  卡片层级
        zIndex: 0,
        //item:  当前点击/移动的卡片元素
        item: null,
        //itemOffsetTop   卡片距离顶部的距离
        itemOffsetTop: null,
        //itemOffsetLeft  卡片距离左部的距离
        itemOffsetLeft: null,
        //pageX   鼠标点击X轴位置
        pageX: null,
        //pageY  鼠标点击Y轴位置
        pageY: null,
        //isLock  事件锁
        isLock: true,
    },

    init: function () {
        this.setDefaultData();
        this.bind();
    },

    bind: function () {
        let submitBtn = document.getElementById('submit-btn');
        submitBtn.addEventListener('click', this.getCardContent);

        let cardBoard = document.getElementById('card-board');
        this.onEventListener(cardBoard, 'mousedown', 'card-mask', this.handleMouseDown);

        window.addEventListener('mousemove', this.handleMouseMove);

        window.addEventListener('mouseup', this.handleMouseUp);
    },

    //产生4张初始的留言卡片
    setDefaultData: function () {
        let value = '耿昌宇老师，我是7月5日购买课程的学员，还有一个视频就全部学完了。你的课程简单易学非常感谢，恰逢新年来临送上我的祝福！';
        for (let i = 0; i < 4; i++) {
            PAGE.addCard(value);
        }
    },

    onEventListener: function (parentNode, action, ChildClassName, callback) {
        parentNode.addEventListener(action, function (e) {
            e.target.className.indexOf(ChildClassName) >= 0 && callback(e);
        })
    },

    getCardContent: function () {
        let textareaInput = document.getElementById('textarea-input');
        let value = textareaInput.value;
        if (value == '') textareaInput.placeholder = '输入内容不能为空';
        else {
            value = PAGE.truncateText(value);
            PAGE.addCard(value);
            textareaInput.value = '';
            textareaInput.placeholder = '请输入内容(不超过80个字)';
        }
    },

    truncateText: function(value) {
        if(value.length > 80) {
            value = value.substring(0, 79) + '...';
        }
        return value;
    },

    addCard: function (value) {
        let cardBoard = document.getElementById('card-board');
        let containerWidth = cardBoard.offsetWidth;
        let containerHeight = cardBoard.offsetHeight;
        let itemWidth = PAGE.data.itemWidth;
        let itemHeight = PAGE.data.itemHeight;
        let paddingOffset = PAGE.data.paddingOffset
        let maxWidth = containerWidth - itemWidth - paddingOffset;
        let maxHeight = containerHeight - itemHeight - paddingOffset;
        let randomLeft = PAGE.randomBetween(paddingOffset, maxWidth);
        let randomTop = PAGE.randomBetween(paddingOffset, maxHeight);
        let zIndex = ++PAGE.data.zIndex;
        let backgroundColors = PAGE.data.backgroundColors;
        let backgroundColor = backgroundColors[zIndex % backgroundColors.length];
        let cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        cardItem.id = 'card-item';
        let styleStr = `
                    z-index : ${zIndex};
                    background-color : ${backgroundColor};
                    top : ${randomTop}px;
                    left : ${randomLeft}px;
                `;
        cardItem.setAttribute('style', styleStr);
        cardItem.innerHTML = `<img class="card-bg-left" src="../image/message_bg_left.png">
                              <img class="card-bg-right" src="../image/message_bg_right.png">
                              <div class="card-title">小兔兔说：</div>
                              <div class="card-txt">${value}</div>
                              <div class="card-mask"></div>`
        cardBoard.appendChild(cardItem);
    },

    randomBetween: function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },

    //鼠标点击存储数据并开锁
    handleMouseDown: function (e) {
        let item = e.target.parentNode;
        item.style.zIndex = ++PAGE.data.zIndex;
        PAGE.data.item = item;
        PAGE.data.itemOffsetLeft = item.offsetLeft;
        PAGE.data.itemOffsetTop = item.offsetTop;
        PAGE.data.pageX = e.pageX;
        PAGE.data.pageY = e.pageY;
        PAGE.data.isLock = false;
    },

    //鼠标移动根据前后数据移动卡片
    handleMouseMove: function (e) {
        if (!PAGE.data.isLock) {
            let cardBoard = document.getElementById('card-board')
            let containerWidth = cardBoard.offsetWidth;
            let containerHeight = cardBoard.offsetHeight;
            let itemWidth = PAGE.data.itemWidth;
            let itemHeight = PAGE.data.itemHeight;
            let paddingOffset = PAGE.data.paddingOffset;
            let maxWidth = containerWidth - itemWidth - paddingOffset;
            let maxHeight = containerHeight - itemHeight - paddingOffset;
            let translateX = e.pageX - PAGE.data.pageX + PAGE.data.itemOffsetLeft;
            let translateY = e.pageY - PAGE.data.pageY + PAGE.data.itemOffsetTop;
            translateX = translateX > maxWidth ? maxWidth : translateX;
            translateX = translateX < paddingOffset ? paddingOffset : translateX;
            translateY = translateY > maxHeight ? maxHeight : translateY;
            translateY = translateY < paddingOffset ? paddingOffset : translateY;
            PAGE.data.item.style.left = translateX + 'px';
            PAGE.data.item.style.top = translateY + 'px';
        }
    },

    //鼠标回弹关锁 
    handleMouseUp: function (e) {
        PAGE.data.isLock = true;
    },
}

PAGE.init();
import React, {createContext, PureComponent} from 'react';
import { ToastAndroid } from 'react-native';

export const initialStore = {
    historyList:[
        {
            currentTime: 206.247,
            date: [2018, 12, 4, 19, 12],
            duration: 1474.181,
            id: 534926,
            img: "http://img3.doubanio.com/view/photo/s_ratio_poster/public/p2100245550.jpg",
            isEnd: false,
            name: "新番哆啦A梦",
            sourceName: "第521集",
            sourceId: "3195811",
        },
        {
            currentTime: 106.247,
            date: [2018, 12, 4, 19, 12],
            duration: 1474.181,
            id: 534921,
            img: "http://img3.doubanio.com/view/photo/s_ratio_poster/public/p2100245550.jpg",
            isEnd: false,
            name: "新番哆啦A梦2新番哆啦A梦2",
            sourceName: "第522集",
        },
    ],
    fllowList:[
        {
            id: 534926,
            img: "http://img3.doubanio.com/view/photo/s_ratio_poster/public/p2100245550.jpg",
            name: "新番哆啦A梦",
        },
        {
            id: 534927,
            img: "http://img3.doubanio.com/view/photo/s_ratio_poster/public/p2100245550.jpg",
            name: "新番哆啦A梦222",
        },
    ]
};

export const Store = createContext(initialStore);

export class StoreProvider extends PureComponent {

    state = {
        ...initialStore
    }

    //添加历史记录
    addHistory = (item) => {
        const {historyList} = this.state;
        const index = historyList.findIndex(el=>el.id===item.id);
        if(index>=0){
            historyList.splice(index, 1);
        }
        this.setState({historyList:[item,...historyList]});
    }

    //删除历史记录
    removeHistory = (idList) => {
        const {historyList} = this.state;
        const _historyList = historyList.filter(el=>!idList.find(d=>d===el.id));
        this.setState({historyList:_historyList});
    }

    //查找历史记录
    findHistory = (id) => {
        const {historyList} = this.state;
        return historyList.find(el=>el.id===id);
    }

    //添加收藏
    addFollow = (item) => {
        const {fllowList} = this.state;
        this.setState({fllowList:[item,...fllowList]});
    }

    //取消收藏
    removeFollow = (idList) => {
        const {fllowList} = this.state;
        const _fllowList = fllowList.filter(el=>!idList.find(d=>d===el.id));
        this.setState({fllowList:_fllowList});
    }

    //查找收藏
    findFollow = (id) => {
        const {fllowList} = this.state;
        return !!fllowList.find(el=>el.id===id);
    }

    //设置收藏
    setFollow = (item) => {
        if(this.findFollow(item.id)){
            this.removeFollow([item.id]);
            ToastAndroid.show(" ╮(╯﹏╰）╭ 已取消收藏 ", ToastAndroid.SHORT);
        }else{
            this.addFollow(item);
            ToastAndroid.show("ヾ(ｏ･ω･)ﾉ 收藏成功", ToastAndroid.SHORT);
        }
    }

    render(){
        const {historyList,fllowList} = this.state;
        return(
            <Store.Provider value={{
                historyList:historyList,
                addHistory:this.addHistory,
                removeHistory:this.removeHistory,
                findHistory:this.findHistory,
                fllowList:fllowList,
                addFollow:this.addFollow,
                removeFollow:this.removeFollow,
                findFollow:this.findFollow,
                setFollow:this.setFollow,
            }}>
                {this.props.children}
            </Store.Provider>
        )
    }
}
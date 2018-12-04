import React, {createContext, PureComponent} from 'react';

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
    fllowList:[]
};

export const Store = React.createContext(initialStore);

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

    render(){
        const {historyList} = this.state;
        return(
            <Store.Provider value={{
                historyList:historyList,
                addHistory:this.addHistory,
                removeHistory:this.removeHistory,
                removeAllHistory:this.removeAllHistory,
            }}>
                {this.props.children}
            </Store.Provider>
        )
    }
}
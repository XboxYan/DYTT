import React, { createContext, PureComponent } from 'react';
import { ToastAndroid } from 'react-native';
import Storage from './storage';
import i18n from './i18n';

export const initialStore = {
    historyList: [],
    fllowList: [],
    settings: {
        allowMoblieNetwork: true,
        preLoad: false,
        autoPlayNext: true,
    }
};

export const Store = createContext(initialStore);

export class StoreProvider extends PureComponent {

    state = {
        ...initialStore
    }

    async componentDidMount() {
        const data_history = await Storage.get('historyList') || [];
        this.setState({ historyList: data_history });
        const data_fllow = await Storage.get('fllowList') || [];
        this.setState({ fllowList: data_fllow });
    }


    componentDidUpdate(prevProps, prevState) {
        //改变时保存
        if (prevState.historyList !== this.state.historyList) {
            Storage.save('historyList', this.state.historyList);
            //console.warn('historyList save');
        }
        if (prevState.fllowList !== this.state.fllowList) {
            Storage.save('fllowList', this.state.fllowList);
            //console.warn('fllowList save');
        }
    }

    //初始化
    initHistory = (list) => {
        this.setState({ historyList: list });
    }

    //添加历史记录
    addHistory = (item) => {
        const { historyList } = this.state;
        const index = historyList.findIndex(el => el.id === item.id);
        if (index >= 0) {
            historyList.splice(index, 1);
        }
        this.setState({ historyList: [item, ...historyList] });
    }

    //删除历史记录
    removeHistory = (idList) => {
        const { historyList } = this.state;
        const _historyList = historyList.filter(el => !idList.find(d => d === el.id));
        this.setState({ historyList: _historyList });
    }

    //查找历史记录
    findHistory = (id) => {
        const { historyList } = this.state;
        return historyList.find(el => el.id === id);
    }

    //初始化
    initFollow = (list) => {
        this.setState({ fllowList: list });
    }

    //添加收藏
    addFollow = (item) => {
        const { fllowList } = this.state;
        this.setState({ fllowList: [item, ...fllowList] });
    }

    //取消收藏
    removeFollow = (idList) => {
        const { fllowList } = this.state;
        const _fllowList = fllowList.filter(el => !idList.find(d => d === el.id));
        this.setState({ fllowList: _fllowList });
    }

    //查找收藏
    findFollow = (id) => {
        const { fllowList } = this.state;
        return !!fllowList.find(el => el.id === id);
    }

    //设置收藏
    setFollow = (item) => {
        if (this.findFollow(item.id)) {
            this.removeFollow([item.id]);
            ToastAndroid && ToastAndroid.show(` ╮(╯﹏╰）╭ ${i18n.t('COLLECTION_CANCELED')} `, ToastAndroid.SHORT);
        } else {
            this.addFollow(item);
            ToastAndroid && ToastAndroid.show(`ヾ(ｏ･ω･)ﾉ ${i18n.t('SUCCESSFUL_COLLECTION')}`, ToastAndroid.SHORT);
        }
    }

    //设置
    setSettings = (type, value, cb) => {
        const _settings = Object.assign({}, this.state.settings, { [type]: value });
        this.setState({
            settings: _settings
        }, async () => {
            await Storage.save('settings', this.state.settings);
            cb && cb(this.state.settings);
        })
    }

    //设置初始化
    initSettings = (settings) => {
        this.setState({ settings: settings });
    }

    render() {
        const { historyList, fllowList, settings } = this.state;
        return (
            <Store.Provider value={{
                historyList: historyList,
                //initHistory:this.initHistory,
                addHistory: this.addHistory,
                removeHistory: this.removeHistory,
                findHistory: this.findHistory,
                fllowList: fllowList,
                //initFollow:this.initFollow,
                addFollow: this.addFollow,
                removeFollow: this.removeFollow,
                findFollow: this.findFollow,
                setFollow: this.setFollow,
                settings: settings,
                initSettings: this.initSettings,
                setSettings: this.setSettings,
            }}>
                {this.props.children}
            </Store.Provider>
        )
    }
}
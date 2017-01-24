import { observable, computed } from 'mobx';

const historyData = observable([]);

historyData.set = (ret) => {
  historyData = ret;
};
historyData.push = (ret) => {
  historyData.push(ret);
};

export default historyData;
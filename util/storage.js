import React, {
    AsyncStorage
} from 'react-native';

class Storage {
    /**
     * 获取
     */

    static get = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                return JSON.parse(value)
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }


    /**
     * 保存
     */
    static save = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            return true
        } catch (error) {
            // Error saving data
            return false
        }
    }


    /**
     * 更新
     */
    static update = async (key, value) => {
        try {
            await AsyncStorage.mergeItem(key, JSON.stringify(value));
            return true
        } catch (error) {
            // Error saving data
            return false
        }
    }


    /**
     * 删除
     */
    static delete = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            return true
        } catch (error) {
            // Error saving data
            return false
        }
    }
}

export default Storage;
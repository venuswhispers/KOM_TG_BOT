import crypto from 'crypto-js';
import axios from 'axios';
import { chains } from '../../constants/config';
import QuickChart from 'quickchart-js';
import { CHART_DATA_ITEM } from "../../types";

export const encrypt = (text: string, key?: string) => {
    return crypto.AES.encrypt(text, key ? key : process.env.BOT_TOKEN).toString();
}

export const decrypt = (cipherText: string, key?: string) => {
    const bytes = crypto.AES.decrypt(cipherText, key ? key : process.env.BOT_TOKEN);
    return bytes.toString(crypto.enc.Utf8);
    // return bytes.toString();
}

/**
 * fetch specific data from KOM API
 * @param url 
 * @returns 
 */
export const komAPI = async (url: string) => {
    try {
        const headers = {
            'X-Kom-Token': '0xC004e2318722EA2b15499D6375905d75Ee5390B8',
            'accept': 'application/json'
        }
        const { data } = await axios.get(url, { headers });
        return data;
    } catch (err) {
        console.log(err)
        return {
            status: 'failed'
        };
    }
}

/**
 * get Native tokens price from chainbase API
 * @param chainId 
 * @returns 
 */
export const getNativeTokenPrice = async (chainId: number) => {
    const _chain = chains[chainId];
    try {
        const headers = {
            'x-api-key': '2eDS3r6N5KZTEdOGuKRfqVzTyuQ',
            'accept': 'application/json'
        }
        const { data: { data } } = await axios.get(`https://api.coinbase.com/v2/prices/${_chain.symbol}-USD/buy`, { headers });
        return data.amount;
    } catch (err) {
        console.log(err)
        return 0;
    }
}

/**
 * get chart data from api according to chainId
 * @param chainId 
 * @returns object { status: "success", result: {...} }
 */
export const getChartData = async (chainId: number) => {
    return komAPI(`https://api.kommunitas.net/v1/staking/chart/?chainId=${chainId}`);
}

/**
 * 
 * @returns 
 */
export const getKOMTokenPrice = async () => {
    const { status, result } = await komAPI(`https://api.kommunitas.net/v1/website/statistic`);
    if (status === 'success') {
        return result.value;
    } else {
        return 0;
    }
}
/**
 * get statistic data
 * @returns 
 */
export const getStatistics = async () => {
    return komAPI(`https://api.kommunitas.net/v1/staking/statistic`);
}
/**
 * get leaderboard data
 * @returns 
 */
export const getLeaderBoard = async (chainId: number) => {
    return komAPI(`https://api.kommunitas.net/v1/staking/leaderboard/?chainId=${chainId}`);
}
/**
 * get chart image url from quick chart
 * @param data 
 * @returns 
 */
export const getChartURL = async (data: CHART_DATA_ITEM[]) => {
    try {
        const _chart = new QuickChart();

        _chart.setWidth(500)
        _chart.setHeight(300);
        _chart.setVersion('2');

        const _labels = data.map((item: CHART_DATA_ITEM) => item.period)
        const _values = data.map((item: CHART_DATA_ITEM) => item.amount)
        _chart.setConfig({
            "type": "outlabeledPie",
            "data": {
                "labels": _labels,
                "datasets": [{
                    "backgroundColor": ["#FF3784", "#36A2EB", "#4BC0C0", "#F77825", "#9966FF", "#36A2EB", "#FF3784", "#36A2EB"],
                    "data": _values
                }]
            },
            "options": {
                "plugins": {
                    "legend": false,
                    "outlabels": {
                        "text": "%l %p",
                        "color": "white",
                        "stretch": 35,
                        "font": {
                            "resizable": true,
                            "minSize": 12,
                            "maxSize": 18
                        }
                    }
                }
            }
        });
        return _chart.getUrl()
    } catch (err) {
        return ''
    }
}
/**
 * get past staking details from address, and chainId
 * @param chainId 
 * @param address 
 */
export const getPastStakingDetails = async (chainId: number, address: string) => {
    try {
        const { status, result } = await komAPI (`https://api.kommunitas.net/v1/staking/past/?chainId=${chainId}&address=${address}`);
        if (status === 'success') {
            return result;
        } else {
            throw "";
        }
    } catch (err) {
        return []
    }
    
}

/**
 * get Date after x days from now
 * @param x 
 * @returns 
 */
export const getDateAfterXDays = (x: number): Date => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + x * 24 * 60 * 60 * 1000); // Calculate future date in milliseconds
    return futureDate;
}
/**
 * reduce balance
 * @if not number, return "0";
 * @if > 10e+7 10M
 * @if > 10e+4 10K
 * @if 0.001234 0.0012
 * @if 1.000000 1
 *
 * @param number 12.0000123451
 * @returns string
 *
 */
export const reduceAmount = (number: number | string | unknown | bigint, len = 4) => {
    try {
        if (isNaN(Number(number))) throw "0";
        const num = Math.floor(Number(number));
        if (num >= 10 ** 7) throw (num / 10 ** 6).toFixed(2) + "M";
        if (num >= 10 ** 4) throw (num / 10 ** 3).toFixed(2) + "K";
        const decimal = ((number as number) - num).toFixed(20);
        let count = 0;
        let word = true;
        for (let i = 2; i < decimal.length; i++) {
            if (decimal[i] == "0") {
                count++;
            } else {
                word = false;
                break;
            }
        }
        // count = 0;
        if (word || count > 8) {
            throw num;
        } else {
            const _deciaml = Number(decimal).toFixed(count + len);
            throw num + _deciaml.substring(1, _deciaml.length);
        }
    } catch (value: any) {
        return value as string;
    }
};
/**
 * reduce balance
 * @if not number, return "0";
 * @if > 10e+7 10M
 * @if > 10e+4 10K
 * @if 0.001234 0.0012
 * @if 1.000000 1
 *
 * @param number 12.0000123451
 * @returns string
 *
 */
export const formatNumber = (number: number | string | unknown | bigint, len = 4) => {
    if (Number(number) === 0 && isNaN(Number(number))) return 0;
    let [num, _decimal] = String(number).split(".");
    let _num = "";
    let j = 1;
    for (let i = num.length - 1; i >= 1; i--, j++) {
      _num += num[i];
      if (j % 3 === 0) _num += ",";
    }
    _num += num[0];
    let str = _num.split("").reverse().reduce((acc: string, item: string) => acc += item, "");
    if (_decimal) str += `.${_decimal.substring(0,2)}`;
  
    return str;
  };
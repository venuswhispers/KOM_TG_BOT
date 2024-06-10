/**
 * delay specific time Promise
 * @param {*} duration seconds
 * @returns 
 */
export const sleep = (duration: number) => new Promise((resolve: any, reject: any) => {
    try {
        setTimeout(() => {
            resolve();
        }, duration * 1000);
    } catch (err) {
        reject();
    }
});
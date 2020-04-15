import NodeCache from 'node-cache';
import { SqlManager } from './sql.manager';
import { initialCacheTables } from './../constants/cache-key.constants';

class CacheService {
    public cache;

    constructor(ttlSeconds = 60) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
    }

    public get(key, storeFunction) {
        const value = this.cache.get(key);
        if (value) {
            return Promise.resolve(value);
        }

        return storeFunction().then((result) => {
            this.cache.set(key, result);
            return result;
        });
    }

    public del(keys) {
        this.cache.del(keys);
    }

    public delStartWith(startStr = '') {
        if (!startStr) {
            return;
        }

        const keys = this.cache.keys();
        for (const key of keys) {
            if (key.indexOf(startStr) === 0) {
                this.del(key);
            }
        }
    }

    public flush() {
        this.cache.flushAll();
    }

    public setInitialCache = async () => {
        try {

            for (const key in initialCacheTables) {
                if (initialCacheTables.hasOwnProperty(key)) {
                    const query = initialCacheTables[key];
                    await this.get(key, async () => await new SqlManager().Get(query)).then(e => console.log(e));
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    public sgetCacheorDB = async (key, query, options = {}) => {
        try {
            return await this.get(key, async () => await new SqlManager().Get(query, options)).then((result) => {
                return result;
            });
        } catch (error) {
            throw error;
        }
    }

}

export default new CacheService();

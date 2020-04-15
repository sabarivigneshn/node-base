import { UsersQuery } from './../query';

export const enum CacheKeys {
    selectUser = 'selectUser',
}
export const initialCacheTables = {
    [CacheKeys.selectUser]: UsersQuery.selectUser,
};

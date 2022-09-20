import type { QueryFunction, QueryKey, FetchOptions, InitQuery } from './query-core/types'
import type { InitState, RekvOptions, SetStateParam } from './rekv/type'
import { QueryClient } from './query-core/QueryClient'
import { Rekv } from './rekv/index'


export default class Ruzy {
    store: Rekv<any, any> | undefined //Rekv这里需要重命名
    queryStore: QueryClient | undefined

    constructor() {
        this.store = undefined
        this.queryStore = undefined
    }

    initStates(initState: InitState, options?: RekvOptions) {
        this.store = new Rekv(initState, options)
        return this.store.getAllCurrentState()
    }

    initQueries(initQuery: InitQuery) {
        this.queryStore = new QueryClient(initQuery)
        return this.queryStore.getAllQueryData()
    }

    useState(...key: string[]) {
        if (!this.store) return console.error('store未初始化')
        return this.store?.useState(...key)
    }

    setState(param: SetStateParam) {
        if (!this.store) return console.error('store未初始化')
        return this.store?.setState(param)
    }

    getState(key: string) {
        if (!this.store) return console.error('store未初始化')
        return this.store?.getCurrentState(key)
    }

    getAllState() {
        if (!this.store) return console.error('store未初始化')
        return this.store?.getAllCurrentState()
    }

    useQuery(
        keys: QueryKey,
        queryFn: QueryFunction,
        options?: FetchOptions
    ) {
        if (!this.queryStore) return console.error('queryStore未初始化')
        return this.queryStore.useBaseQuery(keys, queryFn, options)
    }

    getQueryData(key: string) {
        if (!this.queryStore) return console.error('queryStore未初始化')
        return this.queryStore.getQueryData({ queryKey: [key] })
    }

    getAllQueryData() {
        if (!this.queryStore) return console.error('queryStore未初始化')
        return this.queryStore.getAllQueryData()
    }
}




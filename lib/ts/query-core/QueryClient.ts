import React from 'react'
import { QueryOptions, QueryState, getDefaultQueryState, InitQueries } from './types'
import { QueryCache } from './QueryCache'
import { QueryObserver } from './QueryObserver'
import { QueryFunction, QueryKey, FetchOptions, QueryObserverResult } from './types'
import { parseQueryArgs } from './utils'


//! client用来提供请求服务  提供三种方法  请求（fetchQuery）  预请求（prefetchQuery） 主动失效（invalidateQueries）


//todo QueryClient是React.context管理的一个全局对象，开发者可以通过React.useContext共享QueryClient。
//todo useQueryClient hook仅仅做了简单包装。
// todo  ------------ fetchQuery------------------------
//!  fetchQuery会调用QueryCache.build尝试从QueryCache中读取Query缓存，从而实现复用曾经请求的数据。提到缓存，
export class QueryClient {
    private queryCache: QueryCache
    constructor() {
        this.queryCache = new QueryCache(this)
    }

    getQueryCache() {
        return this.queryCache
    }

    getQueryData(options: QueryOptions) {
        return this.queryCache.findQuery(options)?.state.data
    }

    getAllQueryData() {
        const querys = this.queryCache.getQueries()
        const res = {}
        for (let hash in querys) {
            const { queryKey, state } = querys[hash]
            const key = queryKey[0]
            const data = state?.data
            const url = state?.data?.request.responseURL
            Object.assign(res, { [key]: { data, url } })
        }
        return res
    }

    fetchQuery(queryOptions: QueryOptions) {
        // 给与retry默认值
        if (typeof queryOptions?.retry === 'undefined') {
            queryOptions.retry = false
        }
        // 新建/找到一个query缓存对象
        const query = this.queryCache.getQuery(queryOptions)

        // 检查数据是否新鲜(新鲜则直接返回数据)
        const isStale = query.isStale(queryOptions.staleTime)

        return isStale
            ? Promise.resolve(query.state.data)
            : query.fetch(queryOptions) //!  延时请求  实际上调用的是query.fetch方法
    }

    useBaseQuery(
        keys: QueryKey,
        queryFn: QueryFunction,
        options?: FetchOptions,
    ): QueryObserverResult {

        // 返回格式化后的options
        const parsedOptions = parseQueryArgs(keys, queryFn, options)

        //构建一个新的Observer  
        const [observer] = React.useState(() => new QueryObserver(this, parsedOptions))

        //监视options变更
        React.useEffect(() => {
            observer.handleOptionsChange(parsedOptions)
        }, [parsedOptions])

        // 创建reRender触发器(updater)  推入listener中 Observer通知组件更新时会触发所有的updater
        const reRenderer = React.useState(undefined)[1]
        observer.subscribe(reRenderer)

        let result = observer.getResult(parsedOptions)

        // 如果是重复调用钩子  则发起请求
        if (result.status !== 'loading' && result.fetchStatus === 'idle') {
            observer.checkAndFetch()
        }

        return observer.trackResult(result)
    }

    initQueries(initQueries: InitQueries) {
        Object.keys(initQueries).map((key: string) => {
            const { fn, initData } = initQueries[key]
            const initState: QueryState = getDefaultQueryState()

            initState.data = initData
            this.queryCache.createQuery(
                {
                    queryKey: [key],  //查询key
                    queryFn: fn, //请求函数
                }
                , initState)
        })

        return this.getAllQueryData()
    }
}
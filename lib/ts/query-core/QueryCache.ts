import type { QueryClient } from './QueryClient';
import { Query } from './Query'
import { QueryState, QueryOptions } from './types'
import { Subscribable } from './subscribable'
import { createQueryHash } from './utils'

//! QueryCache挂载在QueryClient上   这里储存了多个query数据结构  用于管理多个Query
export class QueryCache extends Subscribable {
    private config: {}
    private queries: Set<Query>
    private queriesMap: Record<number, Query>
    private queryClient: QueryClient

    constructor(client: QueryClient, config?: any) {
        super()
        this.config = config || {}
        this.queries = new Set()
        this.queriesMap = {}
        this.queryClient = client
    }

    // 通过options获取query
    getQuery(options: QueryOptions): Query {
        let query = this.findQuery(options)
        return query
    }

    getQueries() {
        return this.queriesMap
    }

    // 新建一个query
    createQuery(options: QueryOptions, state?: QueryState) {
        const queryHash = createQueryHash(options)
        const newQuery = new Query({
            cache: this,
            queryKey: options.queryKey,
            queryHash,
            options,
            state
        })
        this.addQuery(newQuery)

        return newQuery
    }

    // 添加一个query到cache中  (map键值对用于去重)
    addQuery(query: Query) {
        const hash = query.queryHash
        if (!this.queriesMap[hash]) {
            this.queriesMap[hash] = query
            this.queries.add(query)
        }
    }

    // 删除Query
    removeQuery(query: Query) {
        const hash = query.queryHash
        if (this.queriesMap[hash] === query) {
            delete this.queriesMap[hash]
            this.queries.delete(query)
        }

        console.log('删除Query', this.queries);

    }

    // 通过查询键hash 找到query并返回
    findQuery(options: QueryOptions) {
        const queryHash = createQueryHash(options)
        return this.queriesMap[queryHash]
    }

}


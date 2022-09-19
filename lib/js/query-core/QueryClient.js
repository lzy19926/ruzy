"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryClient = void 0;
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const QueryCache_1 = require("./QueryCache");
const QueryObserver_1 = require("./QueryObserver");
const utils_1 = require("./utils");
//! client用来提供请求服务  提供三种方法  请求（fetchQuery）  预请求（prefetchQuery） 主动失效（invalidateQueries）
//todo QueryClient是React.context管理的一个全局对象，开发者可以通过React.useContext共享QueryClient。
//todo useQueryClient hook仅仅做了简单包装。
// todo  ------------ fetchQuery------------------------
//!  fetchQuery会调用QueryCache.build尝试从QueryCache中读取Query缓存，从而实现复用曾经请求的数据。提到缓存，
class QueryClient {
    constructor() {
        this.queryCache = new QueryCache_1.QueryCache(this);
    }
    getQueryCache() {
        return this.queryCache;
    }
    getQueryData(options) {
        var _a;
        return (_a = this.queryCache.findQuery(options)) === null || _a === void 0 ? void 0 : _a.state.data;
    }
    getAllQueryData() {
        var _a;
        const querys = this.queryCache.getQueries();
        const res = {};
        for (let hash in querys) {
            const { queryKey, state } = querys[hash];
            const key = queryKey[0];
            const data = state === null || state === void 0 ? void 0 : state.data;
            const url = (_a = state === null || state === void 0 ? void 0 : state.data) === null || _a === void 0 ? void 0 : _a.request.responseURL;
            Object.assign(res, { [key]: { data, url } });
        }
        return res;
    }
    fetchQuery(queryOptions) {
        // 给与retry默认值
        if (typeof (queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.retry) === 'undefined') {
            queryOptions.retry = false;
        }
        // 新建/找到一个query缓存对象
        const query = this.queryCache.getQuery(queryOptions);
        // 检查数据是否新鲜(新鲜则直接返回数据)
        const isStale = query.isStale(queryOptions.staleTime);
        return isStale
            ? Promise.resolve(query.state.data)
            : query.fetch(queryOptions); //!  延时请求  实际上调用的是query.fetch方法
    }
    useBaseQuery(keys, queryFn, options) {
        // 返回格式化后的options
        const parsedOptions = (0, utils_1.parseQueryArgs)(keys, queryFn, options);
        //构建一个新的Observer  
        const [observer] = react_1.default.useState(() => new QueryObserver_1.QueryObserver(this, parsedOptions));
        //监视options变更
        react_1.default.useEffect(() => {
            observer.handleOptionsChange(parsedOptions);
        }, [parsedOptions]);
        // 创建reRender触发器(updater)  推入listener中 Observer通知组件更新时会触发所有的updater
        const reRenderer = react_1.default.useState(undefined)[1];
        observer.subscribe(reRenderer);
        let result = observer.getResult(parsedOptions);
        // 如果是重复调用钩子  则发起请求
        if (result.status !== 'loading' && result.fetchStatus === 'idle') {
            observer.checkAndFetch();
        }
        return observer.trackResult(result);
    }
    initQueries(initQueries) {
        Object.keys(initQueries).map((key) => {
            const { fn, initData } = initQueries[key];
            const initState = (0, types_1.getDefaultQueryState)();
            initState.data = initData;
            this.queryCache.createQuery({
                queryKey: [key],
                queryFn: fn, //请求函数
            }, initState);
        });
        return this.getAllQueryData();
    }
}
exports.QueryClient = QueryClient;

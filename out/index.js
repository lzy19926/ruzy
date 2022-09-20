"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryClient_1 = require("./query-core/QueryClient");
const index_1 = require("./rekv/index");
class Ruzy {
    constructor() {
        this.store = undefined;
        this.queryStore = undefined;
    }
    initStates(initState, options) {
        this.store = new index_1.Rekv(initState, options);
        return this.store.getAllCurrentState();
    }
    initQueries(initQuery) {
        this.queryStore = new QueryClient_1.QueryClient(initQuery);
        return this.queryStore.getAllQueryData();
    }
    useState(...key) {
        var _a;
        if (!this.store)
            return console.error('store未初始化');
        return (_a = this.store) === null || _a === void 0 ? void 0 : _a.useState(...key);
    }
    setState(param) {
        var _a;
        if (!this.store)
            return console.error('store未初始化');
        return (_a = this.store) === null || _a === void 0 ? void 0 : _a.setState(param);
    }
    getState(key) {
        var _a;
        if (!this.store)
            return console.error('store未初始化');
        return (_a = this.store) === null || _a === void 0 ? void 0 : _a.getCurrentState(key);
    }
    getAllState() {
        var _a;
        if (!this.store)
            return console.error('store未初始化');
        return (_a = this.store) === null || _a === void 0 ? void 0 : _a.getAllCurrentState();
    }
    useQuery(keys, queryFn, options) {
        if (!this.queryStore)
            return console.error('queryStore未初始化');
        return this.queryStore.useBaseQuery(keys, queryFn, options);
    }
    getQueryData(key) {
        if (!this.queryStore)
            return console.error('queryStore未初始化');
        return this.queryStore.getQueryData({ queryKey: [key] });
    }
    getAllQueryData() {
        if (!this.queryStore)
            return console.error('queryStore未初始化');
        return this.queryStore.getAllQueryData();
    }
}
exports.default = Ruzy;

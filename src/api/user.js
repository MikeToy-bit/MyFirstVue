/**
 * @file 用户管理API服务
 * @description 用户管理相关的所有API接口
 */

import request from "@/utils/request";

/**
 * 获取用户信息（简单列表）
 * @returns {Promise} API响应
 */
export const getUserList = () => {
    return request({
        url: "/api/user",
        method: "get",
    });
};

/**
 * 分页查询用户信息
 * @param {Object} queryParams 查询参数
 * @param {string} queryParams.empCode 员工编号
 * @param {string} queryParams.empName 员工姓名
 * @param {string} queryParams.orgCode 组织编码
 * @param {string} queryParams.orgName 组织名称
 * @param {string} queryParams.postCode 岗位编码
 * @param {string} queryParams.postName 岗位名称
 * @param {boolean} queryParams.sex 性别
 * @param {string} queryParams.phoneNumber 电话号码
 * @param {string} queryParams.idCard 身份证号
 * @param {string} queryParams.startCreateTime 开始创建时间
 * @param {string} queryParams.endCreateTime 结束创建时间
 * @param {number} queryParams.pageIndex 页码
 * @param {number} queryParams.pageSize 每页大小
 * @returns {Promise} API响应
 */
export const queryUsers = (queryParams) => {
    return request({
        url: "/api/user/query",
        method: "post",
        data: queryParams,
    });
};

/**
 * 根据员工编号获取用户详情
 * @param {string} empCode 员工编号
 * @returns {Promise} API响应
 */
export const getUserDetail = (empCode) => {
    return request({
        url: `/api/user/${empCode}`,
        method: "get",
    });
};

/**
 * 创建用户
 * @param {Object} userData 用户数据
 * @param {string} userData.empCode 员工编号
 * @param {string} userData.empName 员工姓名
 * @param {string} userData.password 密码
 * @param {string} userData.orgCode 组织编码
 * @param {string} userData.orgName 组织名称
 * @param {string} userData.postCode 岗位编码
 * @param {string} userData.postName 岗位名称
 * @param {boolean} userData.sex 性别
 * @param {string} userData.idType 证件类型
 * @param {string} userData.idCard 身份证号
 * @param {string} userData.birthday 生日
 * @param {string} userData.phoneNumber 电话号码
 * @returns {Promise} API响应
 */
export const createUser = (userData) => {
    return request({
        url: "/api/user",
        method: "post",
        data: userData,
    });
};

/**
 * 更新用户信息
 * @param {Object} userData 用户数据
 * @param {string} userData.empCode 员工编号
 * @param {string} userData.empName 员工姓名
 * @param {string} userData.password 密码（可选）
 * @param {string} userData.orgCode 组织编码
 * @param {string} userData.orgName 组织名称
 * @param {string} userData.postCode 岗位编码
 * @param {string} userData.postName 岗位名称
 * @param {boolean} userData.sex 性别
 * @param {string} userData.phoneNumber 电话号码
 * @returns {Promise} API响应
 */
export const updateUser = (userData) => {
    return request({
        url: "/api/user",
        method: "put",
        data: userData,
    });
};

/**
 * 删除用户（逻辑删除）
 * @param {string} empCode 员工编号
 * @returns {Promise} API响应
 */
export const deleteUser = (empCode) => {
    return request({
        url: `/api/user/${empCode}`,
        method: "delete",
    });
};

/**
 * 批量删除用户
 * @param {Array<string>} empCodes 员工编号数组
 * @returns {Promise} API响应
 */
export const batchDeleteUsers = (empCodes) => {
    return request({
        url: "/api/user/batch-delete",
        method: "post",
        data: empCodes,
    });
};

/**
 * 恢复已删除的用户
 * @param {string} empCode 员工编号
 * @returns {Promise} API响应
 */
export const restoreUser = (empCode) => {
    return request({
        url: `/api/user/restore/${empCode}`,
        method: "post",
    });
};

/**
 * 获取用户菜单
 * @returns {Promise} API响应
 */
export const getUserMenus = () => {
    return request({
        url: "/api/user/getMenusByToken",
        method: "get",
    });
};

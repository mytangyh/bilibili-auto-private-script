// ==UserScript==
// @name         Bilibili稿件自动设置仅自己可见（多线程版）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动将B站稿件中心的视频设置为仅自己可见，并支持自动翻页和切换执行状态，执行速度优化
// @match        https://member.bilibili.com/platform/upload-manager/article*
// @match        https://member.bilibili.com/platform/upload/video/frame*
// @author       mytangyh
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519452/Bilibili%E7%A8%BF%E4%BB%B6%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E4%BB%85%E8%87%AA%E5%B7%B1%E5%8F%AF%E8%A7%81%EF%BC%88%E5%A4%9A%E7%BA%BF%E7%A8%8B%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/519452/Bilibili%E7%A8%BF%E4%BB%B6%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E4%BB%85%E8%87%AA%E5%B7%B1%E5%8F%AF%E8%A7%81%EF%BC%88%E5%A4%9A%E7%BA%BF%E7%A8%8B%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 全局变量：控制任务状态
    let stopExecution = true;

    // 触发鼠标事件的函数
    function triggerMouseEvent(element, eventType) {
        const event = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }

    // 等待元素出现的函数
    function waitForElement(selector, maxAttempts = 10, interval = 200) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const checker = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checker);
                    resolve(element);
                }
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(checker);
                    reject(new Error(`Element ${selector} not found`));
                }
            }, interval);
        });
    }

    // 自动设置仅自己可见的函数
    async function processItem(item) {
        try {
            // 检查是否已为“仅自己可见”
            const isPrivate = item.querySelector('.article-only-self-tag.only-self-tag');
            if (isPrivate) {
                console.log('该稿件已为“仅自己可见”，跳过');
                return;
            }

            // 找到“更多”按钮并触发操作
            const moreButton = item.parentElement.querySelector('.more-btn');
            if (moreButton) {
                triggerMouseEvent(moreButton, 'mouseenter');
                await new Promise(resolve => setTimeout(resolve, 100));

                // 找到所有下拉菜单中的选项
                const selectItems = document.querySelectorAll('.select-box .left.select-item');
                const visibilityButton = selectItems[1];
                if (visibilityButton) {
                    visibilityButton.click();

                    // 等待单选框出现
                    await waitForElement('.bcc-radio-group');

                    // 找到“仅自己可见”的单选按钮
                    const radioButtons = document.querySelectorAll('.bcc-radio-group .bcc-radio');
                    if (radioButtons.length > 1) {
                        radioButtons[1].click();

                        // 等待确定按钮出现并点击
                        await waitForElement('.bcc-dialog__footer .bcc-button.cc-aosd-btn.bcc-button--primary.large');
                        const confirmButton = document.querySelector('.bcc-dialog__footer .bcc-button.cc-aosd-btn.bcc-button--primary.large');
                        if (confirmButton) {
                            confirmButton.click();
                        }
                    }
                }
            }
        } catch (error) {
            console.error('处理稿件时出错:', error);
        }
    }

    // 并发处理当前页面的所有稿件
    async function setVisibilityToPrivateConcurrently() {
        const items = Array.from(document.querySelectorAll('.cover-wrp'));
        const tasks = items.map(item => processItem(item));
        await Promise.all(tasks); // 并发执行
    }

    // 翻页逻辑
    async function autoPaginate() {
        try {
            while (!stopExecution) {
                // 执行当前页操作
                await setVisibilityToPrivateConcurrently();

                // 检查是否有“下一页”按钮，并可点击
                const nextButton = document.querySelector('.bcc-pagination-item.bcc-pagination-next');
                if (!nextButton || nextButton.classList.contains('disabled')) {
                    console.log('没有更多页面可以处理，操作完成');
                    alert('所有页面已设置完成');
                    break;
                }

                // 点击下一页按钮
                nextButton.click();
                console.log('点击下一页按钮');

                // 等待下一页加载
                await new Promise(resolve => setTimeout(resolve, 1000)); // 加快翻页等待时间
            }
        } catch (error) {
            console.error('翻页过程中出错:', error);
            alert('翻页过程中出现错误，请检查控制台日志');
        }
    }

    // 创建切换按钮
    function createToggleButton() {
        const button = document.createElement('button');
        button.textContent = '一键设置为仅自己可见：开始执行';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#00a1d6';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => {
            stopExecution = !stopExecution;
            button.textContent = stopExecution ? '一键设置为仅自己可见：开始执行' : '停止执行';
            button.style.backgroundColor = stopExecution ? '#00a1d6' : '#ff4d4f';
            if (!stopExecution) {
                autoPaginate();
            }
        });
        document.body.appendChild(button);
    }

    // 页面加载完成后添加按钮
    window.addEventListener('load', createToggleButton);
})();

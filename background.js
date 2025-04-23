let lastActiveTabGroupInfo = {}; // { windowId: groupId }

async function handleTabActivated(activeInfo) {
    try {
        const activatedTab = await browser.tabs.get(activeInfo.tabId);
        console.log(activatedTab);
        lastActiveTabGroupInfo[activeInfo.windowId] = activatedTab.groupId || -1;
        console.log(`Window ${activeInfo.windowId} activated tab ${activeInfo.tabId}, group: ${lastActiveTabGroupInfo[activeInfo.windowId]}`);
    } catch (error) {
        // 如果获取标签页信息失败 (例如标签页快速关闭)，则清除该窗口信息或记录错误
        // console.error(`Error getting activated tab ${activeInfo.tabId}:`, error);
        // 可以选择清除，以防使用过时信息: delete lastActiveTabGroupInfo[activeInfo.windowId];
    }
}

browser.tabs.onActivated.addListener(handleTabActivated);

async function moveToGroupIfExist(newTab) {
    const windowId = newTab.windowId;
    const targetGroupId = lastActiveTabGroupInfo[windowId];

    if (targetGroupId && targetGroupId !== -1) {
        console.log(`Moving new tab ${newTab.id} to previously active group ${targetGroupId} in window ${windowId}`);
        try {
            await browser.tabs.group({ groupId: targetGroupId, tabIds: [newTab.id] });
            console.log(`Tab ${newTab.id} moved successfully to group ${targetGroupId}.`);
        } catch (error) {
            console.error(`Error moving tab ${newTab.id} to group ${targetGroupId}:`, error);
        }
    } else {
        // 如果缓存中没有信息，或者之前活动的标签页不在组内，则不进行操作
        // console.log(`New tab ${newTab.id} created in window ${windowId}. No previous active group found or needed. Previous group was: ${targetGroupId}`);
    }
}

browser.tabs.onCreated.addListener(moveToGroupIfExist);

let lastActiveTabGroup = -1

async function handleTabActivated(activeInfo) {
    try {
        const activatedTab = await browser.tabs.get(activeInfo.tabId);
        lastActiveTabGroup = activatedTab.groupId || -1;
    } catch (error) {
        console("Can't get active tag group info: ", error);
    }
}

async function moveToGroupIfExist(newTab) {
    if (lastActiveTabGroup && lastActiveTabGroup !== -1) {
        try {
            await browser.tabs.group({ groupId: lastActiveTabGroup, tabIds: [newTab.id] });
        } catch (error) {
            console.error("Can't moving tab ${newTab.id} to group ${lastActiveTabGroup}: ", error);
        }
    }
}

browser.tabs.onCreated.addListener(moveToGroupIfExist);

// browser.tabs.onActivated.addListener(handleTabActivated);

// Keyborard shortcut
browser.commands.onCommand.addListener((cmd) => {
    if (cmd === "open-tab-outside") {
        let newTab = browser.tabs.create({});
        newTab.then( (t) => {
            console.log("new tab: ", t);
            browser.tabs.ungroup([t.id]);
        });
    }
});

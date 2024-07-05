import { updateAvatarLocation, getLocations } from './avatar.js';
import { takeItem, useItem, leaveItem, getAvatarItems, getItemsForLocation } from './item.js';

let locations = [];

try {
    locations = await getLocations();
} catch (error) {
    console.error('Failed to get locations:', error);
}

const tools = {
    MOVE: async (avatar, locationName) => {
        const newLocation = findLocation(locationName);
        if (newLocation) {
            avatar.location = newLocation;
            await updateAvatarLocation(avatar);
            // get the items in this location
            const items = await getItemsForLocation(newLocation.name);
            return `Moved to ${newLocation.name}.\n\n${
                items.length > 0
                    ? `Items in this location: ${items.map(i => i.name).join(', ')}`
                    : 'No items in this location.'
            }`;
        }
        return `Location "${locationName}" not found.`;
    },
    TAKE: async (avatar, itemName) => {
        const item = findItem(avatar, itemName);
        if (item) {
            return await takeItem(avatar, itemName);
        }
        return `Item "${itemName}" not found.`;
    },
    USE: async (avatar, itemName) => {
        const item = findItem(avatar, itemName);
        if (item) {
            return await useItem(avatar, itemName);
        }
        return `Item "${itemName}" not found.`;
    },
    DROP: async (avatar, itemName) => {
        const item = findItem(avatar, itemName);
        if (item) {
            return await leaveItem(avatar, itemName);
        }
        return `Item "${itemName}" not found.`;
    }
};

function findLocation(name) {
    return locations.find(loc => loc.name.toLowerCase() === name.toLowerCase());
}

function findItem(avatar, name) {
    return getAvatarItems(avatar).find(o => o.name.toLowerCase() === name.toLowerCase());
}

export async function callTool(command, avatar, conversation) {
    console.log(`⚒️ Calling command: ${command} for avatar: ${avatar.name}`);

    try {
        const [tool, ...params] = command.split(' ');
        const toolName = tool.toUpperCase();
        const toolFunction = tools[toolName];

        if (!toolFunction) {
            return `Tool "${toolName}" not found. Available tools are: ${Object.keys(tools).join(', ')}`;
        }

        const param = params.join(' ').replace(/["']/g, '').trim(); // Remove quotes and trim whitespace
        if (!param) {
            return `No parameter provided for tool "${toolName}".`;
        }

        return await toolFunction(avatar, param);
    } catch (error) {
        console.error(`Error calling command "${command}" for avatar "${avatar.name}":`, error);
        return `Error calling command "${command}": ${error.message}`;
    }
}

export function getAvailableTools() {
    return Object.keys(tools);
}

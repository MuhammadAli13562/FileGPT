"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMetaSelect = exports.ContextMetaSelect = exports.UserSelect = exports.ContextSelect = void 0;
exports.ContextSelect = {
    Id: true,
    createdAt: true,
    updatedAt: true,
    chatEngineMessages: true,
    ChatWindowMessages: {
        orderBy: {
            createdAt: "asc",
        },
    },
    vectorURL: true,
    fileName: true,
    fileURL: true,
    fileKey: true,
    ownerId: true,
};
exports.UserSelect = {
    Id: true,
    createdAt: true,
    updatedAt: true,
    name: true,
    email: true,
    contextWindows: {
        select: exports.ContextSelect,
    },
};
exports.ContextMetaSelect = {
    Id: true,
    createdAt: true,
    updatedAt: true,
    fileName: true,
    fileURL: true,
    fileKey: true,
    ownerId: true,
};
exports.UserMetaSelect = {
    Id: true,
    createdAt: true,
    updatedAt: true,
    name: true,
    email: true,
    contextWindows: {
        select: exports.ContextMetaSelect,
    },
};
